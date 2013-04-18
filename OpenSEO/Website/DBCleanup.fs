namespace Website

open System
open IntelliFactory.WebSharper

module DBCleanup =

    module private Server =
        
        open Mongo
        open Utils.Server

        let oneHourAgo() = TimeSpan(1, 0, 0) |> DateTime.Now.Subtract
            
        [<Rpc>]
        let emptyDatabase() =
            async {
                let datetime = oneHourAgo()
                let emptyCollection' collection = emptyCollection datetime collection
                do emptyCollection' uriDetails
                do emptyCollection' keywords
                do emptyCollection' links
                do emptyCollection' violations
                do emptyCollection' httpHeaders
            }

    module private Client =

        open IntelliFactory.WebSharper.Html
        
        [<JavaScript>]
        let main() =
            Button [Attr.Class "btn btn-primary"; Text "Clean Database"]
            |>! OnClick (fun x _ ->
                async {
                    x.AddClass "disabled"
                    do! Server.emptyDatabase()
                    x.RemoveClass "disabled"
                    JavaScript.Alert "Done"
                } |> Async.Start)
                    
    type Control() =
            
        inherit Web.Control()

        [<JavaScript>]
        override __.Body = Client.main() :> _
