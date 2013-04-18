namespace Website

open System
open System.Globalization
open System.Linq
open MongoDB.Bson
open MongoDB.Driver
open MongoDB.Driver.Builders
open SEOLib
open SEOLib.Types

module Mongo =
    
    let culture = CultureInfo.CreateSpecificCulture "en-US"
    CultureInfo.DefaultThreadCurrentCulture <- culture

    [<AutoOpen>]
    module Utils =

        let mongoClient (connectionString: string) = MongoClient connectionString
        
        let database (server : MongoServer) (name : string) = server.GetDatabase name
        
        let collection<'T> (db : MongoDatabase) (name : string) = db.GetCollection<'T> name

        let makeLtQuery datetime = Query.LT("InsertDate", BsonValue.Create datetime)

        let emptyCollection datetime (collection : MongoCollection<'T>) =
            try
                let query = makeLtQuery datetime
                collection.Remove query |> ignore
            with _ -> do ()

        let stringHeading (heading : Heading) =
            match heading with
                | H1 x -> "H1|||" + x
                | H2 x -> "H2|||" + x
                | H3 x -> "H3|||" + x
                | H4 x -> "H4|||" + x
                | H5 x -> "H5|||" + x
                | H6 x -> "H6|||" + x

        let someOrMissing = function
            | None   -> "MISSING"
            | Some x -> x

    let client = mongoClient Secure.connectionString
    let server = client.GetServer()
    let db = database server "OpenSEODB"

    [<AutoOpen>]
    module RecordTypes =
        
        [<CLIMutable>]
        type UriDetails =
            {
                _id         : ObjectId
                Description : string
                ElapsedTime : string
                Headings    : string []
                InsertDate  : DateTime
                RequestUri  : string
                TextRatio   : float
                Title       : string
            }

            static member Make (httpData : HttpData) id =
                let requestUri = httpData.RequestUri.ToString()
                let elapsedTime = httpData.ElapsedTime.ToString()
                let htmlOption = httpData.Html
                let html = match htmlOption with None -> "" | Some x -> x
                let textRatio = Html.textHtmlRatio html
                let title = Html.title html |> someOrMissing
                let metaTags = Html.metaTags html
                let description = Html.metaDescription metaTags |> someOrMissing
                let headings = Html.headings html |> List.toArray |> Array.map stringHeading
                {
                    _id         = id
                    Description = description
                    ElapsedTime = elapsedTime
                    Headings    = headings
                    InsertDate  = DateTime.Now
                    RequestUri  = requestUri
                    TextRatio   = textRatio
                    Title       = title
                }

        [<CLIMutable>]
        type Keyword =
            {
                _id         : ObjectId
                ObjectId    : string
                WordsCount  : int
                Combination : string
                Occurrence  : int
                Density     : float
                InsertDate  : DateTime
            }

            static member Make objectId wordsCount combination occurrence density =
                {
                    _id         = ObjectId.GenerateNewId()
                    ObjectId    = objectId
                    WordsCount  = wordsCount
                    Combination = combination
                    Occurrence  = occurrence
                    Density     = density
                    InsertDate  = DateTime.Now
                }


        [<CLIMutable>]
        type Link =
            {
                _id        : ObjectId
                ObjectId   : string
                URL        : string
                Anchor     : string
                Type       : string
                Follow     : string
                InsertDate : DateTime
            }
            
            static member Make objectId url anchor linkType follow =
                {
                    _id        = ObjectId.GenerateNewId()
                    ObjectId   = objectId
                    URL        = url
                    Anchor     = anchor
                    Type       = linkType
                    Follow     = follow
                    InsertDate = DateTime.Now
                }


        [<CLIMutable>]
        type Violation =
            {
                _id            : ObjectId
                ObjectId       : string
                Category       : string
                Code           : string
                Column         : string
                Description    : string
                Heading        : string
                Level          : string
                Line           : string
                Recommendation : string
                InsertDate     : DateTime
            }

            static member Make objectId category code column description heading level line recommendation =
                {
                    _id            = ObjectId.GenerateNewId()
                    ObjectId       = objectId
                    Category       = category
                    Code           = code
                    Column         = column
                    Description    = description
                    Heading        = heading
                    Level          = level
                    Line           = line
                    Recommendation = recommendation
                    InsertDate     = DateTime.Now
                }

        [<CLIMutable>]
        type HttpHeader =
            {
                _id        : ObjectId
                ObjectId   : string
                Key        : string
                Value      : string
                InsertDate : DateTime
            }

            static member Make objectId key value =
                {
                    _id        = ObjectId.GenerateNewId()
                    ObjectId   = objectId
                    Key        = key
                    Value      = value
                    InsertDate = DateTime.Now
                }

    [<AutoOpen>]
    module Collections =

        let uriDetails  = collection<UriDetails> db "uridetails"    
        let keywords    = collection<Keyword>    db "keywords"
        let links       = collection<Link>       db "links"
        let violations  = collection<Violation>  db "violations"
        let httpHeaders = collection<HttpHeader> db "httpheaders"
    
    [<AutoOpen>]    
    module Queryable =
        
        let asQueryable (collection : MongoCollection<_>) = collection.FindAll().AsQueryable()
        
        let udq = asQueryable uriDetails
        let kq  = asQueryable keywords
        let lq  = asQueryable links
        let vq  = asQueryable violations
        let hhq = asQueryable httpHeaders

    module Details =
    
        let insert (httpData : HttpData) =
            try
                let id = ObjectId.GenerateNewId()
                let records = UriDetails.Make httpData id
                uriDetails.Insert records |> ignore
                Some id
            with _ -> None

        let byId id =
            try
                let id' = ObjectId.Parse id
                query {
                    for x in udq do
                        find (x._id = id')
                } |> Some
            with _ -> None
        
        let latest() =
            try
                query {
                    for x in udq do
                        sortByDescending x.InsertDate
                        take 10
                } |> Seq.toArray
            with _ -> [||]

    module Keywords =

        let  insert records =
            try  keywords.InsertBatch records |> ignore
            with _ -> do ()

        let byId id =
            try
                query {
                    for x in kq do
                        where (x.ObjectId = id)
                        select x
                }
                |> Seq.toArray
                |> Some
            with _ -> None

    module Links =

        let  insert records =
            try  links.InsertBatch records |> ignore
            with _ -> do ()

        let byId id =
            try
                query {
                    for x in lq do
                        where (x.ObjectId = id)
                        select x
                }
                |> Seq.toArray
                |> Some
            with _ -> None

    module Violations =
 
        let  insert records =
            try  violations.InsertBatch records |> ignore
            with _ -> do ()

        let byId id =
            try
                query {
                    for x in vq do
                        where (x.ObjectId = id)
                        select x
                }
                |> Seq.toArray
                |> Some
            with _ -> None

    module Headers =
            
        let  insert records =
            try  httpHeaders.InsertBatch records |> ignore
            with _ -> do ()

        let byId id =
            try
                query {
                    for x in hhq do
                        where (x.ObjectId = id)
                        select x
                }
                |> Seq.toArray
                |> Some
            with _ -> None