declare module Sitelet {
    module Site {
        interface Website {
        }
    }
    module Review {
        interface ReviewResult {
        }
        interface Review {
            Details: any;
            Keywords: __ABBREV.__List.T<any>;
            Hyperlinks: __ABBREV.__List.T<any>;
            Errors: __ABBREV.__List.T<any>;
            Warnings: __ABBREV.__List.T<any>;
            Headers: __ABBREV.__List.T<any>;
            Speed: __ABBREV.__WebSharper.OptionProxy<any>;
        }
        interface Hyperlink {
            UriString: string;
            Anchor: string;
            Type: string;
            Rel: string;
        }
        interface Control {
            get_Body(): __ABBREV.__Html.IPagelet;
        }
    }
    module Details {
        interface UriDetails {
            RequestUri: string;
            ResponseTime: number;
            IsHtml: boolean;
            TextHtmlRatio: number;
            Title: __ABBREV.__WebSharper.OptionProxy<string>;
            MetaDescription: __ABBREV.__WebSharper.OptionProxy<string>;
            Headings: __ABBREV.__List.T<any>;
        }
    }
    module Model {
        interface Action {
        }
    }
    module Skin {
        interface Page {
            Title: string;
            MetaDescription: string;
            Body: __ABBREV.__Html1.Element<__ABBREV.__Web.Control>;
        }
    }
}
declare module __ABBREV {
    
    export import __List = IntelliFactory.WebSharper.List;
    export import __WebSharper = IntelliFactory.WebSharper;
    export import __Html = IntelliFactory.WebSharper.Html;
    export import __Html1 = IntelliFactory.Html.Html;
    export import __Web = IntelliFactory.WebSharper.Web;
}
