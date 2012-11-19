namespace OpenSEO

open IntelliFactory.WebSharper

module Login =

    type LoginInfo =
        {
            Name     : string
            Password : string
        }

    module Server =
        
        open IntelliFactory.WebSharper.Sitelets

        [<Rpc>]
        let login loginInfo =
            if loginInfo.Password = Secure.password then
                UserSession.LoginUser loginInfo.Name
                true
            else
                false
            |> async.Return

    module Client =
        
        open IntelliFactory.WebSharper.Html
        open IntelliFactory.WebSharper.Formlet

        [<JavaScript>]
        let loginForm (redirectUrl: string) =

            let userName =
                Controls.Input ""
                |> Enhance.WithTextLabel "Username"

            let password =
                Controls.Password ""
                |> Enhance.WithTextLabel "Password"

            let formlet =
                Formlet.Yield (fun n pw -> {Name=n; Password=pw})
                <*> userName <*> password
                |> Enhance.WithSubmitButton
                |> Enhance.WithFormContainer
            
            Formlet.Run (fun loginInfo ->
                async {
                    let! loggedIn = Server.login loginInfo
                    match loggedIn with
                            | false -> JavaScript.Alert "Login failed"
                            | true -> Html5.Window.Self.Location.Href <- redirectUrl
                } |> Async.Start ) formlet


    type LoginControl(redirectUrl) =
        
        inherit Web.Control ()

        [<JavaScript>]
        override __.Body = Client.loginForm redirectUrl