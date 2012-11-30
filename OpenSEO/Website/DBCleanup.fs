namespace OpenSEO

open System
open IntelliFactory.WebSharper

module DBCleanup =

    module Server =
        
        open Mongo
            
        [<Rpc>]
        let cleanDatabase () =
            async {
                let timespan = TimeSpan(1, 0, 0)
                let datetime = DateTime.Now.Subtract timespan
                Details.cleanCollection    datetime
                Keywords.cleanCollection   datetime
                Links.cleanCollection      datetime
                Violations.cleanCollection datetime
                Headers.cleanCollection    datetime
            }

    module Client =

        open IntelliFactory.WebSharper.Html
        
        [<JavaScript>]
        let cleanDbBtn () =
            Button [Attr.Class "btn btn-primary"; Text "Clean Database"]
            |>! OnClick (fun x _ ->
                async {
                    x.AddClass "disabled"
                    do! Server.cleanDatabase ()
                    x.RemoveClass "disabled"
                    JavaScript.Alert "Done"
                } |> Async.Start)
                    
    type ButtonControl () =
            
        inherit Web.Control ()

        [<JavaScriptAttribute>]
        override __.Body = Client.cleanDbBtn () :> _