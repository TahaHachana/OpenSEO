namespace OpenSEO

open IntelliFactory.WebSharper
open IntelliFactory.Html
open SiteContent
open Model

module View =

    let homeView =
        Skin.withMainTemplate HomeContent.title HomeContent.metaDesc <| fun ctx ->
            [
                HomeContent.navigation
                SharedContent.forkme
                Div [Class "container"] -< [
                    HomeContent.intro :> INode<_>
                    new UrlForm.UrlFormControl () :> _
                    Div [
                        Img [Src "/Images/Loader.gif"; Id "loader"; Class "offset2"]
                    ] :> _
                    HR [] :> _
                    new AddThis.AddThisControl () :> _
                ]
                SharedContent.analyticsScript
            ]

    let aboutView =
        Skin.withMainTemplate AboutContent.title AboutContent.metaDesc <| fun ctx ->
            [
                AboutContent.navigation
                SharedContent.forkme
                Div [Class "container"; Id "about"] -< [
                    AboutContent.description
                ]
                SharedContent.analyticsScript
            ]

    let reportView reportId =
        Skin.withReportTemplate ReportContent.title ReportContent.metaDesc <| fun ctx ->
            [
                ReportContent.navigation
                SharedContent.forkme
                Div [Class "container"; Id "report"] -< [
                    ReportContent.tabs reportId
                    ReportContent.progressBar
                ]
                Script [Src "../Scripts/BootstrapTabs.min.js"]
                Script [Src "../Scripts/BootstrapCollapse.min.js"]
                Script [Src "../Scripts/BootstrapTransitions.min.js"]
                SharedContent.analyticsScript
            ]

    let loginView (redirectAction: option<Action>) =
        Skin.withMainTemplate "Login" "" <| fun ctx ->
            let redirectLink =
                match redirectAction with
                | Some action -> action
                | None        -> Action.Admin
                |> ctx.Link
            [
                Div [Class "container"] -< [
                    SharedContent.loginInfo ctx
                    Div [Id "login"] -< [
                        H1 [Text "Login"]
                        Div [
                            new Login.LoginControl(redirectLink)
                        ]
                    ]
                ]
            ]

    let adminView =
        Skin.withMainTemplate "Admin Page" "" <| fun ctx ->
            [
                Div [Class "container"] -< [
                    SharedContent.loginInfo ctx
                    Div [Id "admin"] -< [
                        Div [new DBCleanup.ButtonControl ()]
                        HR []
                        H4 [Text "Latest Reports"]
                        Div [new LatestReports.LatestReportsControl ()]
                    ]
                ]
            ]