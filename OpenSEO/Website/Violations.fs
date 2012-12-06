namespace OpenSEO

open IntelliFactory.WebSharper

module Violations =

    module Server =
        
        open Mongo
            
        let violationData (x : Types.Violation) =
            x.Level, x.Heading, x.Line, x.Column, x.Description, x.Recommendation

        [<Rpc>]
        let violationsById id =
            async {
                let violationsOption = Mongo.Violations.violationsById id
                match violationsOption with
                    | None -> return None
                    | Some violations ->
                        return
                            violations
                            |> Array.map violationData
                            |> Some
            }

    module Client =

        open IntelliFactory.WebSharper.Html
        open IntelliFactory.WebSharper.JQuery

        [<JavaScript>]
        let makeDiv txt txt' =
            Div [Attr.Class "row-fluid"] -< [
                Div [Attr.Class "span3"] -< [H4 [Attr.Class "h4"] -< [Text txt]]
                Div [Attr.Class "span9"] -< [P [Text txt']]
            ]

        [<JavaScript>]
        let makeAccordionGroup parent id heading line column description recommendation =
            Div [Attr.Class "accordion-group"] -< [
                Div [Attr.Class "accordion-heading"] -< [
                    A [Attr.Class "accordion-toggle"; HTML5.Attr.Data "toggle" "collapse"; HTML5.Attr.Data "parent" parent; HRef <| "#" + id] -< [
                        Text heading
                    ]
                ]
                Div [Id id; Attr.Class "accordion-body collapse"] -< [
                    Div [Attr.Class "accordion-inner"] -< [
                        makeDiv "Line"           line
                        makeDiv "Column"         column
                        makeDiv "Description"    description
                        makeDiv "Recommendation" recommendation
                    ]
                ]
            ]

        [<JavaScript>]
        let filterLevel arr (level : string) =
            arr |> Array.filter (fun x ->
                let level', _, _, _, _, _ = x
                level' = level)

        [<JavaScript>]
        let updateTabHeader (arr : 'T []) (selector : string) =
            let count = arr.Length.ToString()
            let jquery = JQuery.Of selector
            let text = jquery.Text()
            jquery.Text(String.concat "" [text; " ("; count; ")"]).Ignore 

        [<JavaScript>]
        let displayAccordions id arr accordionId (div : Element) =
            arr
            |> Array.mapi (fun idx x ->
                let id' = id + string idx
                let level, heading, line, column, description, recommendation = x
                makeAccordionGroup accordionId id' heading line column description recommendation)
            |> Array.iter div.Append

        [<JavaScript>]
        let appendParagraph (div : Element) text = div.Append (P [Text text])

        [<JavaScript>]
        let displayViolations violations id level selector accordionId div text =
            let violations' = filterLevel violations level
            updateTabHeader violations' selector
            match violations'.Length with
                | 0 -> appendParagraph div text
                | _ -> displayAccordions id violations' accordionId div

        [<JavaScript>]
        let violationsSection id =
            let div   = Div [Attr.Class "accordion"; Id "errorsAccordion"]
            let div' = Div [Attr.Class "accordion"; Id "warningsAccordion"]
            HTML5.Tags.Section [Attr.Class "tab-pane fade in reportSection"; Id "violations"] -< [
                Div [Attr.Class "tabbable"] -< [
                    UL [Attr.Class "nav nav-pills"] -< [
                        LI [Attr.Class "active"] -< [A [HRef "#errors"; HTML5.Attr.Data "toggle" "tab"; Id "errorsTab"] -< [Text "Errors"]]
                        LI [A [HRef "#warnings"; HTML5.Attr.Data "toggle" "tab"; Id "warningsTab"] -< [Text "Warnings"]]
                    ]
                    Div [Attr.Class "tab-content"] -< [
                        Div [Attr.Class "tab-pane active fade in span8"; Id "errors"] -< [div]
                        Div [Attr.Class "tab-pane fade span8"; Id "warnings"] -< [div']
                    ]
                ]
            ]
            |>! OnAfterRender (fun _ ->
                async {
                    let! violationsOption = Server.violationsById id
                    match violationsOption with
                        | None -> ()
                        | Some violations ->
                            let displayViolations' = displayViolations violations
                            displayViolations' "errorAccordion" "Error" "#errorsTab" "errorsAccordion" div "No errors were detected on the page."
                            displayViolations' "WarningAccordion" "Warning" "#warningsTab" "warningsAccordion" div' "No warnings were detected on the page."
                    Utilities.Client.updateProgressBar ()
                } |> Async.Start)
            
    type ViolationsControl(id) =
            
        inherit Web.Control ()

        [<JavaScript>]
        override __.Body = Client.violationsSection id :> _