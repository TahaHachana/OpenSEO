namespace FSEO

open System
open IntelliFactory.WebSharper
open SEOLib
open SEOLib.Types

module Details =

    module Server =
        
        type Details =
            {
                RequestUri : string
                Size : string
                Server : string
                ElapsedTime : string
                Title : string
                TitleLength : string
                Description : string
                DescriptionLength : string
                Headings : (string * string list) []
            }
        
        let makeDetails requestUri size server elapsedTime title titleLength description descriptionLength headings =
            {
                RequestUri = requestUri
                Size = size
                Server = server
                ElapsedTime = elapsedTime
                Title = title
                TitleLength = titleLength
                Description = description
                DescriptionLength = descriptionLength
                Headings = headings
            }

        [<RpcAttribute>]
        let details id =
            async {
                let uriDetails = Mongo.uriDetailsById id
                let requestUri = uriDetails.RequestUri
                let size = uriDetails.Size
                let server = uriDetails.Server
                let elapsedTime = uriDetails.ElapsedTime
                let title = uriDetails.Title
                let titleLength = uriDetails.TitleLength
                let descritpion = uriDetails.Description
                let descriptionLength = uriDetails.DescriptionLength
                let headings =
                    uriDetails.Headings
                    |> Array.map (fun x -> x.Split([|"|||"|], StringSplitOptions.None))
                    |> Seq.groupBy (fun x -> x.[0])
                    |> Seq.map (fun (x, y) -> x, y |> Seq.map (fun z -> z.[1]) |> Seq.toList)
                    |> Seq.sortBy fst
                    |> Seq.toArray
                let details = makeDetails requestUri size server elapsedTime title titleLength descritpion descriptionLength headings
                return details
            }

    module Client =
        
        open IntelliFactory.WebSharper.Html
        open IntelliFactory.WebSharper.JQuery

        [<JavaScriptAttribute>]
        let makeDiv txt id =
            Div [Attr.Class "row-fluid"] -< [
                Div [Attr.Class "span4"] -< [H4 [Attr.Class "h4"] -< [Text txt]]
                Div [Attr.Class "span8"] -< [P [Id id]]
            ]
        
        [<JavaScriptAttribute>]
        let setPText (selector : string) txt =
            JQuery.Of(selector).Text(txt).Ignore

        [<JavaScriptAttribute>]
        let detailsSection id =
            let tabsDiv = Div []
            HTML5.Tags.Section [Attr.Class "tab-pane active"; Id "details"] -< [
                makeDiv "URL" "url"
                Hr []
                makeDiv "Size" "size"
                Hr []
                makeDiv "Server" "server"
                Hr []
                makeDiv "Elapsed Time" "elapsedTime"
                Hr []
                makeDiv "Title" "title"
                makeDiv "Length" "titleLength"
                Hr []
                makeDiv "Description" "description"
                makeDiv "Length" "descriptionLength"
                Hr []
                Div [Attr.Class "row-fluid"] -< [
                    Div [Attr.Class "span4"] -< [H4 [Attr.Class "h4"] -< [Text "Headings"]]
                    Div [Attr.Class "span8"] -< [tabsDiv]
                ]
            ]
            |>! OnAfterRender (fun _ ->
                async {
                    let! details = Server.details id
                    [
                        "#url"              , details.RequestUri
                        "#size"             , details.Size
                        "#server"           , details.Server
                        "#elapsedTime"      , details.ElapsedTime
                        "#title"            , details.Title
                        "#titleLength"      , details.TitleLength
                        "#description"      , details.Description
                        "#descriptionLength", details.DescriptionLength
                    ] |> List.iter (fun x -> x ||> setPText)
                    let tabs = Utilities.Client.makeTabsDiv details.Headings
                    tabsDiv.Append tabs
                } |> Async.Start)
                
        type DetailsViewer(id) =
            inherit Web.Control()

            [<JavaScript>]
            override this.Body = detailsSection id :> _

