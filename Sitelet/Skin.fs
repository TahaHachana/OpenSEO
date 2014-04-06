module Sitelet.Skin

open IntelliFactory.WebSharper.Sitelets
open System.Web

type Page =
    {
        Title : string
        MetaDescription : string
        Body : Content.HtmlElement
    }

    static member New title metaDescription makeBody context =
        {
            Title = title
            MetaDescription = metaDescription
            Body = makeBody context
        }

let loadFrequency =
#if DEBUG
    Content.Template.PerRequest
#else
    Content.Template.Once
#endif

let makeTemplate<'T> path =
    let path' = HttpContext.Current.Server.MapPath path
    Content.Template<'T>(path', loadFrequency)
    
let makePageTemplate path =
    makeTemplate<Page> path
    |> fun template ->
        template
            .With("title" , fun page -> page.Title)
            .With("meta-description", fun page -> page.MetaDescription)
            .With("body", fun page -> page.Body)

let withTemplate<'T> template title metaDesc makeBody : Content<'T> =
    let page context = Page.New title metaDesc makeBody context
    Content.WithTemplate template page