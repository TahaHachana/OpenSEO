namespace OpenSEO

open IntelliFactory.WebSharper.Sitelets

module Model =

    type ReportId = string

    type Action =
        | About
        | Admin
        | Custom404
        | Home
        | Login of Action option
        | Logout
        | Report of ReportId

    type Page =
        {
            Title           : string
            MetaDescription : string
            Body            : Content.HtmlElement list
        }