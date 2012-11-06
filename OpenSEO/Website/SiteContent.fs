namespace FSEO

open IntelliFactory.WebSharper.Sitelets
open IntelliFactory.Html

module SiteContent =

    module SharedContent =

        let forkme : Content.HtmlElement =
            A [HRef "https://github.com/TahaHachana/OpenSEO"; Target "_blank"] -< [
                Img [
                    Src "https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png"
                    Alt "Fork me on GitHub"
                    Id "forkme"]
            ]

    module HomeContent =
        
        let navigation : Content.HtmlElement = Utilities.Server.makeNavigation <| Some "Home"
        
        let title = "Open Source SEO Tool"

        let metaDesc = "Open source search engine optimization tool that provides HTML auditing, keywords analysis and speed testing functionality."

    module AboutContent =
        
        let navigation : Content.HtmlElement = Utilities.Server.makeNavigation <| Some "About"

        let title = "About OpenSEO - Open Source SEO Tool"

        let metaDesc = "Learn more about OpenSEO"

        let description : Content.HtmlElement =
            P [Text "OpenSEO is an open source SEO tool built with "] -< [
                A [HRef "http://www.websharper.com/"; Target "_blank"] -< [Text "WebSharper"]
                Text " and uses functionality provided by a "
                A [HRef "https://github.com/TahaHachana/SEOLib"; Target "_blank"] -< [Text "SEO library"]
                Text " developed in F#."
            ]

    module ReportContent =
        
        let navigation : Content.HtmlElement = Utilities.Server.makeNavigation None

        let title = "SEO Report"

        let metaDesc = ""

        let tabs id =
            Div [Class "tabbable tabs-left"] -< [
                UL [Class "nav nav-tabs"] -< [
                    LI [Class "active"] -< [A [HRef "#details"; HTML5.Data "toggle" "tab"] -< [Text "Details"]]
                    LI [A [HRef "#keywords"; HTML5.Data "toggle" "tab"] -< [Text "Keywords"]]
                ]
                Div [Class "tab-content"] -< [
                    new Details.Client.DetailsViewer(id) :> INode<_>
                    Div [Class "tab-pane"; Id "keywords"] -< [] :> _
                ]
            ]
