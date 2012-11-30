namespace OpenSEO

#if INTERACTIVE
#r "MongoDB.Bson.dll"
#r "MongoDB.Driver.dll"
#endif

open System
open System.Globalization
open System.Linq
open MongoDB.Bson
open MongoDB.Driver
open MongoDB.Driver.Builders
open SEOLib

module Mongo =
    
    let culture = CultureInfo.CreateSpecificCulture "en-US"
    CultureInfo.DefaultThreadCurrentCulture <- culture

    module Utilities =

        /// Creates a mongo server instance.
        let createServer (connectionString : string) = MongoServer.Create connectionString

        /// Gets the database with the specified name.
        let databaseByName (mongoServer : MongoServer) (name : string) = mongoServer.GetDatabase name

        /// Gets the database collection with the specified name.
        let collectionByName<'T> (db : MongoDatabase) (name : string) = db.GetCollection<'T> name

        let makeLtQuery datetime = Query.LT("InsertDate", BsonValue.Create datetime)

        let server = createServer Secure.mongoConnectionString
        let database = databaseByName server "OpenSEODB"

    module Types =
        
        [<CLIMutableAttribute>]
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

        [<CLIMutableAttribute>]
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

        [<CLIMutableAttribute>]
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

        [<CLIMutableAttribute>]
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

        [<CLIMutableAttribute>]
        type HttpHeader =
            {
                _id      : ObjectId
                ObjectId : string
                Key      : string
                Value    : string
            }
    
    open Types

    module Details =

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
    
        let makeUriDetails (httpData : HttpData) id =
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

        let uriDetailsCollection =
            Utilities.collectionByName<UriDetails> Utilities.database "uridetails"
        
        let cleanCollection datetime =
            try
                let query = Utilities.makeLtQuery datetime
                uriDetailsCollection.Remove query |> ignore
            with _ -> ()

        let queryable = uriDetailsCollection.FindAll().AsQueryable()
    
        let insertUriDetails (httpData : HttpData) =
            try
                let id = ObjectId.GenerateNewId()
                let uriDetails = makeUriDetails httpData id
                uriDetailsCollection.Insert uriDetails |> ignore
                Some id
            with _ -> None

        let uriDetailsById id =
            try
                let id' = ObjectId.Parse id
                query {
                    for x in queryable do
                        find (x._id = id')
                } |> Some
            with _ -> None
        
        let latestReports () =
            try
                query {
                    for x in queryable do
                        sortByDescending x.InsertDate
                        take 10
                } |> Seq.toArray
            with _ -> [||]

    [<AutoOpenAttribute>]
    module Keywords =

        let makeKeyword objectId wordsCount combination occurrence density =
            {
                _id         = ObjectId.GenerateNewId()
                ObjectId    = objectId
                WordsCount  = wordsCount
                Combination = combination
                Occurrence  = occurrence
                Density     = density
                InsertDate  = DateTime.Now
            }

        let keywordsCollection =
            Utilities.collectionByName<Keyword> Utilities.database "keywords"

        let cleanCollection datetime =
            try
                let query = Utilities.makeLtQuery datetime
                keywordsCollection.Remove query |> ignore
            with _ -> ()

        let queryable = keywordsCollection.FindAll().AsQueryable()
    
        let  insertKeywords keywords =
            try
                keywordsCollection.InsertBatch keywords |> ignore
            with _ -> ()

        let keywordsById id =
            try
                query {
                    for x in queryable do
                        where (x.ObjectId = id)
                        select x
                }
                |> Seq.toArray
                |> Some
            with _ -> None

    [<AutoOpenAttribute>]
    module Links =
        
        let makeLink objectId url anchor linkType follow =
            {
                _id        = ObjectId.GenerateNewId()
                ObjectId   = objectId
                URL        = url
                Anchor     = anchor
                Type       = linkType
                Follow     = follow
                InsertDate = DateTime.Now
            }

        let linksCollection = Utilities.collectionByName<Link> Utilities.database "links"

        let cleanCollection datetime =
            try
                let query = Utilities.makeLtQuery datetime
                linksCollection.Remove query |> ignore
            with _ -> ()
             
        let queryable = linksCollection.FindAll().AsQueryable()
    
        let  insertLinks links =
            try
                linksCollection.InsertBatch links |> ignore
            with _ -> ()

        let linksById id =
            try
                query {
                    for x in queryable do
                        where (x.ObjectId = id)
                        select x
                }
                |> Seq.toArray
                |> Some
            with _ -> None

    [<AutoOpenAttribute>]
    module Violations =

        let makeViolation objectId category code column description heading level line recommendation =
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

        let violationsCollection =
            Utilities.collectionByName<Violation> Utilities.database "violations"

        let cleanCollection datetime =
            try
                let query = Utilities.makeLtQuery datetime
                violationsCollection.Remove query |> ignore
            with _ -> ()
             
        let queryable = violationsCollection.FindAll().AsQueryable()
    
        let  insertViolations violations =
            try
                violationsCollection.InsertBatch violations |> ignore
            with _ -> ()

        let violationsById id =
            try
                query {
                    for x in queryable do
                        where (x.ObjectId = id)
                        select x
                }
                |> Seq.toArray
                |> Some
            with _ -> None

    [<AutoOpenAttribute>]
    module Headers =
        
        let makeHttpHeader objectId key value =
            {
                _id      = ObjectId.GenerateNewId()
                ObjectId = objectId
                Key      = key
                Value    = value
            }

        let headersCollection =
            Utilities.collectionByName<HttpHeader> Utilities.database "httpheaders"

        let cleanCollection datetime =
            try
                let query = Utilities.makeLtQuery datetime
                headersCollection.Remove query |> ignore
            with _ -> ()
             
        let queryable = headersCollection.FindAll().AsQueryable()
    
        let  insertHeaders headers =
            try
                headersCollection.InsertBatch headers |> ignore
            with _ -> ()

        let headersById id =
            try
                query {
                    for x in queryable do
                        where (x.ObjectId = id)
                        select x
                }
                |> Seq.toArray
                |> Some
            with _ -> None