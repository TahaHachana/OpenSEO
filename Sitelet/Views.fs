module Sitelet.Views

open Sitelet.Content
open Sitelet.Model
open Sitelet.Skin

let home =
    withTemplate<Action>
        Templates.home
        "Open Source SEO Tool"
        "Use OpenSEO, the open source SEO tool, to review your website's pages and spot search engine optimization related issues."
        Home.body

let about =
    withTemplate<Action>
        Templates.about
        "OpenSEO"
        "OpenSEO, an open source search engine optimization tool you can use to review your website's pages."
        About.body

let error =
    withTemplate<Action>
        Templates.error
        "Error - Page Not Found"
        ""
        Error.body