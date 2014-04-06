module Sitelet.Review

open IntelliFactory.WebSharper
open SEOLib
open SEOLib.Html
open Sitelet.Details

type ReviewResult =
    | InvalidUri
    | GetFailed
    | NotHtml
    | Success of Review
      
and Review =
    {
        Details : UriDetails
        Keywords : Keywords.Keyword list //Keyword list
        Hyperlinks : Hyperlink list
        Errors : Violations.Violation list
        Warnings : Violations.Violation list
        Headers : Http.HttpHeader list
        Speed : PageSpeed.PageSpeedReview option
    }

    static member New details keywords hyperlinks errors warnings headers speed =
        {
            Details = details
            Keywords = keywords
            Hyperlinks = hyperlinks
            Errors = errors
            Warnings = warnings
            Headers = headers
            Speed = speed
        }

//and Keyword = Keywords.Keyword

and Hyperlink =
    {
        UriString : string
        Anchor : string
        Type : string
        Rel : string
    }

    static member New uriString anchor linkType rel =
        {
            UriString = uriString
            Anchor = anchor
            Type = linkType
            Rel = rel
        }

module private Server =
    open System
    
    let private tryCreateUri uriString =
        match Uri.TryCreate(uriString, UriKind.Absolute) with
        | false, _ ->
            match Uri.TryCreate("http://" + uriString, UriKind.Absolute) with
            | false, _ -> None
            | true, x -> Some x
        | true, x -> Some x

    [<Remote>]
    let review uriString =
        async {
            let uriOption = tryCreateUri uriString
            match uriOption with
            | None -> return InvalidUri
            | Some uri ->
                let! httpInfoOption = Http.getAsync uri
                match httpInfoOption with
                | None -> return GetFailed
                | Some httpInfo ->
                    let uriDetails = Details.review httpInfo
                    match uriDetails.IsHtml with
                    | false -> return NotHtml
                    | true ->
                        let keywords, hyperlinks, errors, warnings =
                            match httpInfo.Html with
                            | None -> [], [], [], []
                            | Some html ->
                                let hyperlinks =
                                    Html.hyperlinks html uri
                                    |> List.map (fun x ->
                                        let linkType =
                                            match x.Type with
                                            | Internal -> "Internal"
                                            | _ -> "External"
                                        let rel =
                                            match x.Rel with
                                            | Follow -> "Follow"
                                            | _ -> "NoFollow"
                                        Hyperlink.New x.UriString x.Anchor linkType rel)
                                let errors, warnings = Violations.review html uri |> List.partition (fun x -> x.Level = Violations.ViolationLevel.Error)
                                Keywords.analyze html, hyperlinks, errors, warnings
                        let speedService = PageSpeed.SpeedService SpeedApi.key
                        let! speedReview = speedService.Review <| uri.ToString()
                        return Success <| Review.New uriDetails keywords hyperlinks errors warnings httpInfo.Headers speedReview
        }

[<JavaScript>]
module private Js =
    open IntelliFactory.WebSharper.Google.Visualization
    open IntelliFactory.WebSharper.Google.Visualization.Base
    open IntelliFactory.WebSharper.Html
    open IntelliFactory.WebSharper.JQuery

    [<AutoOpen>]
    module Details =

        let displayTitle uriDetails =
            let title, length =
                match uriDetails.Title with
                | None -> "MISSING", 0
                | Some x -> x, x.Length
            ById("title").TextContent <- title
            match length with
            | 0 -> ()
            | _ ->
                ById("title-length").TextContent
                    <- "(" + string length + " characters)"

        let displayMetaDesc uriDetails =
            let metaDesc, length =
                match uriDetails.MetaDescription with
                | None -> "MISSING", 0
                | Some x -> x, x.Length
            ById("meta-description").TextContent <- metaDesc
            match length with
            | 0 -> ()
            | _ ->
                ById("meta-description-length").TextContent
                    <- "(" + string length + " characters)"

        let navTab isActive idxString =
            let li =
                match isActive with
                | false -> LI []
                | true -> LI [Attr.Class "active"]
            li -< [
                A [
                    Attr.HRef <| "#headings-tab-" + idxString
                    HTML5.Attr.Data "toggle" "tab"
                ] -- Text ("H" + idxString)
            ]

        let makeNavTabs uriDetails =
            let lis =
                uriDetails.Headings
                |> Seq.groupBy (fun x -> x.Level)
                |> Seq.mapi (fun idx _ ->
                    let idxString = string <| idx + 1
                    match idx with
                    | 0 -> navTab true idxString
                    | _ -> navTab false idxString)
            UL [Attr.Class "nav nav-tabs"] -< lis

        let tabPane isActive idxString (headings:seq<Heading>) =
            let div =
                match isActive with
                | false -> Div [Attr.Class "tab-pane fade"]
                | true -> Div [Attr.Class "tab-pane fade in active"]
            div
            -- (Attr.Id <| "headings-tab-" + idxString)
            -< [
                UL [Attr.Class "list-group"] -< [
                    for x in headings ->
                        LI [Attr.Class "list-group-item"]
                        -- Text x.Text
                ]
            ]

        let makeTabPanes uriDetails =
                let divs =
                    uriDetails.Headings
                    |> Seq.groupBy (fun x -> x.Level)
                    |> Seq.mapi (fun idx (level, headings) ->
                        let idxString = string <| idx + 1
                        match idx with
                        | 0 -> tabPane true idxString headings
                        | _ -> tabPane false idxString headings)
                Div [Attr.Class "tab-content"]
                -< divs

        let displayHeadings uriDetails =
            let navTabs = makeNavTabs uriDetails
            let tabPanes = makeTabPanes uriDetails
            JQuery.Of("#headings")
                .Append(navTabs.Dom)
                .Append(tabPanes.Dom)
                .Ignore

        let displayDetails uriDetails =
            ById("request-uri").TextContent
                <- uriDetails.RequestUri
            ById("response-time").TextContent
                <- string uriDetails.ResponseTime + " ms"
            ById("text-html-ratio").TextContent
                <- string uriDetails.TextHtmlRatio + " %"
            displayTitle uriDetails
            displayMetaDesc uriDetails
            displayHeadings uriDetails

    [<AutoOpen>]
    module Keywords =
        let keywordsTable (keywords:Keywords.Keyword list) divId =
            let data =
                let dataTable = new Base.DataTable()
                dataTable.addColumn(ColumnType.StringType, "Combination") |> ignore
                dataTable.addColumn(ColumnType.NumberType, "Occurrence") |> ignore
                dataTable.addColumn(ColumnType.NumberType, "Density") |> ignore
                dataTable.addRows(keywords.Length) |> ignore
                keywords
                |> List.iteri (fun idx x ->
                    dataTable.setCell(idx, 0, x.Combination)
                    dataTable.setCell(idx, 1, x.Occurrence)
                    dataTable.setCell(idx, 2, x.Density))
                dataTable
            let tableElt = Div []
            let table = new Table(tableElt.Dom)
            let options = TableOptions(sortColumn = 1., sortAscending = false)
            table.draw(data, options)       
            ById(divId).AppendChild(tableElt.Dom) |> ignore

        let displayKeywords (keywords:Keywords.Keyword list) =
            let oneKeyword = keywords |> List.filter (fun x -> x.WordsCount = 1)
            let twoKeywords = keywords |> List.filter (fun x -> x.WordsCount = 2)
            let threeKeywords = keywords |> List.filter (fun x -> x.WordsCount = 3)
            keywordsTable oneKeyword "keywords-tab-1"
            keywordsTable twoKeywords "keywords-tab-2"
            keywordsTable threeKeywords "keywords-tab-3"

    [<AutoOpen>]
    module Hyperlinks =
        let table (hyperlinks:Hyperlink list) =
            Table [Attr.Class "table table-hover"] -< [
                yield TR [
                    TH [Text "URL"]
                    TH [Text "Anchor"]
                    TH [Text "Rel"]
                ]
                for x in hyperlinks do
                    yield TR [
                        TD [A [HRef x.UriString; Text x.UriString]]
                        TD [Text x.Anchor]
                        TD [Text x.Rel]
                    ]
            ]

        let makeDataTable column column' (rows : ('T * 'U) list) =
            let dataTable = DataTable()
            dataTable.addColumn(ColumnType.StringType, column) |> ignore
            dataTable.addColumn(ColumnType.NumberType, column') |> ignore
            dataTable.addRows rows.Length |> ignore
            rows |> List.iteri (fun idx (x, y) ->
                dataTable.setCell(idx, 0, x)
                dataTable.setCell(idx, 1, y))
            dataTable

        let drawPie dataTable =
            let div = Div []
            let pie = PieChart(div.Dom)
            let options = PieChartOptions()
            options.height <- 400
            options.width <- 400
            pie.draw(dataTable, options)
            div

        let displayHyperlinks hyperlinks =
            let external, ``internal`` =
                List.partition
                    (fun (x:Hyperlink) -> x.Type = "External")
                    hyperlinks
            let follow, nofollow = List.partition (fun x -> x.Rel = "Follow") hyperlinks
            let inTable = table ``internal``
            let exTable = table external
            ById("internal-links-tab").AppendChild inTable.Dom |> ignore
            ById("external-links-tab").AppendChild exTable.Dom |> ignore
            let dataTable =
                makeDataTable
                    "Hyperlinks Type"
                    "Count"
                    ["External", external.Length; "Internal", ``internal``.Length]
            let dataTable' =
                makeDataTable
                    "Hyperlinks Rel"
                    "Count"
                    ["Follow", follow.Length; "NoFollow", nofollow.Length]
            let pie = drawPie dataTable
            let pie' = drawPie dataTable'
            ById("type-stats").AppendChild(pie.Dom) |> ignore
            ById("rel-stats").AppendChild(pie'.Dom) |> ignore

    [<AutoOpen>]
    module Violations =

        let displayViolations (violations:Violations.Violation list) id =
            violations
            |> List.iteri (fun idx x ->
                let line, column =
                    match x.Position with
                    | None -> "NA", "NA"
                    | Some p -> string p.Line, string p.Column
                let elt =
                    Div [Attr.Class "panel panel-default"] -< [
                        Div [Attr.Class "panel-heading"] -< [
                            H4 [Attr.Class "panel-title"] -< [
                                A [HTML5.Attr.Data "toggle" "collapse"; HTML5.Attr.Data "parent" <| "#" + id; HRef <| "#error-" + string idx]
                                -- Text x.Heading
                            ]
                        ]
                        Div [Attr.Id <| "error-" + string idx; Attr.Class "panel-collapse collapse"] -< [
                            Div [Attr.Class "panel-body"] -< [
                                Div [Attr.Class "row"] -< [
                                    Div [Attr.Class "col-md-3 row-heading"; Text "Line"]
                                    Div [Attr.Class "col-md-9"; Text line]
                                ]
                                Div [Attr.Class "row"] -< [
                                    Div [Attr.Class "col-md-3 row-heading"; Text "Column"]
                                    Div [Attr.Class "col-md-9"; Text column]
                                ]
                                Div [Attr.Class "row"] -< [
                                    Div [Attr.Class "col-md-3 row-heading"; Text "Description"]
                                    Div [Attr.Class "col-md-9"; Text x.Description]
                                ]
                                Div [Attr.Class "row"] -< [
                                    Div [Attr.Class "col-md-3 row-heading"; Text "Recommendation"]
                                    Div [Attr.Class "col-md-9"; Text x.Recommendation]
                                ]
                            ]
                        ] 
                    ]
                ById(id).AppendChild elt.Dom |> ignore)

        let displayErrors (errors:Violations.Violation list) =
            ById("errors-nav-tab").TextContent <- "Errors (" + string errors.Length + ")"
            displayViolations errors "errors-accordion"        

        let displayWarnings (warnings:Violations.Violation list) =
            ById("warnings-nav-tab").TextContent <- "Warnings (" + string warnings.Length + ")"
            displayViolations warnings "warnings-accordion"        

    [<AutoOpen>]
    module Headers =

        let displayHeaders (headers:Http.HttpHeader list) =
            Table [Attr.Class "table table-hover"] -< [
                yield TR [
                    TH [Text "Key"]
                    TH [Text "Value"]
                ]
                for x in headers do
                    for y in x.Values do
                        yield TR [
                            TD [Text x.Key]
                            TD [Text y]
                        ]
            ]
            |> fun elt -> ById("headers-panel-body").AppendChild elt.Dom |> ignore
       
    [<AutoOpen>]
    module Speed =
        
        let displayScore (speedReview:PageSpeed.PageSpeedReview) =
            ById("speed-score").TextContent <- string speedReview.Score

        let displaySuggestions (suggestions:PageSpeed.PageSpeedRule list) =
            suggestions
            |> List.filter (fun x -> x.Impact > 0.)
            |> List.iteri (fun idx x ->
//                let line, column =
//                    match x.Position with
//                    | None -> "NA", "NA"
//                    | Some p -> string p.Line, string p.Column
                let elt =
                    Div [Attr.Class "panel panel-default"] -< [
                        Div [Attr.Class "panel-heading"] -< [
                            H4 [Attr.Class "panel-title"] -< [
                                A [HTML5.Attr.Data "toggle" "collapse"; HTML5.Attr.Data "parent" "#suggestions-accordion"; HRef <| "#suggestion-" + string idx]
                                -- Text x.Name
                            ]
                        ]
                        Div [Attr.Id <| "suggestion-" + string idx; Attr.Class "panel-collapse collapse"] -< [
                            Div [Attr.Class "panel-body"] -< [
                                for y in x.Details do
                                    
                                    yield Div [
                                        Div [
                                            match y.Hyperlink with
                                            | None -> yield Text y.Header
                                            | Some hyperlink -> yield A [HRef hyperlink; Attr.Target "_blank"; Text y.Header] :> _
                                        ]
                                        UL [
                                            for url in y.Urls do
                                                yield LI [Text url]
                                        ]
                                    ]
//                                Div [Attr.Class "row"] -< [
//                                    Div [Attr.Class "col-md-3 row-heading"; Text "Column"]
//                                    Div [Attr.Class "col-md-9"; Text column]
//                                ]
//                                Div [Attr.Class "row"] -< [
//                                    Div [Attr.Class "col-md-3 row-heading"; Text "Description"]
//                                    Div [Attr.Class "col-md-9"; Text x.Description]
//                                ]
//                                Div [Attr.Class "row"] -< [
//                                    Div [Attr.Class "col-md-3 row-heading"; Text "Recommendation"]
//                                    Div [Attr.Class "col-md-9"; Text x.Recommendation]
//                                ]
                            ]
                        ] 
                    ]
                ById("suggestions-accordion").AppendChild elt.Dom |> ignore)
        
        let displayResourcesStats (stats:PageSpeed.PageStats) =
            ById("hosts").TextContent <- string stats.Hosts
            ById("css-resources").TextContent <- string stats.CssResources
            ById("js-resources").TextContent <- string stats.JsResources
            ById("static-resources").TextContent <- string stats.StaticResources
            ById("total-resources").TextContent <- string stats.TotalResources
           
        let displayBytesStats (stats:PageSpeed.PageStats) =
            let dataTable =
                makeDataTable
                    "Bytes"
                    "Size"
                    ["CSS", stats.CssBytes; "Flash", stats.FlashBytes; "HTML", stats.HtmlBytes; "Image", stats.ImageBytes; "Other", stats.OtherBytes; "Text", stats.TextBytes]
            let pie = drawPie dataTable
            ById("bytes-stats").AppendChild(pie.Dom) |> ignore
                 
        let displayScreenshot (review:PageSpeed.PageSpeedReview) =
            let elt =
                A [
                    Attr.HRef review.Uri
                    Attr.Target "_blank"
                ] -< [
                    Img [
                        Attr.Class "img-responsive img-thumbnail"
                        Attr.Src review.Screenshot]
                ]
            JavaScript.Log review.Screenshot
            ById("screenshot").AppendChild elt.Dom |> ignore
                              
    [<Inline "$('body').scrollspy({ target: '#affix-nav' })">]
    let scrollspy() = X<unit>

    [<Inline "$('#page-header').tooltip(options)">]
    let tooltip() = X<unit>

    let trimUri (uriString:string) =
        let length = uriString.Length
        match length with
        | _ when length <= 30 -> uriString
        | _ ->
            let str = Seq.take 15 uriString |> Seq.map string |> String.concat ""
            let str' = Seq.skip (length - 15) uriString |> Seq.map string |> String.concat ""
            str + "..." + str'

    let showReview (progressJq:JQuery) (requestUri:string) =
        let pageHeaderJq = JQuery.Of("#page-header")
        match requestUri.Length with
        | x when x <= 30 -> pageHeaderJq.Text("Review of " + requestUri).Ignore
        | _ ->
            pageHeaderJq
                .Text("Review of " + trimUri requestUri)
                .Attr("title", requestUri)
                .Ignore
            tooltip()
        progressJq.Remove().Ignore
        JQuery.Of("#jumbotron").Remove().Ignore
//        JQuery.Of("#page-header").Show().Ignore
        JQuery.Of("#review").FadeIn().Ignore
        scrollspy()

    [<Inline "$('#review-btn').button('loading')">]
    let loading() = X<unit>

    [<Inline "$('#review-btn').button('reset')">]
    let notLoading() = X<unit>

    let review uriString =
        async {
            JQuery.Of("#alert").Hide().Ignore
            loading()
            let progressJq = JQuery.Of("#progress")
//            progressJq.Show().Ignore
            let! result = Server.review uriString
            match result with
            | InvalidUri ->
                progressJq.Hide().Ignore
                JavaScript.Alert "The URL is invalid."
            | GetFailed ->
                notLoading()
//                ById("#alert-text")
                let alert =
                    Div [Attr.Class "alert alert-danger"; Attr.Id "alert"] -< [
                    //<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                        Button [Attr.Type "button"; Attr.Class "close"; HTML5.Attr.Data "dismiss" "alert"; Attr.NewAttr "aria-hidden" "true"] -< [Text "×"]
                        Div [Text "Downloading the URL failed."]
                    ]
                JQuery.Of(".jumbotron").Append(alert.Dom).Ignore
            | NotHtml ->
                progressJq.Hide().Ignore                
                JavaScript.Alert "The URL is not an HTML page."
            | Success review ->
                let uriDetails = review.Details
                displayDetails uriDetails
                displayKeywords review.Keywords
                displayHyperlinks review.Hyperlinks
                displayErrors review.Errors
                displayWarnings review.Warnings
                displayHeaders review.Headers
                match review.Speed with
                | None -> ()
                | Some speedReview ->
                    displayScore speedReview
                    displaySuggestions speedReview.Rules
                    displayResourcesStats speedReview.Stats
                    displayBytesStats speedReview.Stats
                    displayScreenshot speedReview
                showReview progressJq uriDetails.RequestUri
        } |> Async.Start

    module UriStringPiglet =
        open IntelliFactory.WebSharper.Piglets

        type UriString = string

        let view uriString submit =
            Div [
                Attr.Class "input-group input-group-lg col-md-8 col-md-offset-2"
            ] -< [
                Controls.Input uriString -<[
                    Attr.Class "form-control"
                    Attr.Id "uri"
                    HTML5.Attr.AutoFocus "autofocus"
                ]
                |>! OnKeyUp (fun _ key ->
                    match key.KeyCode with
                        | 13 ->
                            JQuery.Of("#uri").Blur().Ignore
                            JQuery.Of("#review-btn").Click().Ignore
                        | _  -> ())    
                Span [Attr.Class "input-group-btn"] -< [
                    Controls.SubmitValidate submit -< [
                        Attr.Class "btn btn-primary"
                        Attr.Id "review-btn"
                        Attr.Value "Review"
                        HTML5.Attr.Data "loading-text" "Please wait..."
                    ]
                ]
            ]

        let piglet (init: UriString) =
            Piglet.Return (fun uriString -> uriString)
            <*> Piglet.Yield init
                |> Piglet.Validation.Is Piglet.Validation.NotEmpty "Please enter a valid URL."
            |> Piglet.WithSubmit

        let main() =
            piglet ""
            |> Piglet.Run (fun uriString -> review uriString)
            |> Piglet.Render view

type Control() =
    inherit Web.Control()
    
    [<JavaScript>]
    override __.Body = Js.UriStringPiglet.main() :> _