module Sitelet.Content

open IntelliFactory.Html
open Sitelet.Nav

module Home =

    let jumbotron =
        Div [
            Class "row"
            Id "jumbotron"
        ] -< [
            Div [Class "jumbotron"] -< [
                Div [Class "container text-center"] -< [
                    H1 [Text "OpenSEO"] :> INode<_>
                    new Review.Control() :> _
                ]
            ]
        ]

    let detailsPanel =
        Div [
            Class "seo-panel"
            Id "details"
        ] -< [
            Div [Class "panel panel-default"] -< [
                Div [Class "panel-heading"] -< [
                    H2 [Class "panel-title"] -< [
                        Text "Details"
                    ]
                ]
                Div [Class "panel-body"] -< [
                    Div [Class "row seo-info"] -< [
                        Div [Class "col-md-3 row-heading"] -< [
                            Text "URL"
                        ]
                        Div [
                            Class "col-md-9"
                            Id "request-uri"
                        ]
                    ]
                    Div [Class "row seo-info"] -< [
                        Div [Class "col-md-3 row-heading"] -< [
                            Text "Response Time"
                        ]
                        Div [
                            Class "col-md-9"
                            Id "response-time"
                        ]
                    ]
                    Div [Class "row seo-info"] -< [
                        Div [Class "col-md-3 row-heading"] -< [
                            Text "Text/HTML Ratio"
                        ]
                        Div [
                            Class "col-md-9"
                            Id "text-html-ratio"
                        ]
                    ]
                    Div [Class "row seo-info"] -< [
                        Div [Class "col-md-3"] -< [
                            Div [Class "row-heading"] -< [
                                Text "Title"
                            ]
                            Small [Id "title-length"]
                        ]
                        Div [
                            Class "col-md-9"
                            Id "title"
                        ]
                    ]
                    Div [Class "row seo-info"] -< [
                        Div [Class "col-md-3"] -< [
                            Div [Class "row-heading"] -< [
                                Text "Meta Description"
                            ]
                            Small [Id "meta-description-length"]
                        ]
                        Div [
                            Class "col-md-9"
                            Id "meta-description"
                        ]
                    ]
                    Div [Class "row seo-info"] -< [
                        Div [Class "col-md-3 row-heading"] -< [
                            Text "Headings"
                        ]
                    ]
                    Div [Class "row"; Id "headings"]
                ]
            ]
        ]

    let keywordsPanel =
        Div [
            Class "seo-panel"
            Id "keywords"
        ] -< [
            Div [Class "panel panel-default"] -< [
                Div [Class "panel-heading"] -< [
                    H2 [Class "panel-title"] -< [
                        Text "Keywords"
                    ]
                ]
                Div [Class "panel-body"] -< [
                    UL [Class "nav nav-tabs"] -< [
                        LI [Class "active"] -< [
                            A [
                                HRef "#keywords-tab-1"
                                HTML5.Data "toggle" "tab"
                            ] -< [Text "One Keyword"]
                        ]
                        LI [
                            A [
                                HRef "#keywords-tab-2"
                                HTML5.Data "toggle" "tab"
                            ] -< [Text "Two Keywords"]
                        ]
                        LI [
                            A [
                                HRef "#keywords-tab-3"
                                HTML5.Data "toggle" "tab"
                            ] -< [Text "Three Keywords"]
                        ]
                    ]
                    Div [Class "tab-content"] -< [
                        Div [
                            Class "tab-pane fade in active keywords-tab"
                            Id "keywords-tab-1"
                        ]
                        Div [
                            Class "tab-pane fade keywords-tab"
                            Id "keywords-tab-2"
                        ]
                        Div [
                            Class "tab-pane fade keywords-tab"
                            Id "keywords-tab-3"
                        ]
                    ]
                ]
            ]
        ]

    let hyperlinksPanel =
        Div [
            Id "hyperlinks"
            Class "seo-panel"
        ] -< [
            Div [Class "panel panel-default"] -< [
                Div [Class "panel-heading"] -< [
                    H2 [Class "panel-title"] -< [
                        Text "Hyperlinks"
                    ]
                ]
                Div [Class "panel-body"] -< [
                    UL [Class "nav nav-tabs"] -< [
                        LI [Class "active"] -< [
                            A [
                                HRef "#internal-links-tab"
                                HTML5.Data "toggle" "tab"
                                Id "internal-links"
                            ] -< [Text "Internal"]
                        ]
                        LI [
                            A [
                                HRef "#external-links-tab"
                                HTML5.Data "toggle" "tab"
                                Id "external-links"
                            ] -< [Text "External"]
                        ]
                        LI [
                            A [
                                HRef "#links-stats-tab"
                                HTML5.Data "toggle" "tab"
                            ] -< [Text "Stats"]
                        ]
                    ]
                    Div [Class "tab-content"] -< [
                        Div [
                            Class "tab-pane fade in active"
                            Id "internal-links-tab"
                        ] -< [
                            Div [
                                Class "table-responsive"
                                Id "internal-links-table"
                            ]
                        ]
                        Div [
                            Class "tab-pane fade"
                            Id "external-links-tab"
                        ] -< [
                            Div [
                                Class "table-responsive"
                                Id "external-links-table"
                            ]
                        ]
                        Div [
                            Class "tab-pane fade"
                            Id "links-stats-tab"
                        ] -< [
                            UL [Class "nav nav-pills"] -< [
                                LI [Class "active"] -< [
                                    A [
                                        HRef "#external-internal-tab"
                                        HTML5.Data "toggle" "tab"
                                    ] -< [Text "External VS Internal"]
                                ]
                                LI [
                                    A [
                                        HRef "#follow-nofollow-tab"
                                        HTML5.Data "toggle" "tab"
                                    ] -< [Text "Follow VS NoFollow"]
                                ]
                            ]
                            Div [Class "tab-content"] -< [
                                Div [
                                    Class "tab-pane fade in active"
                                    Id "external-internal-tab"
                                ] 
                                Div [
                                    Class "tab-pane fade"
                                    Id "follow-nofollow-tab"
                                ] 
                            ]
                            Div [Class "row"] -< [
                                Div [
                                    Class "col-md-6"
                                    Id "type-stats"
                                ]
                                Div [
                                    Class "col-md-6"
                                    Id "rel-stats"
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ]

    let violationsPanel =
        Div [
            Id "violations"
            Class "seo-panel"
        ] -< [
            Div [Class "panel panel-default"] -< [
                Div [Class "panel-heading"] -< [
                    H2 [Class "panel-title"] -< [
                        Text "Violations"
                    ]
                ]
                Div [Class "panel-body"] -< [
                    UL [Class "nav nav-tabs"] -< [
                        LI [Class "active"] -< [
                            A [
                                HRef "#errors-tab"
                                HTML5.Data "toggle" "tab"
                                Id "errors-nav-tab"
                            ] -< [Text "Errors"]
                        ]
                        LI [
                            A [
                                HRef "#warnings-tab"
                                HTML5.Data "toggle" "tab"
                                Id "warnings-nav-tab"
                            ] -< [Text "Warnings"]
                        ]
                    ]
                    Div [Class "tab-content"] -< [
                        Div [
                            Class "tab-pane fade in active"
                            Id "errors-tab"
                        ] -< [
                            Div [
                                Class "panel-group"
                                Id "errors-accordion"
                            ]
                        ]
                        Div [
                            Class "tab-pane fade"
                            Id "warnings-tab"
                        ] -< [
                            Div [
                                Class "panel-group"
                                Id "warnings-accordion"
                            ]
                        ]
                    ]
                ]
            ]
        ]

    let headersPanel =
        Div [
            Id "headers"
            Class "seo-panel"
        ] -< [
            Div [Class "panel panel-default"] -< [
                Div [Class "panel-heading"] -< [
                    H2 [Class "panel-title"] -< [
                        Text "Headers"
                    ]
                ]
                Div [Class "panel-body"] -< [
                    Div [
                        Class "table-responsive"
                        Id "headers-panel-body"
                    ]
                ]
            ]
        ]

    let speedPanel =
        Div [
            Class "seo-panel"
            Id "speed"
        ] -< [
            Div [Class "panel panel-default"] -< [
                Div [Class "panel-heading"] -< [
                    H2 [Class "panel-title"] -< [
                        Text "Speed"
                    ]
                ]
                Div [Class "panel-body"] -< [
                    Div [Class "row seo-info"] -< [
                        Div [Class "col-md-3 row-heading"] -< [
                            Text "Score"
                        ]
                        Div [Class "col-md-9"] -< [
                            HTML5.Mark [Id "speed-score"]
                        ]
                    ]
                    UL [Class "nav nav-tabs"] -< [
                        LI [Class "active"] -< [
                            A [
                                HRef "#suggestions-tab"
                                HTML5.Data "toggle" "tab"
                                Id "suggestions-nav-tab"
                            ] -< [Text "Suggestions"]
                        ]
                        LI [
                            A [
                                HRef "#resources-tab"
                                HTML5.Data "toggle" "tab"
                                Id "resources-nav-tab"
                            ] -< [Text "Resources Breakdown"]
                        ]
                    ]
                    Div [Class "tab-content"] -< [
                        Div [
                            Class "tab-pane fade in active"
                            Id "suggestions-tab"
                        ] -< [
                            Div [
                                Class "panel-group"
                                Id "suggestions-accordion"
                            ]
                        ]
                        Div [
                            Class "tab-pane fade"
                            Id "resources-tab"
                        ] -< [
                            Div [Class "row seo-info"] -< [
                                Div [Class "col-md-3 row-heading"] -< [
                                    Text "Hosts"
                                ]
                                Div [
                                    Class "col-md-9"
                                    Id "hosts"
                                ]
                            ]
                            Div [Class "row seo-info"] -< [
                                Div [Class "col-md-3 row-heading"] -< [
                                    Text "CSS Resources"
                                ]
                                Div [
                                    Class "col-md-9"
                                    Id "css-resources"
                                ]
                            ]
                            Div [Class "row seo-info"] -< [
                                Div [Class "col-md-3 row-heading"] -< [
                                    Text "JS Resources"
                                ]
                                Div [
                                    Class "col-md-9"
                                    Id "js-resources"
                                ]
                            ]
                            Div [Class "row seo-info"] -< [
                                Div [Class "col-md-3 row-heading"] -< [
                                    Text "Static Resources"
                                ]
                                Div [
                                    Class "col-md-9"
                                    Id "static-resources"
                                ]
                            ]
                            Div [Class "row seo-info"] -< [
                                Div [Class "col-md-3 row-heading"] -< [
                                    Text "Total Resources"
                                ]
                                Div [
                                    Class "col-md-9"
                                    Id "total-resources"
                                ]
                            ]
                            Div [Class "row seo-info"] -< [
                                Div [Class "col-md-3 row-heading"] -< [
                                    Text "Bytes"
                                ]
                            ]
                            Div [Id "bytes-stats"]
                        ]
                    ]
                ]
            ]
        ]

    let affix =
        Div [
            Class "col-md-3"
            Id "affix"
        ] -< [
            HTML5.Nav [
                Class "visible-lg"
                Id "affix-nav"
            ] -< [
                UL [
                    Class "nav nav-pills nav-stacked"
                    HTML5.Data "spy" "affix"
                    HTML5.Data "offset-top" "300"
                ] -< [
                    LI [Class "active"] -< [
                        A [HRef "#details"] -< [Text "Details"]
                    ]
                    LI [
                        A [HRef "#keywords"] -< [Text "Keywords"]
                    ]
                    LI [
                        A [HRef "#hyperlinks"] -< [Text "Hyperlinks"]
                    ]
                    LI [
                        A [HRef "#violations"] -< [Text "Violations"]
                    ]
                    LI [
                        A [HRef "#headers"] -< [Text "Headers"]
                    ]
                    LI [
                        A [HRef "#speed"] -< [Text "Speed"]
                    ]
                ]
            ]
        ]

    let review =
        Div [Id "review"] -< [
            Div [Class "row"] -< [
                Div [
                    Class "thumbnail"
                    Id "screenshot"
                ]                   
                H1 [
                    Class "page-header"
                    HTML5.Data "placement" "bottom"
                    HTML5.Data "toggle" "tooltip"
                    Id "page-header"
                ]
            ]
            Div [Class "row"] -< [
                Div [Class "col-md-9"] -< [
                    detailsPanel
                    keywordsPanel
                    hyperlinksPanel
                    violationsPanel
                    headersPanel
                    speedPanel
                ]
                affix
            ]
        ]

    let body ctx =
        Div [
            navElt (Some "Home") ctx
            Div [Class "container"] -< [
                jumbotron
                review
            ]
            Div [Id "push"]
        ]

module About =
    let body ctx =
        Div [
            navElt (Some "About") ctx
            Div [Class "container"] -< [
                Div [Class "page-header"] -< [
                    H1 [Text "About"]
                ]
                Div [
                    Strong [Text "OpenSEO"]
                    Text " is an open source "
                    Tags.Abbr [Title "Search Engine Optimization"] -< [
                        Text "SEO"
                    ]
                    Text " tool that's built with the "
                    A [
                        HRef "http://www.websharper.com/"
                        Target "_blank"
                    ] -< [Text "WebSharper"]
                    Text " framework and runs on the "
                    A [
                        HRef "https://appharbor.com/"
                        Target "_blank"
                    ] -< [Text "AppHarbor"]
                    Text " cloud. The application's source code is available on "
                    A [
                        HRef "https://github.com/TahaHachana/OpenSEO"
                        Target "_blank"
                    ] -< [Text "GitHub"]
                    Text "."
                ]
            ]
            Div [Id "push"]
        ]

module Error =
    let body ctx =
        Div [
            navElt None ctx
            Div [Class "container"] -< [
                Div [Class "page-header"] -< [
                    H1 [Text "Error"]
                    P [Text "The requested URL doesn't exist."]
                ]
            ]
            Div [Id "push"]
        ]