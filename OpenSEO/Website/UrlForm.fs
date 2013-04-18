namespace Website

open IntelliFactory.WebSharper
open System

module UrlForm =

    type private MongoObjectId = string

    type private Result =
        | MongoError
        | InvalidUri
        | NotHtml
        | RequestFailed
        | Success of MongoObjectId

    module private Server =

        open SEOLib
        open SEOLib.Types

        let tryCreateUri uriString =
            Uri.TryCreate(uriString, UriKind.Absolute)
            |> function
                | false, _ ->
                    Uri.TryCreate(("http://" + uriString), UriKind.Absolute)
                    |> function
                        | false, _ -> None
                        | true , x -> Some x
                | true, x -> Some x

        let rec getLineCol idx len index (lines : string []) =
            let l = lines.[idx].Length + 1
            let len' = l + len
            if len' > index then
                idx + 1, l - (len' - index) + 1
            else
                getLineCol (idx + 1) len' index lines

        let processKeywords html id =
            Keywords.analyzeKeywords html
            |> Array.map (fun x -> Mongo.RecordTypes.Keyword.Make id x.WordsCount x.Combination x.Occurrence x.Density)
            |> Mongo.Keywords.insert

        let processLinks html requestUri id =
            Links.collectLinks html requestUri
            |> List.map (fun x ->
                let linkType = x.Type   |> function Internal -> "Internal" | _ -> "External"
                let follow   = x.Follow |> function DoFollow -> "Follow"   | _ -> "NoFollow"
                Mongo.RecordTypes.Link.Make id x.URL x.Anchor linkType follow)
            |> Mongo.Links.insert

        let processViolations html requestUri id =
            async {
                let! violations = Violations.auditHtml html requestUri
                let lines = html.Split '\n'
                violations
                |> Array.concat
                |> Array.map (fun x ->
                    let category' = x.Category |> function Content -> "Content" | Performance -> "Performance" | SEO -> "SEO" | Standards -> "Standards"
                    let code' = x.Code |> function AltEmpty -> "AltEmpty" | _ -> "AltMissing"
                    let line, column =
                        match x.Index with
                            | None -> "NA", "NA"
                            | Some index ->
                                let x, y = getLineCol 0 0 index lines
                                string x, string y
                    let level' = x.Level |> function Error -> "Error" | Warning -> "Warning"
                    Mongo.RecordTypes.Violation.Make id category' code' column x.Description x.Heading level' line x.Recommendation)
                |> Mongo.Violations.insert
            }
        
        let processHeaders (httpData : HttpData) id =
            httpData.Headers
            |> List.map (fun header ->
                header.Value |> List.map (fun x -> header.Key, x))
            |> List.concat
            |> List.map (fun (key, value) ->
                Mongo.RecordTypes.HttpHeader.Make id key value)
            |> List.toArray
            |> Mongo.Headers.insert

        [<Rpc>]
        let fetchInsert uriString =
            async {
                let uriOption = tryCreateUri uriString
                match uriOption with
                    | None -> return InvalidUri
                    | Some uri ->
                        let! httpDataOption = Http.fetch uri
                        match httpDataOption with
                            | None -> return RequestFailed
                            | Some httpData ->
                                let idOption = Mongo.Details.insert httpData
                                match idOption with
                                    | None -> return MongoError
                                    | Some id ->
                                        let htmlOption = httpData.Html
                                        match htmlOption with
                                            | None -> return NotHtml
                                            | Some html ->
                                                let id' = id.ToString()
                                                let requestUri = httpData.RequestUri
                                                processKeywords html id'
                                                processLinks html requestUri id'
                                                do! processViolations html requestUri id'
                                                processHeaders httpData id'
                                                return Success id'
            }

    [<JavaScript>]
    module private Client =
        
        open IntelliFactory.WebSharper.Html
        open IntelliFactory.WebSharper.JQuery

        let alertHideLoader (element : Element) (jquery : JQuery) msg =
            do jquery.Css("visibility", "hidden").Ignore
            do element.RemoveClass "disabled"
            do JavaScript.Alert msg

        let showLoader (jquery : JQuery) (element : Element) =
            element.AddClass "disabled"
            jquery.Css("visibility", "visible").Ignore

        let main() =
            let legend = Legend [Text "Enter the URL you want to analyze."]
            let label = Label [Text "URL"]
            let urlInput =
                Input [
                    Attr.Class "span6"
                    Attr.Type "text"
                    HTML5.Attr.PlaceHolder "http://www.YourWebsite.com/"
                    HTML5.Attr.AutoFocus "autofocus"
                    HTML5.Attr.SpellCheck "false"
                ]
                |>! OnKeyDown (fun _ key ->
                    let key' = key.KeyCode
                    match key' with
                        | 13 -> JQuery.Of("#submitButton").Click().Ignore
                        | _  -> do ())

            let submitBtn =
                Button [Id "submitButton"; Attr.Class "btn btn-success"; Text "URL Review"; Attr.Type "button"]
                |>! OnClick (fun x _ ->
                    async {
                        let loaderJquery = JQuery.Of("#loader")
                        showLoader loaderJquery x
                        let! idOption = Server.fetchInsert urlInput.Value
                        let alertHideLoader' = alertHideLoader x loaderJquery
                        match idOption with
                            | MongoError         -> alertHideLoader' "An error occured."
                            | InvalidUri         -> alertHideLoader' "The specified URL is invalid."
                            | NotHtml            -> alertHideLoader' "The specified URL doesn't point to a HTML document. The application can only process HTML pages."
                            | RequestFailed      -> alertHideLoader' "Downloading the specified URL failed."
                            | Success mongoObjId -> Html5.Window.Self.Location.Href <- ("/report/" + mongoObjId)
                    } |> Async.Start)

            Div [Id "urlForm"; Attr.Class "input-append offset2"] -< [
                urlInput
                submitBtn
            ]

    type Control() =

        inherit Web.Control()

        [<JavaScript>]
        override __.Body = Client.main() :> _