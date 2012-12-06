namespace OpenSEO

open IntelliFactory.WebSharper

module Utilities =

    module Server =

        open IntelliFactory.Html

        let makeLi activeLiOption href txt =
            match activeLiOption with
                | None -> LI [A [HRef href] -< [Text txt]]
                | Some activeLi ->
                    if txt = activeLi then
                        LI [Class "active"] -< [A [HRef href] -< [Text txt]]
                    else
                        LI [A [HRef href] -< [Text txt]]

        let makeNavigation activeLiOption =
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
        open IntelliFactory.WebSharper.JQuery
        open IntelliFactory.WebSharper.Google
        open IntelliFactory.WebSharper.Google.Visualization
        open IntelliFactory.WebSharper.Google.Visualization.Base

        [<JavaScript>]
        let makeUl lis = UL [for x in lis -> LI [Text x]]

        [<JavaScript>]
        let makeLi idx id =
            match idx with
                | 0 -> LI [Attr.Class "active"] -< [A [HRef ("#" + id); HTML5.Attr.Data "toggle" "tab"] -< [Text id]]
                | _ -> LI [A [HRef ("#" + id); HTML5.Attr.Data "toggle" "tab"] -< [Text id]]

        [<JavaScript>]
        let makeDiv idx x y =
            match idx with
               | 0 -> Div [Attr.Class "tab-pane fade active in"; Id x] -< [makeUl y]
               | _ -> Div [Attr.Class "tab-pane fade"; Id x]           -< [makeUl y]

        [<JavaScript>]
        let makeTabsDiv tabsContent =
            let lis =
                tabsContent
                |> Array.map fst
                |> Array.mapi (fun idx x -> makeLi idx x)
            let divs =
                tabsContent
                |> Array.mapi (fun idx (x, y) -> makeDiv idx x y)
            Div [Attr.Class "tabbable"] -< [
                UL [Attr.Class "nav nav-pills"] -< lis
                Div [Attr.Class "tab-content"] -< divs
            ]

        [<JavaScript>]
        let updateProgressBar () =
            let progressBarJquery = JQuery.Of "#progressBar"
            let dataWidth = progressBarJquery.Data("width").ToString() |> int
            match dataWidth with
                | 80 ->
                    progressBarJquery.Css("width", "100%").Ignore
                    JQuery.Of("#progressDiv").FadeOut(3000.).Ignore
                | _ ->
                    let width = dataWidth + 20
                    let width' = width |> string |> fun x -> x + "%"
                    progressBarJquery.Data("width", width).Ignore
                    progressBarJquery.Css("width", width').Ignore

        [<JavaScript>]
        let hRule () = Hr [Attr.Class "span6 hrule"]

        [<JavaScript>]
        let makeDataTable column column' (rows : ('T * 'U) list) =
            let dataTable = DataTable()
            dataTable.addColumn(ColumnType.StringType, column) |> ignore
            dataTable.addColumn(ColumnType.NumberType, column') |> ignore
            dataTable.addRows rows.Length |> ignore
            rows |> List.iteri (fun idx (x, y) ->
                dataTable.setCell(idx, 0, x)
                dataTable.setCell(idx, 1, y))
            dataTable

        [<JavaScript>]
        let drawPie dataTable =
            Div []
            |>! OnAfterRender (fun x ->
                let pie = Visualizations.PieChart(x.Dom)
                let options =
                    {
                        Visualizations.PieChartOptions.Default with
                            height = 600.
                            width  = 600.
                    }
                pie.draw(dataTable, options))