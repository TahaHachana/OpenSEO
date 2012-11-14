namespace OpenSEO

open System
open IntelliFactory.WebSharper

module Links =

    module Server =

        type LinksData =
            {
                InternalLinks : (string * string * string) []
                ExternalLinks : (string * string * string) []
                InternalCount : int
                ExternalCount : int
                InternalPercent : float
                ExternalPercent : float
                FollowCount : int
                NofollowCount : int
                FollowPercent : float
                NofollowPercent: float
            }

        let linkToTuple (link : Mongo.Types.Link) = link.URL, link.Anchor, link.Follow
            
        [<RpcAttribute>]
        let linksById id =
            async {
                let linksOption = Mongo.Links.linksById id
                match linksOption with
                    | None -> return None
                    | Some links ->
                        let internalLinks, externalLinks = links |> Array.partition (fun x -> x.Type = "Internal")
                        let linksCount = links.Length
                        let internalCount = internalLinks.Length
                        let externalCount = externalLinks.Length
                        let internalPercent = float internalCount / float linksCount * 100. |> fun x -> Math.Round(x, 2)
                        let externalPercent = float externalCount / float linksCount * 100. |> fun x -> Math.Round(x, 2)
                        let followLinks, nofollowLinks = links |> Array.partition (fun x -> x.Follow = "Follow")
                        let followCount = followLinks.Length
                        let nofollowCount = nofollowLinks.Length
                        let followPercent = float followCount / float linksCount * 100. |> fun x -> Math.Round(x, 2)
                        let nofollowPercent = float nofollowCount / float linksCount * 100. |> fun x -> Math.Round(x, 2)
                        let linksData =
                            {
                                InternalLinks = internalLinks |> Array.map linkToTuple
                                ExternalLinks = externalLinks |> Array.map linkToTuple
                                InternalCount = internalCount
                                ExternalCount = externalCount
                                InternalPercent = internalPercent
                                ExternalPercent = externalPercent
                                FollowCount = followCount
                                NofollowCount = nofollowCount
                                FollowPercent = followPercent
                                NofollowPercent = nofollowPercent
                            } |> Some
                        return linksData
            }

    module Client =

        open IntelliFactory.WebSharper.Html
        open IntelliFactory.WebSharper.JQuery
        open IntelliFactory.WebSharper.KendoUI

//        [<JavaScriptAttribute>]
//        let makeTh id =
//            match id with
//                | "table1" -> TH [Text "Keyword"]
//                | _         -> TH [Text "Keywords Combination"]

        [<JavaScriptAttribute>]
        let makeTable id =
            Table [Id id; Attr.Class "table table-bordered table-striped span10"] -< [
//                Caption [Text caption]
                TR [
                    TH [Text "URL"]
                    TH [Text "Anchor"]
                    TH [Text "Rel"]
                ]
            ]

        [<JavaScriptAttribute>]
        let appendTd text (tableRow : JQuery) =
            JQuery.Of("<td/>").Text(text).AppendTo(tableRow).Ignore

        [<JavaScriptAttribute>]
        let appendTd' text (tableRow : JQuery) =
            let aTag = A [HRef text; Attr.Target "_blank"] -< [Text text]
            JQuery.Of("<td/>").Append(aTag.Dom).AppendTo(tableRow).Ignore

        [<JavaScriptAttribute>]
        let tableRow url anchor rel =
            let tr  = JQuery.Of("<tr/>")
            appendTd' url tr
            appendTd anchor tr
            appendTd rel tr
            tr

        [<JavaScriptAttribute>]
        let displayLinks links (selector : string) =
            links
            |> Array.map (fun (x, y, z) -> tableRow x y z)
            |> Array.iter (fun x -> x.AppendTo(JQuery.Of(selector)).Ignore)

        [<JavaScriptAttribute>]
        let pieChart title category category' x y =
            Div []
            |>! OnAfterRender (fun el ->
                chart.Chart (
                    el.Body,
                    chart.ChartConfiguration (
                        Title =
                            chart.TitleConfiguration (
                                Text = title
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
                                        Category = category,
                                        Value = x
                                    )
                                    chart.DataPoint(
                                        Category = category',
                                        Value = y
                                    )  
                                |]
                            )
                        |],
  
                        Tooltip =
                            chart.TooltipConfiguration (
                                Visible = true,
                                Format = "{0}%"
                            ),
  
                        OnSeriesClick = fun args ->
                            let msg = args.Category + " : " + (string args.Value)
                            JavaScript.Alert (string args.Value)  
                    )
                ) |> ignore)

        [<JavaScriptAttribute>]
        let makeDiv txt id =
            Div [Attr.Class "row-fluid"] -< [
                Div [Attr.Class "span3"] -< [H4 [Attr.Class "h4"] -< [Text txt]]
                Div [Attr.Class "span2"] -< [P [Id id]]
            ]

        [<JavaScriptAttribute>]
        let setPText (selector : string) txt =
            JQuery.Of(selector).Text(txt).Ignore

        [<JavaScriptAttribute>]
        let linksSection id =
            let div =
                Div [
                    makeDiv "Internal Links" "internalLinksCount"
                    makeDiv "External Links" "externalLinksCount"
                ]
            let div' =
                Div [
                    makeDiv "Follow Links" "followLinksCount"
                    makeDiv "Nofollow Links" "nofollowLinksCount"
                ]
            HTML5.Tags.Section [Attr.Class "tab-pane fade in reportSection"; Id "links"] -< [
                Div [Attr.Class "tabbable"] -< [
                    UL [Attr.Class "nav nav-pills"] -< [
                        LI [Attr.Class "active"] -< [A [HRef "#links1"; HTML5.Attr.Data "toggle" "tab"] -< [Text "Internal"]]
                        LI [A [HRef "#links2"; HTML5.Attr.Data "toggle" "tab"] -< [Text "External"]]
                        LI [A [HRef "#linksStats"; HTML5.Attr.Data "toggle" "tab"] -< [Text "Stats"]]
                    ]
                    Div [Attr.Class "tab-content"] -< [
                        Div [Attr.Class "tab-pane active fade in span8"; Id "links1"] -< [makeTable "linksTable1"]
                        Div [Attr.Class "tab-pane fade span8"; Id "links2"] -< [makeTable "linksTable2"]
                        Div [Attr.Class "tab-pane fade span8"; Id "linksStats"] -< [div; Hr []; div']
                    ]
                ]
            ]
            |>! OnAfterRender (fun _ ->
                async {
                    let! linksOption = Server.linksById id
                    match linksOption with
                        | None -> ()
                        | Some links ->
                            displayLinks links.InternalLinks "#linksTable1"
                            displayLinks links.ExternalLinks "#linksTable2"
                            setPText "#internalLinksCount" <| links.InternalCount.ToString()
                            setPText "#externalLinksCount" <| links.ExternalCount.ToString()
                            let pie = pieChart "Internal vs. External" "Internal" "External" (float links.InternalPercent) (float links.ExternalPercent)
                            div.Append pie
                            setPText "#followLinksCount" <| links.FollowCount.ToString()
                            setPText "#nofollowLinksCount" <| links.NofollowCount.ToString()
                            let pie' = pieChart "Follow vs. NoFollow" "Follow" "NoFollow" (float links.FollowPercent) (float links.NofollowPercent)
                            div'.Append pie'
                    Utilities.Client.updateProgressBar ()
                } |> Async.Start)
            
        type LinksViewer(id) =
            
            inherit Web.Control ()

            [<JavaScriptAttribute>]
            override x.Body = linksSection id :> _