namespace Website

open IntelliFactory.WebSharper.Sitelets
open Model

module Controller =
    
    let private protect view =
        match UserSession.GetLoggedInUser() with
            | None -> Content.Redirect <| Login None
            | _    -> view

    let private logout() =
        UserSession.Logout ()
        Content.Redirect Home

    let controller =

        let handle = function
            | Home      -> Views.home
            | About     -> Views.about
            | Error     -> Views.error
            | Report id -> Views.report id
            | Admin     -> protect Views.admin
            | Login a   -> Views.login a
            | Logout    -> logout()

        { Handle = handle }