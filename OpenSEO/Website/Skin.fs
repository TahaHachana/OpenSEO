namespace FSEO

open System.Web
open IntelliFactory.WebSharper.Sitelets
open Model

module Skin =

    let templateLoadFrequency = Content.Template.Once
//        #if DEBUG
//        Content.Template.PerRequest
//        #else
//        Content.Template.Once
//        #endif

    let mainTemplate =
        let path = HttpContext.Current.Server.MapPath("~/Main.html")
        Content.Template<Page>(path, templateLoadFrequency)
            .With("title"          , fun x -> x.Title)
            .With("metaDescription", fun x -> x.MetaDescription)
            .With("body"           , fun x -> x.Body)

    let withTemplate title metaDescription body : Content<Action> =
        Content.WithTemplate mainTemplate <| fun context ->
            {
                Title           = title
                MetaDescription = metaDescription
                Body            = body context
            }