namespace OpenSEO

open IntelliFactory.WebSharper

module Validator =

    module Server =
        
        open SEOLib

        type ValidationResult =
            {
                Doctype      : string
                Charset      : string
                Status       : string
                ErrorCount   : string
                WarningCount : string
                Errors       : (string * string * string) list
                Warnings     : (string * string * string) list
            }

        let markupErrorsData markupErrors =
            markupErrors
            |> function
                | None -> []
                | Some lst ->
                    lst |> List.map (fun x ->
                        let line = x.Line |> function None -> "NA" | Some x -> x
                        let col = x.Col |> function None -> "NA" | Some x -> x
                        line, col, x.Message)

        let markupErrorsCount (markupErrors : MarkupError list option) =
            markupErrors
            |> function
                | None -> "0"
                | Some lst -> lst.Length |> string

        [<Rpc>]
        let validate uriString =
            async {
                let markupValidationOption = Validator.validateUri uriString
                match markupValidationOption with
                    | None -> return None
                    | Some markupValidation ->
                        let status = markupValidation.Status |> function Invalid -> "Invalid" | _ -> "Valid"
                        let errors = markupErrorsData markupValidation.Errors
                        let warnings = markupErrorsData markupValidation.Warnings
                        return
                            {
                                Doctype      = markupValidation.Doctype
                                Charset      = markupValidation.Charset
                                Status       = status
                                ErrorCount   = markupErrorsCount markupValidation.Errors
                                WarningCount = markupErrorsCount markupValidation.Warnings
                                Errors       = errors
                                Warnings     = warnings
                            } |> Some
            }

    module Client =
        
        open IntelliFactory.WebSharper.Html
        open IntelliFactory.WebSharper.JQuery

        [<JavaScript>]
        let makeDiv txt id =
            Div [Attr.Class "row-fluid"] -< [
                Div [Attr.Class "span3"] -< [H4 [Attr.Class "h4"] -< [Text txt]]
                Div [Attr.Class "span9"] -< [P [Id id]]
            ]

        [<JavaScript>]
        let makeDiv' txt txt' =
            Div [Attr.Class "row-fluid"] -< [
                Div [Attr.Class "span3"] -< [H4 [Attr.Class "h4"] -< [Text txt]]
                Div [Attr.Class "span9"] -< [P [Text txt']]
            ]

        [<JavaScript>]
        let setPText (selector : string) txt = JQuery.Of(selector).Text(txt).Ignore

        [<JavaScript>]
        let makeAccordionGroup parent id message line column =
            Div [Attr.Class "accordion-group"] -< [
                Div [Attr.Class "accordion-heading"] -< [
                    A [Attr.Class "accordion-toggle"; HTML5.Attr.Data "toggle" "collapse"; HTML5.Attr.Data "parent" parent; HRef <| "#" + id] -< [
                        Text message
                    ]
                ]
                Div [Id id; Attr.Class "accordion-body collapse"] -< [
                    Div [Attr.Class "accordion-inner"] -< [
                        makeDiv'  "Line"        line
                        makeDiv'  "Column"      column
                    ]
                ]
            ]

        [<JavaScript>]
        let updateTabHeader count (selector : string) =
            let jquery = JQuery.Of selector
            let text = jquery.Text()
            jquery.Text(String.concat "" [text; " ("; count; ")"]).Ignore 

        [<JavaScript>]
        let displayAccordions id lst accordionId (div : Element) =
            lst
            |> List.mapi (fun idx x ->
                let id' = id + string idx
                let line, column, message = x
                makeAccordionGroup accordionId id' message line column)
            |> List.iter div.Append

        [<JavaScript>]
        let displayMarkupErrors count id lst selector accordionId div =
            updateTabHeader count selector
            displayAccordions id lst accordionId div

        [<JavaScript>]
        let displayMarkupValidation uriString div div' =
            async {
                let! validationResultOption = Server.validate uriString
                match validationResultOption with
                    | None -> ()
                    | Some validationResult ->
                        let doctype = validationResult.Doctype
                        let charset = validationResult.Charset
                        let validity = validationResult.Status
                        setPText "#doctype" doctype
                        setPText "#charset" charset
                        setPText "#validity" validity
                        displayMarkupErrors validationResult.ErrorCount "htmlErrorAccordion" validationResult.Errors "#htmlErrorsTab" "htmlErrorsAccordion" div
                        displayMarkupErrors validationResult.WarningCount "htmlWarningAccordion" validationResult.Warnings "#htmlWarningsTab" "htmlWarningsAccordion" div'
            } |> Async.Start

        [<JavaScript>]
        let validatorSection () =
            let input =
                Input [Attr.Type "hidden"; Attr.Value ""; Id "validatorUri"]
            let div   = Div [Attr.Class "accordion"; Id "htmlErrorsAccordion"]
            let div' = Div [Attr.Class "accordion"; Id "htmlWarningsAccordion"]
            HTML5.Tags.Section [Attr.Class "tab-pane fade in reportSection"; Id "validator"] -< [
                input
                makeDiv "Doctype" "doctype"
                Hr []
                makeDiv "Charset" "charset"
                Hr []
                makeDiv "Validity" "validity"
                Hr []
                Div [Attr.Class "tabbable"] -< [
                    UL [Attr.Class "nav nav-pills"] -< [
                        LI [Attr.Class "active"] -< [A [HRef "#htmlErrors"; HTML5.Attr.Data "toggle" "tab"; Id "htmlErrorsTab"] -< [Text "Errors"]]
                        LI [A [HRef "#htmlWarnings"; HTML5.Attr.Data "toggle" "tab"; Id "htmlWarningsTab"] -< [Text "Warnings"]]
                    ]
                    Div [Attr.Class "tab-content"] -< [
                        Div [Attr.Class "tab-pane active fade in span8"; Id "htmlErrors"] -< [div]
                        Div [Attr.Class "tab-pane fade span8"; Id "htmlWarnings"] -< [div']
                    ]
                ]
            ]
            |>! OnAfterRender (fun _ ->
                JQuery.Of("#validatorUri").Change(fun x _ ->
                    let uriString = x.GetAttribute "value"
                    displayMarkupValidation uriString div div').Ignore)
                
    type ValidatorControl () =

        inherit Web.Control ()

        [<JavaScript>]
        override __.Body = Client.validatorSection () :> _