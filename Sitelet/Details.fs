module Sitelet.Details

open SEOLib

type UriDetails =
    {
        RequestUri : string
        ResponseTime : int64
        IsHtml : bool
        TextHtmlRatio : float
        Title : string option
        MetaDescription : string option
        Headings : Html.Heading list
    }

[<AutoOpen>]
module private Utils =

    let fSome none f =
        function
        | None -> none
        | Some some -> f some

    let isHtml = fSome false (fun _ -> true)

    let textHtmlRatio = fSome 0. Html.textHtmlRatio

    let title  = fSome None Html.title

    let metaDescription = fSome None Html.metaDescription

    let headings = fSome [] Html.headings

let uriDetails (httpInfo:Http.HttpInfo) =
    let htmlOption = httpInfo.Html
    {
        RequestUri = httpInfo.Uri.ToString()
        ResponseTime = int64 httpInfo.ElapsedTime
        IsHtml = isHtml htmlOption
        TextHtmlRatio = textHtmlRatio htmlOption
        Title = title htmlOption
        MetaDescription = metaDescription htmlOption
        Headings = headings htmlOption
    }