namespace OpenSEO

open IntelliFactory.WebSharper

module Links =

    module Server =

        open Mongo

        type LinksData =
            {
                InternalLinks : (string * string * string) []
                ExternalLinks : (string * string * string) []
                InternalCount : int
                ExternalCount : int
                FollowCount   : int
                NofollowCount : int
            }

        let linkToTuple (link : Types.Link) = link.URL, link.Anchor, link.Follow

        [<Rpc>]
        let linksById id =
            async {
                let linksOption = Mongo.Links.linksById id
                match linksOption with
                    | None -> return None
                    | Some links ->
                        let internalLinks, externalLinks = links |> Array.partition (fun x -> x.Type   = "Internal")
                        let followLinks  , nofollowLinks = links |> Array.partition (fun x -> x.Follow = "Follow")
                        let internalCount = internalLinks.Length
                        let externalCount = externalLinks.Length
                        let followCount = followLinks.Length
                        let nofollowCount = nofollowLinks.Length
                        return
                            {
                                InternalLinks = internalLinks |> Array.map linkToTuple
                                ExternalLinks = externalLinks |> Array.map linkToTuple
                                InternalCount = internalCount
                                ExternalCount = externalCount
                                FollowCount   = followCount
                                NofollowCount = nofollowCount
                            } |> Some
            }

    module Client =

        open IntelliFactory.WebSharper.Html
        open IntelliFactory.WebSharper.JQuery

        [<JavaScript>]
        let makeTable id =
            Table [Id id; Attr.Class "table table-bordered table-striped span10"] -< [
                TR [
                    TH [Text "URL"]
                    TH [Text "Anchor"]
                    TH [Text "Rel"]
                ]
            ]

        [<JavaScript>]
        let appendTd text (tableRow : JQuery) =
            JQuery.Of("<td/>").Text(text).AppendTo(tableRow).Ignore

        [<JavaScript>]
        let appendTd' text (tableRow : JQuery) =
            let aTag = A [HRef text; Attr.Target "_blank"] -< [Text text]
            JQuery.Of("<td/>").Append(aTag.Dom).AppendTo(tableRow).Ignore

        [<JavaScript>]
        let tableRow url anchor rel =
            let tr  = JQuery.Of("<tr/>")
            appendTd' url tr
            appendTd anchor tr
            appendTd rel tr
            tr

        [<JavaScript>]
        let updateTabHeader (arr : 'T []) (selector : string) =
            let count = arr.Length.ToString()
            let jquery = JQuery.Of selector
            let text = jquery.Text()
            jquery.Text(String.concat "" [text; " ("; count; ")"]).Ignore 

        [<JavaScript>]
        let displayLinks links (selector : string) selector' =
            links
            |> Array.map (fun (x, y, z) -> tableRow x y z)
            |> Array.iter (fun x -> x.AppendTo(JQuery.Of(selector)).Ignore)
            updateTabHeader links selector'

        [<JavaScript>]
        let makeDiv txt id =
            Div [Attr.Class "row-fluid"] -< [
                Div [Attr.Class "span3"] -< [H4 [Attr.Class "h4"] -< [Text txt]]
                Div [Attr.Class "span2"] -< [P [Id id]]
            ]

        [<JavaScript>]
        let setPText (selector : string) txt =
            JQuery.Of(selector).Text(txt).Ignore

        [<JavaScript>]
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
                        LI [Attr.Class "active"] -< [A [HRef "#links1"; HTML5.Attr.Data "toggle" "tab"; Id "internalLinksTab"] -< [Text "Internal"]]
                        LI [A [HRef "#links2"; HTML5.Attr.Data "toggle" "tab"; Id "externalLinksTab"] -< [Text "External"]]
                        LI [A [HRef "#linksStats"; HTML5.Attr.Data "toggle" "tab"] -< [Text "Stats"]]
                    ]
                    Div [Attr.Class "tab-content"] -< [
                        Div [Attr.Class "tab-pane active fade in span8"; Id "links1"] -< [makeTable "linksTable1"]
                        Div [Attr.Class "tab-pane fade span8"; Id "links2"] -< [makeTable "linksTable2"]
                        Div [Attr.Class "tab-pane fade span8"; Id "linksStats"; Attr.Style "overflow-y: hidden;"] -< [div; Utilities.Client.hRule (); div']
                    ]
                ]
            ]
            |>! OnAfterRender (fun _ ->
                async {
                    let! linksOption = Server.linksById id
                    match linksOption with
                        | None -> ()
                        | Some links ->
                            displayLinks links.InternalLinks "#linksTable1" "#internalLinksTab"
                            displayLinks links.ExternalLinks "#linksTable2" "#externalLinksTab"
                            setPText "#internalLinksCount" <| links.InternalCount.ToString()
                            setPText "#externalLinksCount" <| links.ExternalCount.ToString()
                            setPText "#followLinksCount"   <| links.FollowCount.ToString()
                            setPText "#nofollowLinksCount" <| links.NofollowCount.ToString()
                            let dataTable = Utilities.Client.makeDataTable "Link Type" "Count" ["External", links.ExternalCount; "Internal", links.InternalCount]
                            let dataTable' = Utilities.Client.makeDataTable "Link Rel" "Count" ["Follow", links.FollowCount; "NoFollow", links.NofollowCount]
                            let pie = Utilities.Client.drawPie dataTable
                            let pie' = Utilities.Client.drawPie dataTable'
                            div.Append pie
                            div'.Append pie'
                    Utilities.Client.updateProgressBar ()
                } |> Async.Start)
            
    type LinksControl(id) =
            
        inherit Web.Control ()

        [<JavaScript>]
        override __.Body = Client.linksSection id :> _