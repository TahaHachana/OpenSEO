namespace OpenSEO

open IntelliFactory.WebSharper
open System
open System.Web

module UrlForm =

    module Server =

        open Mongo
        open SEOLib
        open SEOLib.Types

        let fetch' url =
            async {
            let uriOption =
                Uri.TryCreate(url, UriKind.Absolute) |> function
                    | false, _ ->
                        Uri.TryCreate(("http://" + url), UriKind.Absolute) |> function
                            | false, _ -> None
                            | true , x -> Some x
                    | true, x -> Some x
            match uriOption with
                | None -> return None
                | Some uri ->
                    let! httpData = Http.fetch uri
                    return httpData
            }

        [<RpcAttribute>]
        let fetchInsert url =
            async {
                let! httpDataOption = fetch' url
                match httpDataOption with
                    | None -> return None
                    | Some httpData ->
                        let idOption = Mongo.Details.insertUriDetails httpData
                        match idOption with
                            | None -> return None
                            | Some id ->
                                let htmlOption = httpData.Html
                                let id' = id.ToString()
                                match htmlOption with
                                    | None -> ()
                                    | Some html ->
                                        Keywords.analyzeKeywords html
                                        |> Array.map (fun x -> Mongo.Keywords.makeKeyword id' x.WordsCount x.Combination x.Occurrence x.Density)
                                        |> Mongo.Keywords.insertKeywords

                                        Links.collectLinks html httpData.RequestUri
                                        |> List.map (fun x ->
                                            let linkType = x.Type |> function Internal -> "Internal" | _ -> "External"
                                            let follow = x.Follow |> function DoFollow -> "Follow" | _ -> "NoFollow"
                                            Mongo.Links.makeLink id' x.URL x.Anchor linkType follow)
                                        |> Mongo.Links.insertLinks
                                return Some id'
            }

    module Client =
        
        open IntelliFactory.WebSharper.Formlet
        open IntelliFactory.WebSharper.Html
        open IntelliFactory.WebSharper.JQuery

        [<JavaScriptAttribute>]
        let urlForm () =
            
            let legend = Legend [Text "Enter the URL you want to analyze."]
            let label = Label [Text "URL"]
            let urlInput =
                Input [
                    Attr.Class "input-xxlarge"
                    Attr.Type "text"
                    HTML5.Attr.PlaceHolder "http://www.example.com/"
                    HTML5.Attr.AutoFocus "autofocus"
                    HTML5.Attr.SpellCheck "false"
                ]
                |>! OnKeyDown (fun _ key ->
                    let key' = key.KeyCode
                    match key' with
                        | 13 -> JQuery.Of("#submitButton").Click().Ignore
                        | _  -> ())

            let submitBtn =
                Button [Id "submitButton"; Attr.Class "btn btn-primary"; Text "Submit"]
                |>! OnClick (fun x _ ->
                    async {
                        x.AddClass "disabled"
                        let loaderJquery = JQuery.Of("#loader")
                        loaderJquery.Css("visibility", "visible").Ignore
                        let! idOption = Server.fetchInsert urlInput.Value
                        match idOption with
                            | None ->
                                loaderJquery.Css("visibility", "hidden").Ignore
                                JavaScript.Alert "Requesting the specified URL failed."
                                x.RemoveClass "disabled"
                            | Some id -> Html5.Window.Self.Location.Href <- ("/Report/" + id)
                    } |> Async.Start)

//            let legendFormlet    = Formlet.OfElement (fun _ -> legend)
//            let labelFormlet     = Formlet.OfElement (fun _ -> label)
//            let urlInputFormlet  = Formlet.OfElement (fun _ -> urlInput)
//            let submitBtnFormlet = Formlet.OfElement (fun _ -> submitBtn)
//            
//            let form =
//                Formlet.Yield (fun _ _ _ _ -> ())
//                <*> legendFormlet
//                <*> labelFormlet
//                <*> urlInputFormlet
//                <*> submitBtnFormlet
//
//            Formlet.Run (fun _ -> ()) form
            Div [Id "urlForm"; Attr.Class "offset2"] -< [
                legend
                label
                urlInput
                Div [submitBtn]
            ]

        type FormViewer () =
            inherit Web.Control ()

            [<JavaScriptAttribute>]
            override this.Body = urlForm() :> _