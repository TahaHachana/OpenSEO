namespace Website

open IntelliFactory.WebSharper

module Links =

    module private Server =

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

        let linkToTuple (l : Link) = l.URL, l.Anchor, l.Follow

        [<Rpc>]
        let linksById id =
            async {
                let linksOption = Links.byId id
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

    [<JavaScript>]
    module private Client =

        open IntelliFactory.WebSharper.Html
        open IntelliFactory.WebSharper.JQuery
        open Utils.Client

        let makeTable id =
            Table [Id id; Attr.Class "table table-bordered table-striped span10"] -< [
                TR [
                    TH [Text "URL"]
                    TH [Text "Anchor"]
                    TH [Text "Rel"]
                ]
            ]

        let appendTd text (tableRow : JQuery) = JQuery.Of("<td/>").Text(text).AppendTo(tableRow).Ignore

        let appendTd' text (tableRow : JQuery) =
            let aTag = A [HRef text; Attr.Target "_blank"] -< [Text text]
            JQuery.Of("<td/>").Append(aTag.Dom).AppendTo(tableRow).Ignore

        let tableRow url anchor rel =
            let tr  = JQuery.Of("<tr/>")
            appendTd' url tr
            appendTd anchor tr
            appendTd rel tr
            tr

        let updateTabHeader (arr : 'T []) (selector : string) =
            let count = arr.Length.ToString()
            let jquery = JQuery.Of selector
            let text = jquery.Text()
            jquery.Text(String.concat "" [text; " ("; count; ")"]).Ignore 

        let displayLinks links (selector : string) selector' =
            links
            |> Array.map (fun (x, y, z) -> tableRow x y z)
            |> Array.iter (fun x -> x.AppendTo(JQuery.Of(selector)).Ignore)
            do updateTabHeader links selector'

        let makeDiv txt id =
            Div [Attr.Class "row-fluid"] -< [
                Div [Attr.Class "span3"] -< [H4 [Attr.Class "h4"] -< [Text txt]]
                Div [Attr.Class "span2"] -< [P [Id id]]
            ]

        let setPText (selector : string) txt = JQuery.Of(selector).Text(txt).Ignore

        let main id =
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
                        Div [Attr.Class "tab-pane fade span8"; Id "linksStats"; Attr.Style "overflow-y: hidden;"] -< [div; hRule(); div']
                    ]
                ]
            ]
            |>! OnAfterRender (fun _ ->
                async {
                    let! linksOption = Server.linksById id
                    match linksOption with
                        | None -> do ()
                        | Some links ->
                            displayLinks links.InternalLinks "#linksTable1" "#internalLinksTab"
                            displayLinks links.ExternalLinks "#linksTable2" "#externalLinksTab"
                            setPText "#internalLinksCount" <| links.InternalCount.ToString()
                            setPText "#externalLinksCount" <| links.ExternalCount.ToString()
                            setPText "#followLinksCount"   <| links.FollowCount.ToString()
                            setPText "#nofollowLinksCount" <| links.NofollowCount.ToString()
                            let dataTable = makeDataTable "Link Type" "Count" ["External", links.ExternalCount; "Internal", links.InternalCount]
                            let dataTable' = makeDataTable "Link Rel" "Count" ["Follow", links.FollowCount; "NoFollow", links.NofollowCount]
                            let pie = drawPie dataTable
                            let pie' = drawPie dataTable'
                            div.Append pie
                            div'.Append pie'
                    do updateProgressBar()
                } |> Async.Start)
            
    type Control(id) =
            
        inherit Web.Control()

        [<JavaScript>]
        override __.Body = Client.main id :> _