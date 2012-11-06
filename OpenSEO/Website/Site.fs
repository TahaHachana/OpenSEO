namespace FSEO

open IntelliFactory.WebSharper.Sitelets
open Model
open Skin
open Controller

module Site =

    let router : Router<Action> =
        Router.Table
            [
                Home, "/"
            ]
        <|>
        Router.Infer()

    let main =
        {
            Controller = controller
            Router     = router
        }
    
type Website() =
    interface IWebsite<Action> with
        member this.Sitelet = Site.main
        member this.Actions = [Home]

[<assembly: WebsiteAttribute(typeof<Website>)>]
do ()