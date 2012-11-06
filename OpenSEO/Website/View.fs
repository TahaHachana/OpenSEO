namespace FSEO

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
                ]
            ]

    let aboutView =
        Skin.withTemplate AboutContent.title AboutContent.metaDesc <| fun ctx ->
            [
                AboutContent.navigation
                SharedContent.forkme
                Div [Class "container"] -< [
                    AboutContent.description
                ]
            ]

    let reportView reportId =
        Skin.withTemplate ReportContent.title ReportContent.metaDesc <| fun ctx ->
            [
                ReportContent.navigation
                SharedContent.forkme
                Div [Class "container"] -< [
                    ReportContent.tabs reportId
                ]
                Script [Src "http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.8.2.min.js"]
                Script [Src "../Scripts/BootstrapTabs.min.js"]
            ]