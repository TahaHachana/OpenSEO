namespace OpenSEO

open IntelliFactory.WebSharper.Sitelets
open Model
open View

module Controller =

    let controller =

        let handle = function
            | Home            -> homeView
            | About           -> aboutView
            | Report reportId -> reportView reportId

        { Handle = handle }