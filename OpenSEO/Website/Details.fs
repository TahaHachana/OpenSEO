namespace OpenSEO

open System
open IntelliFactory.WebSharper

module Details =

    module Server =
        
        open Mongo

        type Details =
            {
                Description : string
                ElapsedTime : string
                Headings    : (string * string list) []
                RequestUri  : string
                TextRatio   : float
                Title       : string
            }
        
        let processHeadings (headings : string []) =
            headings
            |> Array.map (fun x -> x.Split([|"|||"|], StringSplitOptions.None))
            |> Seq.groupBy (fun x -> x.[0])
            |> Seq.map (fun (x, y) -> x, y |> Seq.map (fun z -> z.[1]) |> Seq.toList)
            |> Seq.sortBy fst
            |> Seq.toArray

        let makeDetails (uriDetails : Types.UriDetails) =
            {
                Description = uriDetails.Description
                ElapsedTime = uriDetails.ElapsedTime
                Headings    = processHeadings uriDetails.Headings
                RequestUri  = uriDetails.RequestUri
                TextRatio   = uriDetails.TextRatio
                Title       = uriDetails.Title
            } |> Some

        [<Rpc>]
        let details id =
            async {
                let uriDetailsOption = Details.uriDetailsById id
                match uriDetailsOption with
                    | None            -> return None
                    | Some uriDetails -> return makeDetails uriDetails
            }

    module Client =
        
        open IntelliFactory.WebSharper.Html
        open IntelliFactory.WebSharper.JQuery

        [<JavaScript>]
        let makeDiv divId h4Text pId =
            Div [Attr.Class "row-fluid"] -< [
                Div [Attr.Class "span3"; Id divId] -< [H4 [Attr.Class "h4"] -< [Text h4Text]]
                Div [Attr.Class "span9"] -< [P [Id pId]]
            ]
        
        [<JavaScript>]
        let setPText (selector : string) txt =
            JQuery.Of(selector).Text(txt).Ignore

        [<JavaScript>]
        let displayLength str (selector : string) =
            let strLength = match str with "MISSING" -> None | x -> Some ("(" + string x.Length + " characters)")
            match strLength with
                | None   -> ()
                | Some x -> JQuery.Of(selector).Append(JQuery.Of("<small/>").Text(x)).Ignore

        [<JavaScript>]
        let displayDetails (details : Server.Details) (tabsDiv : Element) =
            let title = details.Title
            let description = details.Description
            setPText "#url" details.RequestUri
            setPText "#elapsedTime" <| details.ElapsedTime + " milliseconds"
            setPText "#textRatio" <| string details.TextRatio + " %"
            setPText "#title" title
            displayLength title "#titleDiv"
            setPText "#description"  description
            displayLength description "#descDiv"
            let headings = details.Headings
            match headings.Length with
                | 0 -> ()
                | _ ->
                    let tabs = Utilities.Client.makeTabsDiv headings
                    tabsDiv.Append tabs

        [<JavaScript>]
        let setInputVal (selector : string) requestUri =
            JQuery.Of(selector).Val(requestUri).Trigger("change").Ignore

        [<JavaScript>]
        let detailsSection id =
            let tabsDiv = Div []
            HTML5.Tags.Section [Attr.Class "tab-pane fade active in reportSection"; Id "details"] -< [
                makeDiv "urlDiv" "URL" "url"
                Utilities.Client.hRule ()
                makeDiv "timeDiv" "Elapsed Time" "elapsedTime"
                Utilities.Client.hRule ()
                makeDiv "textRatioDiv" "Text/HTML Ratio" "textRatio"
                Utilities.Client.hRule ()
                makeDiv "titleDiv" "Title" "title"
                Utilities.Client.hRule ()
                makeDiv "descDiv" "Description" "description"
                Utilities.Client.hRule ()
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
                            displayDetails details tabsDiv
                            let requestUri = details.RequestUri
                            setInputVal "#validatorUri" requestUri
                            setInputVal "#pagespeedUri" requestUri
                            Utilities.Client.updateProgressBar ()
                } |> Async.Start)
                
    type DetailsControl(id) =

        inherit Web.Control()

        [<JavaScript>]
        override __.Body = Client.detailsSection id :> _