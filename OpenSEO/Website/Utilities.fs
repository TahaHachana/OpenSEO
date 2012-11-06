namespace FSEO

open System.Text.RegularExpressions
open IntelliFactory.WebSharper

module Utilities =

    module Server =

        open IntelliFactory.Html

        let inline makeLi activeLiOption href txt =
            match activeLiOption with
                | None -> LI [A [HRef href] -< [Text txt]]
                | Some activeLi ->
                    if txt = activeLi then
                        LI [Class "active"] -< [A [HRef href] -< [Text txt]]
                    else
                        LI [A [HRef href] -< [Text txt]]

        let makeNavigation (activeLiOption : string option) =
            let makeLi' = makeLi activeLiOption
            Div [Class "navbar navbar-fixed-top"; Id "navigation"] -< [
                Div [Class "navbar-inner"] -< [
                    UL [Class "nav"] -< [
                        makeLi' "/"      "Home"
                        makeLi' "/About" "About"
                    ]
                ]
            ]

    module Client =

        open IntelliFactory.WebSharper.Html

        [<JavaScriptAttribute>]
        let makeList lst =
            UL [
                for x in lst do
                    yield LI [Text x]
            ]

        [<JavaScriptAttribute>]
        let makeLi idx id =
            match idx with
                | 0 -> LI [Attr.Class "active"] -< [A [HRef ("#" + id); HTML5.Attr.Data "toggle" "tab"] -< [Text id]]
                | _ -> LI [A [HRef ("#" + id); HTML5.Attr.Data "toggle" "tab"] -< [Text id]]

        [<JavaScriptAttribute>]
        let makeDiv idx x y =
            match idx with
               | 0 -> Div [Attr.Class "tab-pane active"; Id x] -< [makeList y]
               | _ -> Div [Attr.Class "tab-pane"; Id x] -< [makeList y]

        [<JavaScriptAttribute>]
        let makeTabsDiv (tabsContent : (string * string list) []) =
            let lis =
                tabsContent
                |> Array.map fst
                |> Array.mapi (fun idx x -> makeLi idx x)
//                    match idx with
//                        | 0 -> LI [Attr.Class "active"] -< [A [HRef ("#" + x); HTML5.Attr.Data "toggle" "tab"] -< [Text x]]
//                        | _ -> LI [A [HRef ("#" + x); HTML5.Attr.Data "toggle" "tab"] -< [Text x]])
            let divs =
                tabsContent
                |> Array.mapi (fun idx (x, y) -> makeDiv idx x y)
//                    match idx with
//                        | 0 -> Div [Attr.Class "tab-pane active"; Id x] -< [makeList y]
//                        | _ -> Div [Attr.Class "tab-pane"; Id x] -< [makeList y])
            Div [Attr.Class "tabbable"] -< [
                UL [Attr.Class "nav nav-tabs"] -< lis
                Div [Attr.Class "tab-content"] -< divs
            ]
