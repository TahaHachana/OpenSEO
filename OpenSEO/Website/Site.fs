namespace Website

open IntelliFactory.WebSharper.Sitelets
open Model
open Controller

module Site =

    let router : Router<Action> =
        Router.Table
            [
                About     , "about"
                Admin     , "admin"
                Error     , "error"
                Home      , "/"
                Login None, "login"
            ]
        <|>
        Router.Infer()

    let sitelet =
        {
            Controller = controller
            Router     = router
        }
            
type Website() =
    interface IWebsite<Action> with
        member this.Sitelet = Site.sitelet
        member this.Actions = []

[<assembly: WebsiteAttribute(typeof<Website>)>]
do()