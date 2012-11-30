namespace OpenSEO

open IntelliFactory.WebSharper

module Headers =
    
    module Server =

        open Mongo

        [<Rpc>]
        let httpHeaders objectIdString =
            async {
                let httpHeadersOption = Headers.headersById objectIdString
                let httpHeadersData =
                    match httpHeadersOption with
                        | None -> None
                        | Some httpHeaders ->
                            httpHeaders
                            |> Array.map (fun x -> x.Key, x.Value)
                            |> Some
                return httpHeadersData
            }

    module Client =
        
        open IntelliFactory.WebSharper.Html
        open IntelliFactory.WebSharper.JQuery

        [<JavaScript>]
        let makeTable id =
            Table [Id id; Attr.Class "table table-bordered table-striped span10"] -< [
                TR [
                    TH [Text "Key"]
                    TH [Text "Value"]
                ]
            ]

        [<JavaScript>]
        let appendTd text (tableRow : JQuery) =
            JQuery.Of("<td/>").Text(text).AppendTo(tableRow).Ignore

        [<JavaScript>]
        let tableRow key value =
            let tr  = JQuery.Of("<tr/>")
            appendTd key   tr
            appendTd value tr
            tr

        [<JavaScript>]
        let displayHeaders headers (selector : string) =
            headers
            |> Array.map (fun (x, y) -> tableRow x y)
            |> Array.iter (fun x -> x.AppendTo(JQuery.Of selector).Ignore)

        [<JavaScript>]
        let headersSection id =
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
                        | None -> ()
                        | Some headers ->
                            displayHeaders headers "#headersTable"
                            Utilities.Client.updateProgressBar ()
                } |> Async.Start)
                
    type HeadersControl(id) =

        inherit Web.Control()

        [<JavaScript>]
        override __.Body = Client.headersSection id :> _