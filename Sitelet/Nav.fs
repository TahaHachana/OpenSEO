module Sitelet.Nav

open IntelliFactory.Html
open IntelliFactory.WebSharper.Sitelets

let navToggle =
    Button [
        Attributes.Type "button"
        Class "navbar-toggle"
        HTML5.Data "toggle" "collapse"
        HTML5.Data "target" ".navbar-ex1-collapse"
    ] -< [
        Span [Class "sr-only"] -< [
            Text "Toggle Navigation"
        ]
        Span [Class "icon-bar"]
        Span [Class "icon-bar"]
        Span [Class "icon-bar"]
    ]

let navHeader =
    Div [Class "navbar-header"] -< [
        navToggle
        A [Class "navbar-brand"; HRef "/"] -< [
            Text "OpenSEO"
        ]
    ]

let li activeLiOption href txt =
    let link = A [HRef href] -< [Text txt]
    match activeLiOption with
        | Some activeLi when txt = activeLi ->
            LI [Class "active"] -< [link]
        | _ -> LI [link]

let navDiv activeLi ctx =
    Div [Class "collapse navbar-collapse navbar-ex1-collapse"] -< [
        UL [Class "nav navbar-nav"] -< [
            li activeLi "/" "Home"
            li activeLi "/about" "About"
        ]
    ]

let navElt activeLi ctx : Content.HtmlElement =
    HTML5.Nav [
        Class "navbar navbar-inverse"
        NewAttribute "role" "navigation"
    ] -< [
        Div [Class "container"] -< [
            navHeader
            navDiv activeLi ctx
        ]
    ]