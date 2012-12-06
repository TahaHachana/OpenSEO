namespace OpenSEO

open IntelliFactory.WebSharper

module Keywords =

    module Server =
        
        open Mongo

        let keywordData (keyword : Types.Keyword) =
            keyword.WordsCount,
            keyword.Combination,
            keyword.Occurrence,
            keyword.Density

        [<Rpc>]
        let keywordsById id =
            async {
                let keywordsOption = Keywords.keywordsById id
                match keywordsOption with
                    | None -> return None
                    | Some keywords ->
                        return
                            keywords
                            |> Array.map keywordData
                            |> Some
            }

    module Client =

        open IntelliFactory.WebSharper.Html
        open IntelliFactory.WebSharper.JQuery

        [<JavaScript>]
        let makeTh id =
            match id with
                | "table1" -> TH [Text "Keyword"]
                | _        -> TH [Text "Keywords Combination"]

        [<JavaScript>]
        let makeTable id =
            Table [Id id; Attr.Class "table table-bordered table-striped span10"] -< [
                TR [
                    makeTh id
                    TH [Text "Occurrence"]
                    TH [Text "Density %"]
                ]
            ]

        [<JavaScript>]
        let appendTd text (tableRow : JQuery) =
            JQuery.Of("<td/>").Text(text).AppendTo(tableRow).Ignore

        [<JavaScript>]
        let tableRow keyword occurrence density =
            let tr  = JQuery.Of("<tr/>")
            appendTd keyword tr
            appendTd (string occurrence) tr
            appendTd (string density) tr
            tr

        [<JavaScript>]
        let displayKeywords wordsCount keywords (selector : string) =
            keywords
            |> Array.filter (fun (x, _, _, _) -> x = wordsCount)
            |> Array.map (fun (_, x, y, z) -> tableRow x y z)
            |> Array.iter (fun x -> x.AppendTo(JQuery.Of(selector)).Ignore)

        [<JavaScript>]
        let keywordsSection id =
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
                        | None -> ()
                        | Some keywords ->
                            displayKeywords 1 keywords "#table1"
                            displayKeywords 2 keywords "#table2"
                            displayKeywords 3 keywords "#table3"
                    Utilities.Client.updateProgressBar ()
                } |> Async.Start )
            
    type KeywordsControl(id) =
            
        inherit Web.Control ()

        [<JavaScriptAttribute>]
        override __.Body = Client.keywordsSection id :> _