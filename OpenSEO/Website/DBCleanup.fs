namespace OpenSEO

open System
open IntelliFactory.WebSharper

module DBCleanup =

    module Server =
        
        open Mongo
        
        let oneHourAgo () =
            let timespan = TimeSpan(1, 0, 0)
            DateTime.Now.Subtract timespan
            
        [<Rpc>]
        let emptyDatabase () =
            async {
                let datetime = oneHourAgo ()
                let emptyCollection' collection = Utilities.emptyCollection datetime collection
                emptyCollection' Details.uriDetailsCollection
                emptyCollection' Keywords.keywordsCollection
                emptyCollection' Links.linksCollection
                emptyCollection' Violations.violationsCollection
                emptyCollection' Headers.headersCollection
            }

    module Client =

        open IntelliFactory.WebSharper.Html
        
        [<JavaScript>]
        let cleanDbBtn () =
            Button [Attr.Class "btn btn-primary"; Text "Clean Database"]
            |>! OnClick (fun x _ ->
                async {
                    x.AddClass "disabled"
                    do! Server.emptyDatabase ()
                    x.RemoveClass "disabled"
                    JavaScript.Alert "Done"
                } |> Async.Start)
                    
    type ButtonControl () =
            
        inherit Web.Control ()

        [<JavaScriptAttribute>]
        override __.Body = Client.cleanDbBtn () :> _