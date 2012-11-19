namespace OpenSEO

open IntelliFactory.WebSharper.Sitelets

module Model =

    type ReportId = string

    type Action =
        | Home
        | About
        | Report of ReportId
        | Admin
        | Login of Action option
        | Logout

    type Page =
        {
            Title           : string
            MetaDescription : string
            Body            : Content.HtmlElement list
        }