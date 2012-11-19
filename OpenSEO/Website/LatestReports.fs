namespace OpenSEO

open IntelliFactory.WebSharper

module LatestReports =

    module Server =

        [<Rpc>]
        let latestReports () =
            async {
                let reports = Mongo.Details.latestReports ()
                match reports with
                    | [||] -> return None
                    | arr  ->
                        return
                            arr
                            |> Array.map (fun x -> x.RequestUri)
                            |> Some
            }

    module Client =
    
        open IntelliFactory.WebSharper.Html

        [<JavaScript>]
        let makeLi url =
            LI [A [HRef url; Attr.Target "_blank"] -< [Text url]]
            
        [<JavaScript>]
        let latestReportsList () =
            UL [Attr.Class "unstyled"]
            |>! OnAfterRender (fun x ->
                async {
                    let! arrOption = Server.latestReports ()
                    match arrOption with
                        | None -> ()
                        | Some arr ->
                            arr
                            |> Array.map makeLi
                            |> Array.iter x.Append
                } |> Async.Start) 
                
    type LatestReportsControl () =
        inherit Web.Control ()
            
        [<JavaScriptAttribute>]
        override __.Body = Client.latestReportsList () :> _