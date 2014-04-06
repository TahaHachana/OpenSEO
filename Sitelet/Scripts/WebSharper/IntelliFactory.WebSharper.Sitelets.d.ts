declare module IntelliFactory {
    module WebSharper {
        module Sitelets {
            module Sitelet1 {
                interface Filter<_T1> {
                    VerifyUser: {
                        (x: string): boolean;
                    };
                    LoginRedirect: {
                        (x: _T1): _T1;
                    };
                }
            }
            module Content1 {
                module Template {
                    interface LoadFrequency {
                    }
                }
            }
            module Http {
                interface Method {
                }
                interface Version {
                    Version: number;
                }
                interface Header {
                    name: string;
                    value: string;
                }
                interface Request {
                    Method: __ABBREV.__Http.Method;
                    Uri: any;
                    Headers: __ABBREV.__WebSharper.seq<any>;
                    Post: any;
                    Get: any;
                    Cookies: any;
                    ServerVariables: any;
                    Body: any;
                    Files: __ABBREV.__WebSharper.seq<any>;
                }
                interface Status {
                    SCode: number;
                    SMessage: string;
                }
                interface Response {
                    Status: any;
                    Headers: __ABBREV.__WebSharper.seq<any>;
                    WriteBody: {
                        (x: any): void;
                    };
                }
            }
            module UrlEncoding {
                interface NoFormatError {
                }
                interface Format<_T1> {
                    read: {
                        (x: string): __ABBREV.__WebSharper.OptionProxy<__ABBREV.__WebSharper.ObjectProxy>;
                    };
                    show: {
                        (x: __ABBREV.__WebSharper.ObjectProxy): __ABBREV.__WebSharper.OptionProxy<string>;
                    };
                }
            }
            interface Page {
                Doctype: __ABBREV.__WebSharper.OptionProxy<string>;
                Title: __ABBREV.__WebSharper.OptionProxy<string>;
                Renderer: {
                    (x: __ABBREV.__WebSharper.OptionProxy<string>): {
                        (x: __ABBREV.__WebSharper.OptionProxy<string>): {
                            (x: {
                                (x: any): void;
                            }): {
                                (x: {
                                    (x: any): void;
                                }): {
                                    (x: any): void;
                                };
                            };
                        };
                    };
                };
                Head: __ABBREV.__WebSharper.seq<__ABBREV.__Html.Element<void>>;
                Body: __ABBREV.__WebSharper.seq<__ABBREV.__Html.Element<__ABBREV.__Web.Control>>;
            }
            interface Router<_T1> {
                StaticRoutes: any;
                StaticLinks: any;
                DynamicRoute: {
                    (x: any): __ABBREV.__WebSharper.OptionProxy<_T1>;
                };
                DynamicLink: {
                    (x: _T1): __ABBREV.__WebSharper.OptionProxy<any>;
                };
            }
            interface Context<_T1> {
                ApplicationPath: string;
                Link: {
                    (x: _T1): string;
                };
                Json: any;
                Metadata: any;
                ResolveUrl: {
                    (x: string): string;
                };
                ResourceContext: any;
                Request: any;
                RootFolder: string;
            }
            interface Content<_T1> {
            }
            interface Controller<_T1> {
                Handle: {
                    (x: _T1): __ABBREV.__Sitelets.Content<_T1>;
                };
            }
            interface Sitelet<_T1> {
                Router: any;
                Controller: any;
            }
            interface IWebsite<_T1> {
                get_Actions(): __ABBREV.__List.T<_T1>;
                get_Sitelet(): any;
            }
            interface SinglePageAction {
            }
            interface SinglePageWebsite {
            }
            interface IHostedWebsite<_T1> {
                Build(x0: any): __ABBREV.__Sitelets.IWebsite<_T1>;
            }
            interface HttpHandler {
            }
            interface HttpModule {
            }
            interface Plugin {
            }
        }
    }
}
declare module __ABBREV {
    
    export import __Http = IntelliFactory.WebSharper.Sitelets.Http;
    export import __WebSharper = IntelliFactory.WebSharper;
    export import __Html = IntelliFactory.Html.Html;
    export import __Web = IntelliFactory.WebSharper.Web;
    export import __Sitelets = IntelliFactory.WebSharper.Sitelets;
    export import __List = IntelliFactory.WebSharper.List;
}
