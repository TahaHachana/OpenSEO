namespace OpenSEO

open System
open IntelliFactory.WebSharper
open SEOLib

module Pagespeed =

    type SizeBreakdown =
        {
            Css        : string
            Html       : string
            Images     : string
            Javascript : string
            Other      : string
            Total      : string
        }

    type SizeStats =
        {
            Css        : float
            Html       : float
            Images     : float
            Javascript : float
            Other      : float
        }

    module Server =
        
        let round (x : float) = Math.Round(x, 2)

        let percentage y x = float x / float y * 100. |> round

        let kbSize x = float x / 1024. |> round |> string

        let makeSizeBreakDown css html images js other total =
            {
                Css        = css
                Html       = html
                Images     = images
                Javascript = js
                Other      = other
                Total      = total
            }

        let makeSizeStats css html images js other =
            {
                Css        = css
                Html       = html
                Images     = images
                Javascript = js
                Other      = other
            }

        let makeSizeBreakdown' cssBytes htmlBytes imagesBytes jsBytes otherBytes totalBytes =
            let cssBytes' = kbSize cssBytes
            let htmlBytes' = kbSize htmlBytes
            let imagesBytes' = kbSize imagesBytes
            let jsBytes' = kbSize jsBytes
            let otherBytes' = kbSize otherBytes
            let totalBytes' = kbSize totalBytes
            makeSizeBreakDown cssBytes' htmlBytes' imagesBytes' jsBytes' otherBytes' totalBytes'

        let makeSizeStats' totalBytes cssBytes htmlBytes imagesBytes jsBytes otherBytes =
            let percentage' = percentage totalBytes
            let cssPercent = percentage' cssBytes
            let htmlPercent = percentage' htmlBytes
            let imagePercent = percentage' imagesBytes
            let jsPercent = percentage' jsBytes
            let otherPercent = percentage' otherBytes
            makeSizeStats cssPercent htmlPercent imagePercent jsPercent otherPercent

        let getRules result =
            PageSpeed.pagespeedRules result
            |> List.filter (fun x -> x.Score.IsSome)
            |> List.filter (fun x -> x.Score.Value < 100L)
            |> List.map (fun x -> x.Name, x.Suggestions)

        let speedScore result = PageSpeed.getScore result |> fun x -> Option.get x

        type PagespeedData =
            {
                Score : int64
                ResourceBreakdown : SizeBreakdown
                ResourceStats : SizeStats
                Rules : (string * Suggestion list option) list
            }

        let makePagespeedData score breakdown stats rules =
            {
                Score = score
                ResourceBreakdown = breakdown
                ResourceStats = stats
                Rules = rules
            }

        let makePagespeedData' result =
            let score = speedScore result
            let stats = PageSpeed.pagespeedStats result
            let cssBytes = stats.CssBytes
            let htmlBytes = stats.HtmlBytes
            let imageBytes = stats.ImageBytes
            let javascriptBytes = stats.JavascriptBytes
            let otherBytes = stats.OtherBytes
            let totalBytes = List.sum [cssBytes; htmlBytes; imageBytes; javascriptBytes; otherBytes]
            let sizeStats = makeSizeStats' totalBytes cssBytes htmlBytes imageBytes javascriptBytes otherBytes //makeSizeStats cssPercent htmlPercent imagePercent javascriptPercent otherPercent
            let sizeBreakdown = makeSizeBreakdown' cssBytes htmlBytes imageBytes javascriptBytes otherBytes totalBytes
            let rules = getRules result
            makePagespeedData score sizeBreakdown sizeStats rules

        [<Rpc>]
        let runPagespeed uriString =
            async {
                let service = PageSpeed.createPagespeedService Secure.apiKey
                let! result = PageSpeed.runPagespeed service uriString
                let httpStatusOption = PageSpeed.getResponseCode result
                match httpStatusOption with
                    | Some 200L ->
                        let pagespeedData = makePagespeedData' result
                        return Some pagespeedData
                    | _ -> return None
            }    

    module Client =

        open IntelliFactory.WebSharper.Html
        open IntelliFactory.WebSharper.JQuery
        open IntelliFactory.WebSharper.KendoUI

        [<JavaScript>]
        let makeDiv txt id =
            Div [Attr.Class "row-fluid"] -< [
                Div [Attr.Class "span3"] -< [H4 [Attr.Class "h4"] -< [Text txt]]
                Div [Attr.Class "span9"] -< [P [Id id]]
            ]

        [<JavaScript>]
        let setPText (selector : string) txt =
            JQuery.Of(selector).Text(txt).Ignore

        [<JavaScript>]
        let pieChart (sizeBreakdown : SizeStats) =
            Div []
            |>! OnAfterRender (fun el ->
                chart.Chart (
                    el.Body,
                    chart.ChartConfiguration (
                        Title =
                            chart.TitleConfiguration (
                                Text = "Resource Breakdown"
                            ),
                        Legend =
                            chart.LegendConfiguration (
                                Position = "bottom"
                            ),
                        SeriesDefaults =
                            chart.SeriesDefaultConfiguration (
                                Labels = 
                                    chart.LabelsConfiguration (
                                        Visible = true,
                                        Format = "{0}%"
                                    )
                            ),
                        Series = [|
                            chart.SeriesConfiguration (
                                Type = "pie",
                                Data = [|
                                    chart.DataPoint (
                                        Category = "CSS",
                                        Value = sizeBreakdown.Css
                                    )
                                    chart.DataPoint(
                                        Category = "HTML",
                                        Value = sizeBreakdown.Html
                                    )  
                                    chart.DataPoint(
                                        Category = "Images",
                                        Value = sizeBreakdown.Images
                                    )  
                                    chart.DataPoint(
                                        Category = "JavaScript",
                                        Value = sizeBreakdown.Javascript
                                    )  
                                    chart.DataPoint(
                                        Category = "Other",
                                        Value = sizeBreakdown.Other
                                    )
                                |]
                            )
                        |],
  
                        Tooltip =
                            chart.TooltipConfiguration (
                                Visible = true,
                                Template = "#=category#",
                                Format = "{0}"
                            ),
  
                        OnSeriesClick = fun args ->
                            let msg = args.Category + " : " + (string args.Value)
                            JavaScript.Alert (string args.Value) 
                    )
                ) |> ignore)

        [<JavaScript>]
        let makeLi text = LI [Text text]

        [<JavaScript>]
        let makeDiv' (suggestion : Suggestion) =
            Div [
                H4 [Attr.Class "h4"] -< [Text suggestion.Header]
                UL [
                    yield! suggestion.Urls |> List.map makeLi
                ]
            ]

        [<JavaScript>]
        let makeAccordionGroup parent id ruleName (suggestions : Suggestion list option) =
            let div =
                match suggestions with
                    | None -> Div []
                    | Some x -> Div [yield! x |> List.map makeDiv']

            Div [Attr.Class "accordion-group"] -< [
                Div [Attr.Class "accordion-heading"] -< [
                    A [Attr.Class "accordion-toggle"; HTML5.Attr.Data "toggle" "collapse"; HTML5.Attr.Data "parent" parent; HRef <| "#" + id] -< [
                        Text ruleName
                    ]
                ]
                Div [Id id; Attr.Class "accordion-body collapse"] -< [
                    Div [Attr.Class "accordion-inner"] -< [
                        div
                    ]
                ]
            ]

        [<JavaScript>]
        let updateTabHeader count (selector : string) =
            let jquery = JQuery.Of selector
            let text = jquery.Text()
            jquery.Text(String.concat "" [text; " ("; count; ")"]).Ignore 

        [<JavaScript>]
        let displayAccordions id accordionId (div : Element) (lst : (string * Suggestion list option) list) =
            lst
            |> List.mapi (fun idx x ->
                let id' = id + string idx
                let ruleName, suggestions = x
                makeAccordionGroup accordionId id' ruleName suggestions)
            |> List.iter div.Append
            let length = string lst.Length
            updateTabHeader length "#speedSuggestionsTab"

        [<JavaScript>]
        let displaySpeedData uriString (div : Element) (div' : Element) =
            async {
                let! speedDataOption = Server.runPagespeed uriString
                match speedDataOption with
                    | None -> ()
                    | Some speedData ->
                        let score = string speedData.Score + " / 100"
                        let sizeBreakdown = speedData.ResourceBreakdown
                        setPText "#speedScore" score
                        setPText "#cssSize" <| sizeBreakdown.Css + " KB"
                        setPText "#htmlSize" <| sizeBreakdown.Html + " KB"
                        setPText "#imagesSize" <| sizeBreakdown.Images + " KB"
                        setPText "#jsSize" <| sizeBreakdown.Javascript + " KB"
                        setPText "#otherSize" <| sizeBreakdown.Other + " KB"
                        setPText "#totalSize" <| sizeBreakdown.Total + " KB"
                        displayAccordions "speedSuggestion" "speedSuggestionsAccordion" div speedData.Rules
                        let chart = pieChart speedData.ResourceStats
                        div'.Append chart
            } |> Async.Start

        [<JavaScript>]
        let pagespeedSection id =
            let input =
                Input [Attr.Type "hidden"; Attr.Value ""; Id "pagespeedUri"]

            let div = Div [Attr.Class "accordion"; Id "speedSuggestionsAccordion"]
            let div' = Div [Id "resourceSizeDiv"]
            HTML5.Tags.Section [Attr.Class "tab-pane fade in reportSection"; Id "speed"] -< [
                input
                makeDiv "Score" "speedScore"
                Hr []
                Div [Attr.Class "tabbable"] -< [
                    UL [Attr.Class "nav nav-pills"] -< [
                        LI [Attr.Class "active"] -< [A [HRef "#speedSuggestions"; HTML5.Attr.Data "toggle" "tab"; Id "speedSuggestionsTab"] -< [Text "Suggestions"]]
                        LI [A [HRef "#resourceBreakdown"; HTML5.Attr.Data "toggle" "tab"; Id "sizeBreakdownTab"] -< [Text "Resource Breakdown"]]
                    ]
                    Div [Attr.Class "tab-content"] -< [
                        Div [Attr.Class "tab-pane active fade in span8"; Id "speedSuggestions"] -< [div]
                        Div [Attr.Class "tab-pane fade span8"; Id "resourceBreakdown"] -< [
                            makeDiv "CSS" "cssSize"
                            makeDiv "HTML" "htmlSize"
                            makeDiv "Images" "imagesSize"
                            makeDiv "JavaScript" "jsSize"
                            makeDiv "Other" "otherSize"
                            makeDiv "Total" "totalSize"
                            div'
                        ]
                    ]
                ]
            ]
            |>! OnAfterRender (fun _ ->
                JQuery.Of("#pagespeedUri").Change(fun x _ ->
                    let uriString = x.GetAttribute "value"
                    displaySpeedData uriString div div').Ignore)

    type PagespeedControl () =
            
        inherit Web.Control ()

        [<JavaScript>]
        override __.Body = Client.pagespeedSection id :> _