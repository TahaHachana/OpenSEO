namespace FSEO

#if INTERACTIVE
#r "MongoDB.Bson.dll"
#r "MongoDB.Driver.dll"
#endif

open System
open System.Linq
open System.Net
open MongoDB.Bson
open MongoDB.Driver
open MongoDB.Driver.Builders
open System.Globalization
open SEOLib.HTTP
open SEOLib.Types
open SEOLib

module Mongo =
    
    let culture = CultureInfo.CreateSpecificCulture "en-US"
    CultureInfo.DefaultThreadCurrentCulture <- culture

    module Utilities =

        /// Creates a mongo server instance.
        let createServer (connectionString : string) = MongoServer.Create connectionString

        /// Gets the database with the specified name.
        let databaseByName (server : MongoServer) (name : string) = server.GetDatabase name

        /// Gets the database collection with the specified name.
        let collectionByName<'T> (db : MongoDatabase) (name : string) = db.GetCollection<'T> name

        let server = createServer Secure.mongoConnectionString
        let database = databaseByName server "OpenSEODB"

    [<AutoOpenAttribute>]
    module Types =
        
        [<CLIMutableAttribute>]
        type UriDetails =
            {
                _id         : ObjectId
                RequestUri  : string
                Size : string
                Server : string
                ElapsedTime : string
                Title : string
                Description : string
                TitleLength : string
                DescriptionLength : string
                Headings : string []
            }

    let stringHeading (heading : Heading) =
        match heading with
            | H1 x -> "H1|||" + x
            | H2 x -> "H2|||" + x
            | H3 x -> "H3|||" + x
            | H4 x -> "H4|||" + x
            | H5 x -> "H5|||" + x
            | H6 x -> "H6|||" + x

    let someOrMissing = function None -> "MISSING" | Some x -> x
    let stringLength = function "MISSING" -> "NA" | x -> string x.Length + " characters"
    let serverHeader (headers : Header list) =
        headers
        |> List.tryFind (fun x -> x.Key = "Server")
        |> function
            | None -> ""
            | Some header -> header.Value.Head

    let makeUriDetails (httpData : HttpData) id =
        let requestUri = httpData.RequestUri.ToString()
        let size = httpData.Size |> function None -> "" | Some x -> string x + " KB"
        let server = serverHeader httpData.Headers
        let elapsedTime = httpData.ElapsedTime.ToString() + " milliseconds"
        let htmlOption = httpData.Html
        let html = match htmlOption with None -> "" | Some x -> x
        let title = Html.title html |> someOrMissing
        let titleLength = stringLength title
        let metaTags = Html.metaTags html
        let description = Html.metaDescription metaTags |> someOrMissing
        let descriptionLength = stringLength description
        let headings = Html.headings html |> List.toArray |> Array.map stringHeading
        {
            _id = id
            RequestUri = requestUri
            Size = size
            Server = server
            ElapsedTime = elapsedTime
            Title = title
            TitleLength = titleLength
            Description = description
            DescriptionLength = descriptionLength
            Headings = headings
        }

    let uriDetailsCollection = Utilities.collectionByName<UriDetails> Utilities.database "uridetails"

    let queryable = uriDetailsCollection.FindAll().AsQueryable()
    
    let inline insertHttpData (httpData : HttpData) =
        try
            let id = ObjectId.GenerateNewId()
            uriDetailsCollection.Insert(makeUriDetails httpData id) |> ignore
            Some id
        with _ -> None

    let uriDetailsById id =
        query {
            for x in queryable do
                find (x._id.ToString() = id)
        }