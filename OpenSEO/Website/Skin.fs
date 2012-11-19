namespace OpenSEO

open System.Web
open IntelliFactory.WebSharper.Sitelets
open Model

module Skin =

    let templateLoadFrequency = Content.Template.Once

    let makeTemplate path =
        let path' = HttpContext.Current.Server.MapPath path
        Content.Template<Page>(path', templateLoadFrequency)
            .With("title"          , fun x -> x.Title)
            .With("metaDescription", fun x -> x.MetaDescription)
            .With("body"           , fun x -> x.Body)

    let withTemplate template title metaDescription body : Content<Action> =
        Content.WithTemplate template <| fun context ->
            {
                Title           = title
                MetaDescription = metaDescription
                Body            = body context
            }

    let mainTemplate   = makeTemplate "~/Main.html"
    let reportTemplate = makeTemplate "~/Report.html"

    let withMainTemplate   = withTemplate mainTemplate
    let withReportTemplate = withTemplate reportTemplate