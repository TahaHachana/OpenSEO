namespace Website

module Login =

    open IntelliFactory.WebSharper

    type private LoginInfo =
        {
            Name     : string
            Password : string
        }

    type private Access = Denied | Granted

    module private Server =
        
        open IntelliFactory.WebSharper.Sitelets

        [<Rpc>]
        let login loginInfo =
            async {
                if loginInfo.Password = Secure.password then
                    UserSession.LoginUser loginInfo.Name
                    return Granted
                else
                    return Denied
            }

    module private Client =
        
        open IntelliFactory.WebSharper.Html
        open IntelliFactory.WebSharper.Formlet
        open IntelliFactory.WebSharper.JQuery

        [<JavaScript>]
        let passInput =
            Input [Attr.Type "password"; HTML5.Attr.PlaceHolder "password"]
            |>! OnKeyDown (fun _ key ->
                match key.KeyCode with
                    | 13 -> JQuery.Of("#login-btn").Click().Ignore
                    | _  -> do ())

        [<JavaScript>]
        let main (redirectUrl: string) =
            let userInput = Input [Attr.Type "text"; HTML5.Attr.AutoFocus "autofocus"; HTML5.Attr.PlaceHolder "username"]
            let submitBtn =
                Button [Attr.Type "button"; Attr.Class "btn"; Id "login-btn"] -< [Text "Submit"]
               |>! OnClick (fun _ _ ->
                    async {
                        let! access = Server.login {Name = userInput.Value; Password = passInput.Value}
                        match access with
                            | Denied  -> JavaScript.Alert "Login failed"
                            | Granted -> Html5.Window.Self.Location.Href <- redirectUrl
                    } |> Async.Start)

            Form [
                FieldSet [
                    Legend [Text "Login"]
                    Label [Text "Username"]
                    userInput
                    Label [Text "Password"]
                    passInput
                ]
                FieldSet [
                    submitBtn
                ]
            ]

    type Control(redirectUrl) =
        
        inherit Web.Control()

        [<JavaScript>]
        override __.Body = Client.main redirectUrl :> _