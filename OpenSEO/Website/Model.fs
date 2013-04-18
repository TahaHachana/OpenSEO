namespace Website

open IntelliFactory.WebSharper.Sitelets

module Model =

    type ReportId = string

    type Action =
        | About
        | Admin
        | Error
        | Home
        | Login of Action option
        | Logout
        | [<CompiledName("report")>] Report of ReportId