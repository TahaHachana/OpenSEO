namespace Website

open IntelliFactory.WebSharper

module Keywords =

    module private Server =
        
        open Mongo

        let keywordData (k : Keyword) = k.WordsCount, k.Combination, k.Occurrence, k.Density

        [<Rpc>]
        let keywordsById id =
            async {
                let keywordsOption = Keywords.byId id
                match keywordsOption with
                    | None          -> return None
                    | Some keywords ->
                        let someK =
                            keywords
                            |> Array.map keywordData
                            |> Some
                        return someK
            }

    [<JavaScript>]
    module private Client =

        open IntelliFactory.WebSharper.Html
        open IntelliFactory.WebSharper.JQuery
        open Utils.Client

        let makeTh id =
            match id with
                | "table1" -> TH [Text "Keyword"]
                | _        -> TH [Text "Keywords Combination"]

        let makeTable id =
            Table [Id id; Attr.Class "table table-bordered table-striped span10"] -< [
                TR [
                    makeTh id
                    TH [Text "Occurrence"]
                    TH [Text "Density %"]
                ]
            ]

        let appendTd text (tableRow : JQuery) =
            JQuery.Of("<td/>").Text(text).AppendTo(tableRow).Ignore

        let tableRow keyword occurrence density =
            let tr  = JQuery.Of("<tr/>")
            appendTd keyword tr
            appendTd (string occurrence) tr
            appendTd (string density) tr
            tr

        let displayKeywords wordsCount keywords (selector : string) =
            keywords
            |> Array.filter (fun (x, _, _, _) -> x = wordsCount)
            |> Array.map (fun (_, x, y, z) -> tableRow x y z)
            |> Array.iter (fun x -> x.AppendTo(JQuery.Of(selector)).Ignore)

        let main id =
            HTML5.Tags.Section [Attr.Class "tab-pane fade in reportSection"; Id "keywords"] -< [
                Div [Attr.Class "tabbable"] -< [
                    UL [Attr.Class "nav nav-pills"] -< [
                        LI [Attr.Class "active"] -< [A [HRef "#keywords1"; HTML5.Attr.Data "toggle" "tab"] -< [Text "1 Keyword"]]
                        LI [A [HRef "#keywords2"; HTML5.Attr.Data "toggle" "tab"] -< [Text "2 Keywords"]]
                        LI [A [HRef "#keywords3"; HTML5.Attr.Data "toggle" "tab"] -< [Text "3 Keywords"]]
                    ]
                    Div [Attr.Class "tab-content"] -< [
                        Div [Attr.Class "tab-pane active fade in span8"; Id "keywords1"] -< [makeTable "table1"]
                        Div [Attr.Class "tab-pane fade span8"; Id "keywords2"] -< [makeTable "table2"]
                        Div [Attr.Class "tab-pane fade span8"; Id "keywords3"] -< [makeTable "table3"]
                    ]
                ]
            ]
            |>! OnAfterRender (fun _ ->
                async {
                    let! keywordsOption = Server.keywordsById id
                    match keywordsOption with
                        | None -> do ()
                        | Some keywords ->
                            do displayKeywords 1 keywords "#table1"
                            do displayKeywords 2 keywords "#table2"
                            do displayKeywords 3 keywords "#table3"
                    do updateProgressBar()
                } |> Async.Start )
            
    type Control(id) =
            
        inherit Web.Control()

        [<JavaScript>]
        override __.Body = Client.main id :> _