namespace OpenSEO

open IntelliFactory.Html
open SiteContent
open Model

module View =

    let homeView =
        Skin.withTemplate HomeContent.title HomeContent.metaDesc <| fun ctx ->
            [
                HomeContent.navigation
                SharedContent.forkme
                Div [Class "container"] -< [
                    new UrlForm.Client.FormViewer () :> INode<_>
                    Div [
                        Img [Src "/Images/Loader.gif"; Id "loader"; Class "offset2"]
                    ] :> _
                ]
            ]

    let aboutView =
        Skin.withTemplate AboutContent.title AboutContent.metaDesc <| fun ctx ->
            [
                AboutContent.navigation
                SharedContent.forkme
                Div [Class "container"; Id "about"] -< [
                    AboutContent.description
                ]
            ]

    let reportView reportId =
        Skin.withTemplate ReportContent.title ReportContent.metaDesc <| fun ctx ->
            [
                ReportContent.navigation
                SharedContent.forkme
                Div [Class "container"; Id "report"] -< [
                    ReportContent.tabs reportId
                    ReportContent.progressBar
                ]
                Script [Src "http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.8.2.min.js"]
                Script [Src "../Scripts/BootstrapTabs.min.js"]
                Script [Src "../Scripts/BootstrapTransitions.min.js"]
            ]