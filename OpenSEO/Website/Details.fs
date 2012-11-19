namespace OpenSEO

open System
open IntelliFactory.WebSharper

module Details =

    module Server =
        
        open Mongo

        type Details =
            {
                RequestUri        : string
                Size              : string
                Server            : string
                ElapsedTime       : string
                Title             : string
                TitleLength       : string
                Description       : string
                DescriptionLength : string
                Headings          : (string * string list) [] option
            }
        
        let makeDetails requestUri size server elapsedTime title titLen description descLen headings =
            {
                RequestUri        = requestUri
                Size              = size
                Server            = server
                ElapsedTime       = elapsedTime
                Title             = title
                TitleLength       = titLen
                Description       = description
                DescriptionLength = descLen
                Headings          = headings
            } |> Some
        
        let processHeadings (headings : string []) =
            match headings with
                | [||] -> None
                | _    ->
                    headings
                    |> Array.map (fun x -> x.Split([|"|||"|], StringSplitOptions.None))
                    |> Seq.groupBy (fun x -> x.[0])
                    |> Seq.map (fun (x, y) -> x, y |> Seq.map (fun z -> z.[1]) |> Seq.toList)
                    |> Seq.sortBy fst
                    |> Seq.toArray
                    |> Some

        [<Rpc>]
        let details id =
            async {
                let uriDetailsOption = Details.uriDetailsById id
                match uriDetailsOption with
                    | None -> return None
                    | Some uriDetails ->
                        let requestUri = uriDetails.RequestUri
                        let size = uriDetails.Size
                        let server = uriDetails.Server
                        let elapsedTime = uriDetails.ElapsedTime
                        let title = uriDetails.Title
                        let titLen = uriDetails.TitleLength
                        let desc = uriDetails.Description
                        let descLen = uriDetails.DescriptionLength
                        let headings = processHeadings uriDetails.Headings
                        let details = makeDetails requestUri size server elapsedTime title titLen desc descLen headings
                        return details
            }

    module Client =
        
        open IntelliFactory.WebSharper.Html
        open IntelliFactory.WebSharper.JQuery

        [<JavaScript>]
        let makeDiv txt id =
            Div [Attr.Class "row-fluid"] -< [
                Div [Attr.Class "span3"] -< [H4 [Attr.Class "h4"] -< [Text txt]]
                Div [Attr.Class "span9"] -< [P [Id id]]
            ]
        
        [<JavaScript>]
        let setPText (selector : string) txt =
            JQuery.Of(selector).Text(txt).Ignore

        [<JavaScript>]
        let detailsSection id =
            let tabsDiv = Div []
            HTML5.Tags.Section [Attr.Class "tab-pane fade active in reportSection"; Id "details"] -< [
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
                    Div [Attr.Class "span3"] -< [H4 [Attr.Class "h4"] -< [Text "Headings"]]
                    Div [Attr.Class "span9"] -< [tabsDiv]
                ]
            ]
            |>! OnAfterRender (fun _ ->
                async {
                    let! detailsOption = Server.details id
                    match detailsOption with
                        | None -> ()
                        | Some details ->
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
                            match details.Headings with
                                | None -> ()
                                | Some headings ->
                                    let tabs = Utilities.Client.makeTabsDiv headings
                                    tabsDiv.Append tabs
                            Utilities.Client.updateProgressBar ()
                } |> Async.Start)
                
    type DetailsControl(id) =

        inherit Web.Control()

        [<JavaScript>]
        override __.Body = Client.detailsSection id :> _