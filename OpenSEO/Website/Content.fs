namespace Website

open IntelliFactory.Html
open IntelliFactory.WebSharper.Sitelets
open IntelliFactory.WebSharper.Sitelets.Content
open Utils.Server

module Content =

    module Shared =

        let ga : HtmlElement= Script [Src "../Scripts/GoogleAnalytics.js"]
        
        let nav : HtmlElement = nav None
        
        let footer : HtmlElement =
            HTML5.Footer [Id "footer"] -< [
                Div [Class "container"; Style "padding-top: 20px;"] -< [
                    P [Text "Powered by "] -< [
                        A ["WebSharper" => "http://www.websharper.com/"]
                    ]
                ]            
            ]

    module Home =
        
        let navigation : HtmlElement = nav <| Some "Home"
        
        let title = "Open Source SEO Tool"

        let metaDesc = "Open source SEO (search engine optimization) tool offering HTML auditing, keywords analysis and speed testing functionality."

        let intro : HtmlElement =
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

    module About =
        
        let navigation : HtmlElement = nav <| Some "About"

        let title = "About OpenSEO | Open Source SEO Tool"

        let metaDesc = "Learn more about OpenSEO, an open source SEO tool maintained by Taha Hachana on GitHub."

        let description : HtmlElement =
            P [Text "OpenSEO is an open source SEO tool built with "] -< [
                A [HRef "http://www.websharper.com/"; Target "_blank"] -< [Text "WebSharper"]
                Text " that uses functionality provided by a "
                A [HRef "https://github.com/TahaHachana/SEOLib"; Target "_blank"] -< [Text "SEO library"]
                Text " developed in F#. The code source of the application and the SEO component is maintained by "
                A [HRef "https://github.com/TahaHachana"; Target "_blank"] -< [Text "Taha Hachana"]
                Text " on GitHub."
            ]

    module Report =
        
        let title = "SEO Report"

        let metaDesc = ""

        let progressBar : HtmlElement =
            Div [Style "height: 100px;"] -< [
                Div [Class "progress"; Id "progressDiv"] -< [
                    Div [Class "bar"; Id "progressBar"; HTML5.Data "width" "0"]
                ]
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
                    new Details.Control(id)    :> INode<_>
                    new Keywords.Control(id)   :> _
                    new Links.Control(id)      :> _
                    new Violations.Control(id) :> _
                    new Headers.Control(id)    :> _
                    new Validator.Control()    :> _
                    new Pagespeed.Control()    :> _
                ]
            ]