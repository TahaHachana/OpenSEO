namespace OpenSEO

open IntelliFactory.WebSharper.Sitelets
open IntelliFactory.Html
open Model

module SiteContent =

    module SharedContent =

        let forkme : Content.HtmlElement =
            A [HRef "https://github.com/TahaHachana/OpenSEO"; Target "_blank"] -< [
                Img [
                    Src "https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png"
                    Alt "Fork me on GitHub"
                    Id "forkme"]
            ]

        let analyticsScript : Content.HtmlElement = Script [Src "../Scripts/GoogleAnalytics.js"]

        let ( => ) title href =
            A [HRef href] -< [Text title]
    
        let randomizeUrl url =
            url + "?d=" + System.Uri.EscapeUriString (System.DateTime.Now.ToString())

        let loginInfo (ctx: Context<Action>) =
            let user = UserSession.GetLoggedInUser ()
            Div [Class "pull-right"] -< [
                (
                    match user with
                    | Some username ->
                        "Log Out (" + username + ")" => 
                            (randomizeUrl <| ctx.Link Action.Logout)
                    | None ->
                        "Login" => (ctx.Link <| Action.Login None)
                )
            ]

    module HomeContent =
        
        let navigation : Content.HtmlElement = Utilities.Server.makeNavigation <| Some "Home"
        
        let title = "Open Source SEO Tool"

        let metaDesc = "Open source SEO (search engine optimization) tool offering HTML auditing, keywords analysis and speed testing functionality."

    module AboutContent =
        
        let navigation : Content.HtmlElement = Utilities.Server.makeNavigation <| Some "About"

        let title = "About OpenSEO | Open Source SEO Tool"

        let metaDesc = "Learn more about OpenSEO, an open source search engine optimization app offering HTML, keywords and speed auditing features."

        let description : Content.HtmlElement =
            P [Text "OpenSEO is an open source SEO tool built with "] -< [
                A [HRef "http://www.websharper.com/"; Target "_blank"] -< [Text "WebSharper"]
                Text " that uses functionality provided by a "
                A [HRef "https://github.com/TahaHachana/SEOLib"; Target "_blank"] -< [Text "SEO library"]
                Text " developed in F#. The code source of the application and the SEO component is maintained by "
                A [HRef "https://github.com/TahaHachana"; Target "_blank"] -< [Text "Taha Hachana"]
                Text " on GitHub."
            ]

    module ReportContent =
        
        let navigation : Content.HtmlElement =
            Utilities.Server.makeNavigation None

        let title = "SEO Report"

        let metaDesc = ""

        let progressBar : Content.HtmlElement =
            Div [Class "progress"; Id "progressDiv"] -< [
                Div [Class "bar"; Id "progressBar"; HTML5.Data "width" "0"]
            ]

        let tabs id =
            Div [Class "tabbable tabs-left"] -< [
                UL [Class "nav nav-tabs"] -< [
                    LI [Class "active"] -< [A [HRef "#details"; HTML5.Data "toggle" "tab"] -< [Text "Details"]]
                    LI [A [HRef "#keywords"; HTML5.Data "toggle" "tab"] -< [Text "Keywords"]]
                    LI [A [HRef "#links"; HTML5.Data "toggle" "tab"] -< [Text "Links"]]
                    LI [A [HRef "#violations"; HTML5.Data "toggle" "tab"] -< [Text "Violations"]]
                    LI [A [HRef "#html"; HTML5.Data "toggle" "tab"] -< [Text "HTML"]]
                ]
                Div [Class "tab-content"] -< [
                    new Details.DetailsControl(id)               :> INode<_>
                    new Keywords.KeywordsControl(id)             :> _
                    new Links.LinksControl(id)                   :> _
                    new Violations.ViolationsControl(id)         :> _
                    Div [Class "tab-pane fade"; Id "html"] -< [] :> _
                ]
            ]