namespace FSEO

open IntelliFactory.WebSharper
open System
open System.Web

module UrlForm =

    module Server =

        open Mongo
        open SEOLib

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
                    let! httpData = HTTP.fetch uri
                    return httpData
            }

        [<RpcAttribute>]
        let fetchInsert url =
            async {
                let! httpDataOption = fetch' url
                match httpDataOption with
                    | None -> return None
                    | Some httpData ->
                        let idOption = Mongo.insertHttpData httpData
                        match idOption with
                            | None -> return None
                            | Some id -> return Some <| id.ToString()
            }

    module Client =
        
        open IntelliFactory.WebSharper.Formlet
        open IntelliFactory.WebSharper.Html
        open IntelliFactory.WebSharper.JQuery

        [<JavaScriptAttribute>]
        let form () =
            
            let legend = Legend [Text "Enter the URL you want to analyze."]
            let label = Label [Text "URL"]
            let urlInput =
                Input [
                    Attr.Class "input-xxlarge"
                    Attr.Type "text"
                    HTML5.Attr.PlaceHolder "http://www.example.com/"
                    HTML5.Attr.AutoFocus "autofocus"
                ]
                |>! OnKeyDown (fun _ key ->
                    let key' = key.KeyCode
                    match key' with
                        | 13 -> JQuery.Of("#submitButton"). Click().Ignore
                        | _  -> ())

            let submitBtn =
                Button [Id "submitButton"; Attr.Class "btn btn-primary"; Text "Submit"; Attr.Type "button"]
                |>! OnClick (fun x _ ->
                    async {
                        x.AddClass "disabled"
                        let! idOption = Server.fetchInsert urlInput.Value
                        match idOption with
                            | None ->
                                JavaScript.Alert "Requesting the specified URL failed."
                                x.RemoveClass "disabled"
                            | Some id -> Html5.Window.Self.Location.Href <- ("/Report/" + id)
                    } |> Async.Start)

            let legendFormlet    = Formlet.OfElement (fun _ -> legend)
            let labelFormlet     = Formlet.OfElement (fun _ -> label)
            let urlInputFormlet  = Formlet.OfElement (fun _ -> urlInput)
            let submitBtnFormlet = Formlet.OfElement (fun _ -> submitBtn)
            
            let form =
                Formlet.Yield (fun _ _ _ _ -> ())
                <*> legendFormlet
                <*> labelFormlet
                <*> urlInputFormlet
                <*> submitBtnFormlet

            Formlet.Run (fun _ -> ()) form

        type FormViewer () =
            inherit Web.Control ()

            [<JavaScriptAttribute>]
            override this.Body = form ()