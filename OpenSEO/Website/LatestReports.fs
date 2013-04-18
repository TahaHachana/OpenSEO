namespace Website

open IntelliFactory.WebSharper

module LatestReports =

    module private Server =
        
        open Mongo

        [<Rpc>]
        let latestReports() =
            async {
                let reports = Details.latest()
                match reports with
                    | [||] -> return None
                    | arr  ->
                        let someArr =
                            arr
                            |> Array.map (fun x -> x._id.ToString())
                            |> Some
                        return someArr
            }

    module private Client =
    
        open IntelliFactory.WebSharper.Html

        [<JavaScript>]
        let makeLi objectIdString =
            let href = "/Report/" + objectIdString
            LI [A [HRef href; Attr.Target "_blank"] -< [Text objectIdString]]

        [<JavaScript>]
        let main() =
            UL [Attr.Class "unstyled"]
            |>! OnAfterRender (fun x ->
                async {
                    let! arrOption = Server.latestReports()
                    match arrOption with
                        | None -> do ()
                        | Some arr ->
                            arr
                            |> Array.map makeLi
                            |> Array.iter x.Append
                } |> Async.Start) 
                
    type Control() =

        inherit Web.Control()
            
        [<JavaScript>]
        override __.Body = Client.main() :> _
