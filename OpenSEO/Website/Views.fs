namespace Website

open IntelliFactory.Html
open Content
open Model
open ExtSharper
open Utils.Server

module Views =

    let private mainTemplate   = Skin.MakeDefaultTemplate "~/Main.html"   Skin.LoadFrequency.Once
    let private reportTemplate = Skin.MakeDefaultTemplate "~/Report.html" Skin.LoadFrequency.Once
    
    let withMainTemplate   = Skin.WithTemplate<Action> mainTemplate
    let withReportTemplate = Skin.WithTemplate<Action> reportTemplate
    
    let loginInfo' = loginInfo Logout Login

    let home =
        withMainTemplate Home.title Home.metaDesc <| fun ctx ->
            [
                Div [Class "wrap"] -< [
                    Home.navigation
                    Div [new ForkMe.Control()]
                    Div [Class "container"] -< [
                        Home.intro :> INode<_>
                        new UrlForm.Control() :> _
                        Div [Img [Src "/Images/Loader.gif"; Id "loader"; Class "offset2"]] :> _
                        HR [] :> _
                        new AddThis.Control() :> _
                    ]
                ]
                Shared.footer
                Shared.ga
            ]

    let about =
        withMainTemplate About.title About.metaDesc <| fun ctx ->
            [
                Div [Class "wrap"] -< [
                    About.navigation
                    Div [new ForkMe.Control()]
                    Div [Class "container"; Id "about"] -< [
                        About.description
                    ]
                ]
                Shared.footer
                Shared.ga
            ]

    let report reportId =
        withReportTemplate Report.title Report.metaDesc <| fun ctx ->
            [
                Div [Class "wrap"] -< [
                    Shared.nav
                    Div [new ForkMe.Control()]
                    Div [Class "container"; Id "report"] -< [
                        Report.tabs reportId
                        Report.progressBar
                    ]
                ]
                Shared.footer
                Script [Src "../Scripts/BootstrapTabs.min.js"]
                Script [Src "../Scripts/BootstrapCollapse.min.js"]
                Script [Src "../Scripts/BootstrapTransitions.min.js"]
                Shared.ga
            ]

    let login (a : option<Action>) =
        withMainTemplate "Login" "" <| fun ctx ->
            let link =
                match a with
                | Some action -> action
                | None        -> Action.Admin
                |> ctx.Link
            [
                Div [Class "wrap"] -< [
                    Shared.nav
                    Div [Class "container"] -< [
                        Div [Id "login"] -< [new Login.Control(link)]
                    ]
                ]
                Shared.footer
            ]

    let admin =
        withMainTemplate "Admin Page" "" <| fun ctx ->
            [
                Div [Class "wrap"] -< [
                    Shared.nav
                    Div [Class "container"] -< [
                        loginInfo' ctx
                        Div [Id "admin"] -< [
                            Div [new DBCleanup.Control()]
                            HR []
                            H4 [Text "Latest Reports"]
                            Div [new LatestReports.Control()]
                        ]
                    ]
                ]
                Shared.footer
            ]

    let error =
        withMainTemplate "URL Not Found" "" <| fun ctx ->
            [
                Div [Class "wrap"] -< [
                    Shared.nav
                    Div [Class "container"; Style "margin-top: 200px;"] -< [
                        P [Text "The requested URL doesn't exist, "] -< [
                            A [HRef "/"] -< [Text "click here"]
                            Text " to navigate to the home page."
                        ]
                    ]
                ]
                Shared.footer
            ]