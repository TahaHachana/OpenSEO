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
        Keywords : Keywords.Keyword list
        Hyperlinks : Hyperlink list
        Errors : Violations.Violation list
        Warnings : Violations.Violation list
        Headers : Http.HttpHeader list
        Speed : PageSpeed.SpeedReview option
    }

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
            | true, uri -> Some uri
        | true, uri -> Some uri

    let fSome f =
        function
        | None -> []
        | Some some -> f some

    let keywordsList = fSome Keywords.analyze

    let processHyperlink (hyperlink:Html.Hyperlink) =
        let linkType =
            match hyperlink.Type with
            | Internal -> "Internal"
            | _ -> "External"
        let rel =
            match hyperlink.Rel with
            | Follow -> "Follow"
            | _ -> "NoFollow"
        Hyperlink.New hyperlink.Uri hyperlink.Anchor linkType rel

    let hyperlinksList uri = fSome (fun html -> Html.hyperlinks html uri)

    let violationsList uri = fSome (fun html -> Violations.review html uri)

    let reviewSpeed uriString =
        async {
            let speedService = PageSpeed.SpeedService SpeedApi.key
            return! speedService.Review uriString
        }

    let makeReview (httpInfo:Http.HttpInfo) uri details =
        async {
            let htmlOption = httpInfo.Html
            let hyperlinks =
                hyperlinksList uri htmlOption
                |> List.map processHyperlink
            let errors, warnings =
                violationsList uri htmlOption
                |> List.partition (fun x -> x.Level = Violations.ViolationLevel.Error)
            let! speedReview = reviewSpeed <| uri.ToString()
            let review =
                {
                    Details = details
                    Keywords = keywordsList htmlOption
                    Hyperlinks = hyperlinks
                    Errors = errors
                    Warnings = warnings
                    Headers = httpInfo.Headers
                    Speed = speedReview
                }
            return Success review
        }

    let reviewHttpInfo (httpInfo:Http.HttpInfo) uri =
        async {
            let details = Details.uriDetails httpInfo
            match details.IsHtml with
            | false -> return NotHtml
            | true -> return! makeReview httpInfo uri details
        }

    let reviewHttpInfoOption (httpInfoOption:Http.HttpInfo option) uri =
        async {
            match httpInfoOption with
            | None -> return GetFailed
            | Some httpInfo -> return! reviewHttpInfo httpInfo uri
        }

    let reviewUri uri =
        async {
            let! httpInfoOption = Http.getAsync uri
            return! reviewHttpInfoOption httpInfoOption uri
        }

    let reviewResult uriOption =
        async {
            match uriOption with
            | None -> return InvalidUri
            | Some uri -> return! reviewUri uri
        }

    [<Remote>]
    let review uriString =
        async {
            let uriOption = tryCreateUri uriString
            return! reviewResult uriOption
        }

[<JavaScript>]
module private Js =
    open IntelliFactory.WebSharper.Google.Visualization
    open IntelliFactory.WebSharper.Google.Visualization.Base
    open IntelliFactory.WebSharper.Html
    open IntelliFactory.WebSharper.JQuery

    [<AutoOpen>]
    module Details =

        let setText id text = ById(id).TextContent <- text

        let displayDetail detail id id' =
            let detail, length =
                match detail with
                | None -> "NA", 0
                | Some x -> x, x.Length
            setText id detail
            if length > 0 then setText id' <| "(" + string length + " characters)"

        let displayTitle title = displayDetail title "title" "title-length"

        let displayMetaDesc metaDescription = displayDetail metaDescription "meta-description" "meta-description-length"

        let navTab isActive idxString level =
            LI [
                A [
                    Attr.HRef <| "#headings-tab-" + idxString
                    HTML5.Attr.Data "toggle" "tab"
                    Text ("H" + level)
                ]
            ]
            |> fun elt ->
                match isActive with
                | false -> elt
                | true -> elt -- Attr.Class "active"

        let navTabs (headings:Heading list) =
            let lis =
                headings
                |> Seq.groupBy (fun x -> x.Level)
                |> Seq.sortBy (fun (level, _) -> level)
                |> Seq.mapi (fun idx (level, _) ->
                    let idxString = string <| idx + 1
                    let level = string level
                    match idx with
                    | 0 -> navTab true idxString level
                    | _ -> navTab false idxString level)
            UL [Attr.Class "nav nav-tabs"] -< lis

        let tabPane isActive idxString (headings:seq<Heading>) =
            Div [
                UL [Attr.Class "list-group"] -< [
                    for x in headings ->
                        LI [
                            Attr.Class "list-group-item"
                            Text x.Text
                        ]
                ]
            ]
            |> fun elt ->
                match isActive with
                | false -> elt -- Attr.Class "tab-pane fade"
                | true -> elt -- Attr.Class "tab-pane fade in active"
            |> fun elt -> elt -- (Attr.Id <| "headings-tab-" + idxString)

        let tabPanes (headings:Heading list) =
            let divs =
                headings
                |> Seq.groupBy (fun x -> x.Level)
                |> Seq.sortBy (fun (level, _) -> level)
                |> Seq.mapi (fun idx (level, headings) ->
                    let idxString = string <| idx + 1
                    match idx with
                    | 0 -> tabPane true idxString headings
                    | _ -> tabPane false idxString headings)
            Div [Attr.Class "tab-content"] -< divs

        let displayHeadings (headings:Heading list) =
            match headings.Length with
            | 0 -> setText "headings" "NA"
            | _ ->
                let navTabs = navTabs headings
                let tabPanes = tabPanes headings
                JQuery.Of("#headings")
                    .Append(navTabs.Dom)
                    .Append(tabPanes.Dom)
                    .Ignore

        let displayDetails uriDetails =
            setText "request-uri" uriDetails.RequestUri
            setText "response-time" <| string uriDetails.ResponseTime + " ms"
            setText "text-html-ratio" <| string uriDetails.TextHtmlRatio + " %"
            displayTitle uriDetails.Title
            displayMetaDesc uriDetails.MetaDescription
            displayHeadings uriDetails.Headings

    [<AutoOpen>]
    module Keywords =

        let dataTable (keywords:Keywords.Keyword list) =
            let table = new Base.DataTable()
            table.addColumn(ColumnType.StringType, "Combination") |> ignore
            table.addColumn(ColumnType.NumberType, "Occurrence") |> ignore
            table.addColumn(ColumnType.NumberType, "Density") |> ignore
            table.addRows(keywords.Length) |> ignore
            keywords
            |> List.iteri (fun idx x ->
                table.setCell(idx, 0, x.Combination)
                table.setCell(idx, 1, x.Occurrence)
                table.setCell(idx, 2, x.Density))
            table

        let keywordsTable keywords divId =
            let data = dataTable keywords
            let tableElt = Div []
            let table = new Table(tableElt.Dom)
            let options = TableOptions(sortAscending = false, sortColumn = 1., width = "600px")
            table.draw(data, options)       
            ById(divId).AppendChild(tableElt.Dom)
            |> ignore

        let filterCount (keywords:Keywords.Keyword list) count =
            keywords |> List.filter (fun x -> x.WordsCount = count)

        let displayKeywords keywords =
            [1 .. 3]
            |> List.iter (fun x ->
                keywordsTable (filterCount keywords x)
                <| "keywords-tab-" + string x)

    [<AutoOpen>]
    module Hyperlinks =
        let table hyperlinks =
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

        let dataTable column column' (rows:('T * 'U) list) =
            let table = DataTable()
            table.addColumn(ColumnType.StringType, column) |> ignore
            table.addColumn(ColumnType.NumberType, column') |> ignore
            table.addRows rows.Length |> ignore
            rows |> List.iteri (fun idx (x, y) ->
                table.setCell(idx, 0, x)
                table.setCell(idx, 1, y))
            table

        let drawPie dataTable =
            let div = Div []
            let pie = PieChart(div.Dom)
            let options = PieChartOptions(height = 600, width = 600)
            pie.draw(dataTable, options)
            div

        let displayStats column column' rows id =
            dataTable column column' rows
            |> drawPie
            |> fun x -> ById(id).AppendChild x.Dom
            |> ignore

        let updateTabHeader tabId str =
            let elt = ById tabId
            elt.TextContent <- elt.TextContent + " (" + str + ")"

        let displayHyperlinks hyperlinks =
            let external, ``internal`` =
                List.partition
                    (fun (x:Hyperlink) -> x.Type = "External")
                    hyperlinks
            let follow, nofollow = List.partition (fun x -> x.Rel = "Follow") hyperlinks
            updateTabHeader "internal-links" <| string ``internal``.Length
            updateTabHeader "external-links" <| string external.Length
            ById("internal-links-table").AppendChild (table ``internal``).Dom |> ignore
            ById("external-links-table").AppendChild (table external).Dom |> ignore
            displayStats
                "Hyperlinks Type"
                "Count"
                ["External", external.Length; "Internal", ``internal``.Length]
                "external-internal-tab"
            displayStats
                "Hyperlinks Rel"
                "Count"
                ["Follow", follow.Length; "NoFollow", nofollow.Length]
                "follow-nofollow-tab"

    [<AutoOpen>]
    module Violations =
        
        let seoInfo heading text =
            Div [Attr.Class "row seo-info"] -< [
                Div [
                    Attr.Class "col-md-3 row-heading"
                    Text heading
                ]
                Div [
                    Attr.Class "col-md-9"
                    Text text
                ]
            ]

        let violationPanel (violation:Violations.Violation) idx id line column =
            let idxString = string idx
            Div [Attr.Class "panel panel-default"] -< [
                Div [Attr.Class "panel-heading"] -< [
                    H4 [Attr.Class "panel-title"] -< [
                        A [
                            HRef <| "#error-" + idxString
                            HTML5.Attr.Data "toggle" "collapse"
                            HTML5.Attr.Data "parent" <| "#" + id
                            Text violation.Heading
                        ]
                    ]
                ]
                Div [
                    Attr.Class "panel-collapse collapse"
                    Attr.Id <| "error-" + idxString
                ] -< [
                    Div [Attr.Class "panel-body"] -< [
                        seoInfo "Line" line
                        seoInfo "Column" column
                        seoInfo "Description" violation.Description
                        seoInfo "Recommendation" violation.Recommendation
                    ]
                ] 
            ]

        let displayViolations (violations:Violations.Violation list) id =
            let accordion = ById id
            violations
            |> List.iteri (fun idx x ->
                let line, column =
                    match x.Position with
                    | None -> "NA", "NA"
                    | Some p -> string p.Line, string p.Column
                let panel = violationPanel x idx id line column
                accordion.AppendChild panel.Dom |> ignore)

        let displayViolations' tabId (violations:Violations.Violation list) accordion =
            updateTabHeader tabId <| string violations.Length
            displayViolations violations accordion        

        let displayErrors errors = displayViolations' "errors-nav-tab" errors "errors-accordion"        

        let displayWarnings warnings = displayViolations' "warnings-nav-tab" warnings "warnings-accordion"        

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
            |> fun elt -> 
                ById("headers-panel-body").AppendChild elt.Dom
                |> ignore
       
    [<AutoOpen>]
    module Speed =
        
        let displayScore (speedReview:PageSpeed.SpeedReview) =
            setText "speed-score" <| string speedReview.Score + " / 100"

        let suggestionPanel (suggestion:PageSpeed.SpeedRule) idx =
            let idxString = string idx
            Div [Attr.Class "panel panel-default"] -< [
                Div [Attr.Class "panel-heading"] -< [
                    H4 [Attr.Class "panel-title"] -< [
                        A [
                            HRef <| "#suggestion-" + idxString
                            HTML5.Attr.Data "toggle" "collapse"
                            HTML5.Attr.Data "parent" "#suggestions-accordion"
                            Text suggestion.Name
                        ]
                    ]
                ]
                Div [
                    Attr.Class "panel-collapse collapse"
                    Attr.Id <| "suggestion-" + string idx
                ] -< [
                    Div [Attr.Class "panel-body"] -< [
                        for x in suggestion.Details ->
                            Div [
                                Div [
                                    match x.Hyperlink with
                                    | None -> yield Text x.Header
                                    | Some hyperlink ->
                                        yield A [
                                            Attr.HRef hyperlink
                                            Attr.Target "_blank"
                                            Text x.Header
                                        ] :> _
                                ]
                                UL [for url in x.Urls -> LI [Text url]]
                            ]
                    ]
                ] 
            ]

        let displaySuggestions (suggestions:PageSpeed.SpeedRule list) =
            let accordion = ById("suggestions-accordion")
            suggestions
            |> List.filter (fun x -> x.Impact > 0.)
            |> fun lst ->
                updateTabHeader "suggestions-nav-tab" <| string lst.Length
                lst
                |> List.iteri (fun idx x ->
                    let panel = suggestionPanel x idx
                    accordion.AppendChild panel.Dom |> ignore)
        
        let displayResourcesStats (stats:PageSpeed.SpeedStats) =
            setText "hosts" <| string stats.Hosts
            setText "css-resources" <| string stats.CssResources
            setText "js-resources" <| string stats.JsResources
            setText "static-resources" <| string stats.StaticResources
            setText "total-resources" <| string stats.TotalResources
           
        let displayBytesStats (stats:PageSpeed.SpeedStats) =
            displayStats
                "Bytes"
                "Size"
                ["CSS", stats.CssBytes; "Flash", stats.FlashBytes; "HTML", stats.HtmlBytes; "Image", stats.ImageBytes; "Other", stats.OtherBytes; "Text", stats.TextBytes]
                "bytes-stats"
                 
        let displayScreenshot (review:PageSpeed.SpeedReview) =
            A [
                Attr.HRef review.Uri
                Attr.Target "_blank"
            ] -< [
                Img [
                    Attr.Class "img-responsive img-thumbnail"
                    Attr.Src review.Screenshot
                ]
            ]
            |> fun elt ->
                ById("screenshot").AppendChild elt.Dom
                |> ignore
                              
    [<Inline "$('#page-header').tooltip(options)">]
    let tooltip() = X<unit>

    [<Inline "$('body').scrollspy({ target: '#affix-nav' })">]
    let scrollspy() = X<unit>

    let substring str length =
        let str' =
            Seq.take 15 str
            |> Seq.map string
            |> String.concat ""
        let str'' =
            Seq.skip (length - 15) str
            |> Seq.map string
            |> String.concat ""
        str' + "..." + str''

    let trimUri (uriString:string) =
        let length = uriString.Length
        match length with
        | _ when length <= 30 -> uriString
        | _ -> substring uriString length

    let showReview (requestUri:string) =
        let pageHeaderJq = JQuery.Of("#page-header")
        match requestUri.Length with
        | x when x <= 30 ->
            pageHeaderJq
                .Text("Review of " + requestUri)
                .Ignore
        | _ ->
            pageHeaderJq
                .Text("Review of " + trimUri requestUri)
                .Attr("title", requestUri)
                .Ignore
            tooltip()
        JQuery.Of("#jumbotron").Remove().Ignore
        JQuery.Of("#review").FadeIn().Ignore
        scrollspy()

    [<Inline "$('#review-btn').button('loading')">]
    let btnLoading() = X<unit>

    [<Inline "$('#review-btn').button('reset')">]
    let btnReset() = X<unit>

    let showAlert alert =
        btnReset()
        Div [
            Attr.Class "alert alert-danger"
            Attr.Id "alert"
        ] -< [
            Button [
                Attr.Class "close"
                Attr.NewAttr "aria-hidden" "true"
                Attr.Type "button"
                HTML5.Attr.Data "dismiss" "alert"
            ]
            |> fun btn -> btn.Html <- "&times;"; btn
            Div [Text alert]
        ]
        |> fun elt -> JQuery.Of(".jumbotron").Append(elt.Dom).Ignore

    let displaySpeedReview speedReview =
        displayScreenshot speedReview
        displayScore speedReview
        displaySuggestions speedReview.Rules
        let stats = speedReview.Stats
        displayResourcesStats stats
        displayBytesStats stats

    let displayReview review =
        let uriDetails = review.Details
        displayDetails uriDetails
        displayKeywords review.Keywords
        displayHyperlinks review.Hyperlinks
        displayErrors review.Errors
        displayWarnings review.Warnings
        displayHeaders review.Headers
        match review.Speed with
        | None -> ()
        | Some speedReview -> displaySpeedReview speedReview
        showReview uriDetails.RequestUri

    let review uriString =
        async {
            JQuery.Of("#alert").Hide().Ignore
            btnLoading()
            let! result = Server.review uriString
            match result with
            | InvalidUri -> showAlert "The URL is invalid."
            | GetFailed -> showAlert "Downloading the URL failed."
            | NotHtml -> showAlert "The URL is not a HTML page."
            | Success review -> displayReview review
        } |> Async.Start

    module UriPiglet =
        open IntelliFactory.WebSharper.Piglets

        type Uri = string

        let view uri submit =
            Div [
                Attr.Class "input-group input-group-lg"
                Attr.Id "uri-input"
            ] -< [
                Controls.Input uri -< [
                    Attr.Class "form-control"
                    Attr.Id "uri"
                    HTML5.Attr.AutoFocus "autofocus"
                    HTML5.Attr.PlaceHolder "example.com"
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

        let piglet (init:Uri) =
            Piglet.Return id
            <*> Piglet.Yield init
                |> Piglet.Validation.Is Piglet.Validation.NotEmpty "Please enter a valid URL."
            |> Piglet.WithSubmit

        let main() =
            piglet ""
            |> Piglet.Run review
            |> Piglet.Render view

type Control() =
    inherit Web.Control()
    
    [<JavaScript>]
    override __.Body = Js.UriPiglet.main() :> _