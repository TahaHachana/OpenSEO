namespace OpenSEO

open IntelliFactory.WebSharper.Sitelets
open Model
open View

module Controller =

    let controller =

        let handle = function
            | Home            -> homeView
            | About           -> aboutView
            | Custom404       -> custom404View
            | Report reportId -> reportView reportId
            | Admin           ->
                let user = UserSession.GetLoggedInUser()
                match user with
                    | None    -> Content.Redirect <| Login None
                    | _       -> adminView
            | Login action    -> loginView action
            | Logout          ->
                UserSession.Logout ()
                Content.Redirect Home

        { Handle = handle }