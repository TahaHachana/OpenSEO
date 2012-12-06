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
                    Id "forkme"
                ]
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

        let intro : Content.HtmlElement =
            HTML5.Header [Id "header"] -< [
                P [
                    Strong [Text "OpenSEO"]
                    Text " is an open source Web-based SEO tool that allows you to run a quick review of a URL to gather SEO data and get some optimization tips. Both the "
                    A [HRef "https://github.com/TahaHachana/OpenSEO"; Target "_blank"] -< [Text "application"]
                    Text " and the "
                    A [HRef "https://github.com/TahaHachana/SEOLib"; Target "_blank"] -< [Text ".NET component"]
                    Text " that exposes the main functionality are open source on GitHub."
                ]
            ]

    module AboutContent =
        
        let navigation : Content.HtmlElement = Utilities.Server.makeNavigation <| Some "About"

        let title = "About OpenSEO | Open Source SEO Tool"

        let metaDesc = "Learn more about OpenSEO, an open source SEO tool maintained by Taha Hachana on GitHub."

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
                    LI [A [HRef "#headers"; HTML5.Data "toggle" "tab"] -< [Text "Headers"]]
                    LI [A [HRef "#validator"; HTML5.Data "toggle" "tab"] -< [Text "HTML"]]
                    LI [A [HRef "#speed"; HTML5.Data "toggle" "tab"] -< [Text "Speed"]]
                ]
                Div [Class "tab-content"] -< [
                    new Details.DetailsControl(id)       :> INode<_>
                    new Keywords.KeywordsControl(id)     :> _
                    new Links.LinksControl(id)           :> _
                    new Violations.ViolationsControl(id) :> _
                    new Headers.HeadersControl(id)       :> _
                    new Validator.ValidatorControl ()    :> _
                    new Pagespeed.PagespeedControl ()    :> _
                ]
            ]