module Sitelet.Site

open IntelliFactory.WebSharper.Sitelets
open Model
open Controller

let router : Router<Action> =
    Router.Table [
        About, "/about"
        Error, "/error"
        Home, "/"
    ]

let sitelet =
    {
        Controller = controller
        Router = router
    }
    
type Website() =
    interface IWebsite<Action> with
        member this.Actions = []
        member this.Sitelet = sitelet

[<assembly: WebsiteAttribute(typeof<Website>)>]
do ()