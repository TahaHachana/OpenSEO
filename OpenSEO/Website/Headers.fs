namespace Website

open IntelliFactory.WebSharper

module Headers =
    
    module private Server =

        open Mongo

        [<Rpc>]
        let httpHeaders objectIdString =
            async {
                let httpHeadersOption = Headers.byId objectIdString
                match httpHeadersOption with
                    | None -> return None
                    | Some httpHeaders ->
                        let someArr =
                            httpHeaders
                            |> Array.map (fun x -> x.Key, x.Value)
                            |> Some
                        return someArr
            }

    [<JavaScript>]
    module private Client =
        
        open IntelliFactory.WebSharper.Html
        open IntelliFactory.WebSharper.JQuery
        open Utils.Client

        let makeTable id =
            Table [Id id; Attr.Class "table table-bordered table-striped span10"] -< [
                TR [
                    TH [Text "Key"]
                    TH [Text "Value"]
                ]
            ]

        let appendTd text (tableRow : JQuery) = JQuery.Of("<td/>").Text(text).AppendTo(tableRow).Ignore

        let tableRow key value =
            let tr  = JQuery.Of("<tr/>")
            appendTd key   tr
            appendTd value tr
            tr

        let displayHeaders headers (selector : string) =
            headers
            |> Array.map (fun (x, y) -> tableRow x y)
            |> Array.iter (fun x -> x.AppendTo(JQuery.Of selector).Ignore)

        let main id =
            let tabsDiv = Div []
            HTML5.Tags.Section [Attr.Class "tab-pane fade in reportSection"; Id "headers"] -< [
                Div [Attr.Class "span8"] -< [
                    Table [Id "headersTable"; Attr.Class "table table-bordered table-striped span8"] -< [
                        TR [
                            TH [Text "Key"]
                            TH [Text "Value"]
                        ]
                    ]
                ]
            ]
            |>! OnAfterRender (fun _ ->
                async {
                    let! headersDataOption = Server.httpHeaders id
                    match headersDataOption with
                        | None -> do ()
                        | Some headers ->
                            displayHeaders headers "#headersTable"
                            do updateProgressBar()
                } |> Async.Start)
                
    type Control(id) =

        inherit Web.Control()

        [<JavaScript>]
        override __.Body = Client.main id :> _