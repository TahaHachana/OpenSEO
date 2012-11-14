namespace OpenSEO

open IntelliFactory.WebSharper

module Keywords =

    module Server =

        let filterByWordsCount (keywords : Mongo.Types.Keyword []) wordsCount =
            keywords
            |> Array.filter (fun x -> x.WordsCount = wordsCount)
            |> Array.map (fun x -> x.Combination, x.Occurrence.ToString(), x.Density.ToString())

        [<RpcAttribute>]
        let keywordsById id =
            async {
                let keywordsOption = Mongo.Keywords.keywordsById id
                match keywordsOption with
                    | None -> return None
                    | Some keywords ->
                        let filterByWordsCount' = filterByWordsCount keywords
                        let oneKeyword = filterByWordsCount' 1
                        let twoKeywords = filterByWordsCount' 2
                        let threeKeywords = filterByWordsCount' 3
                        return Some [oneKeyword; twoKeywords; threeKeywords]            
            }

    module Client =

        open IntelliFactory.WebSharper.Html
        open IntelliFactory.WebSharper.JQuery

        [<JavaScriptAttribute>]
        let makeTh id =
            match id with
                | "table1" -> TH [Text "Keyword"]
                | _         -> TH [Text "Keywords Combination"]

        [<JavaScriptAttribute>]
        let makeTable id =
            Table [Id id; Attr.Class "table table-bordered table-striped span10"] -< [
//                Caption [Text caption]
                TR [
                    makeTh id
                    TH [Text "Occurrence"]
                    TH [Text "Density %"]
                ]
            ]

        [<JavaScriptAttribute>]
        let appendTd text (tableRow : JQuery) =
            JQuery.Of("<td/>").Text(text).AppendTo(tableRow).Ignore

        [<JavaScriptAttribute>]
        let tableRow keyword occurrence density =
            let tr  = JQuery.Of("<tr/>")
            appendTd keyword tr
            appendTd occurrence tr
            appendTd density tr
            tr

        [<JavaScriptAttribute>]
        let displayKeywords keywords (selector : string) =
            keywords
            |> Array.map (fun (x, y, z) -> tableRow x y z)
            |> Array.iter (fun x -> x.AppendTo(JQuery.Of(selector)).Ignore)

        [<JavaScriptAttribute>]
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
                            displayKeywords keywords.[0] "#table1"
                            displayKeywords keywords.[1] "#table2"
                            displayKeywords keywords.[2] "#table3"
                    Utilities.Client.updateProgressBar ()
                } |> Async.Start )
            
        type KeywordsViewer(id) =
            
            inherit Web.Control ()

            [<JavaScriptAttribute>]
            override x.Body = keywordsSection id :> _