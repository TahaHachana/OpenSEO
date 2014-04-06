declare module IntelliFactory {
    module WebSharper {
        module Html {
            module Element {
                var New : {
                    (html: __ABBREV.__Interfaces.IHtmlProvider, name: string): __ABBREV.__Html.Element;
                };
            }
            module Interfaces {
                interface IHtmlProvider {
                    CreateTextNode(x0: string): __ABBREV.__Dom.Text;
                    CreateElement(x0: string): __ABBREV.__Dom.Element;
                    SetAttribute(x0: __ABBREV.__Dom.Node, x1: string, x2: string): void;
                    AppendAttribute(x0: __ABBREV.__Dom.Node, x1: __ABBREV.__Dom.Attr): void;
                    RemoveAttribute(x0: __ABBREV.__Dom.Node, x1: string): void;
                    GetAttribute(x0: __ABBREV.__Dom.Node, x1: string): string;
                    HasAttribute(x0: __ABBREV.__Dom.Node, x1: string): boolean;
                    CreateAttribute(x0: string): __ABBREV.__Dom.Attr;
                    GetProperty<_M1>(x0: __ABBREV.__Dom.Node, x1: string): _M1;
                    SetProperty<_M1>(x0: __ABBREV.__Dom.Node, x1: string, x2: _M1): void;
                    AppendNode(x0: __ABBREV.__Dom.Node, x1: __ABBREV.__Dom.Node): void;
                    Clear(x0: __ABBREV.__Dom.Node): void;
                    Remove(x0: __ABBREV.__Dom.Node): void;
                    SetText(x0: __ABBREV.__Dom.Node, x1: string): void;
                    GetText(x0: __ABBREV.__Dom.Node): string;
                    SetHtml(x0: __ABBREV.__Dom.Node, x1: string): void;
                    GetHtml(x0: __ABBREV.__Dom.Node): string;
                    SetValue(x0: __ABBREV.__Dom.Node, x1: string): void;
                    GetValue(x0: __ABBREV.__Dom.Node): string;
                    SetStyle(x0: __ABBREV.__Dom.Node, x1: string): void;
                    SetCss(x0: __ABBREV.__Dom.Node, x1: string, x2: string): void;
                    AddClass(x0: __ABBREV.__Dom.Node, x1: string): void;
                    RemoveClass(x0: __ABBREV.__Dom.Node, x1: string): void;
                    OnLoad(x0: __ABBREV.__Dom.Node, x1: {
                        (): void;
                    }): void;
                    OnDocumentReady(x0: {
                        (): void;
                    }): void;
                }
            }
            module Activator {
                interface IControl {
                    get_Body(): __ABBREV.__Html.IPagelet;
                }
                var Activate : {
                    (): void;
                };
            }
            module EventsPervasives {
                var Events : {
                    (): __ABBREV.__Events.IEventSupport;
                };
            }
            module Events {
                interface IEventSupport {
                    OnClick<_M1>(x0: {
                        (x: _M1): {
                            (x: any): void;
                        };
                    }, x1: _M1): void;
                    OnDoubleClick<_M1>(x0: {
                        (x: _M1): {
                            (x: any): void;
                        };
                    }, x1: _M1): void;
                    OnMouseDown<_M1>(x0: {
                        (x: _M1): {
                            (x: any): void;
                        };
                    }, x1: _M1): void;
                    OnMouseEnter<_M1>(x0: {
                        (x: _M1): {
                            (x: any): void;
                        };
                    }, x1: _M1): void;
                    OnMouseLeave<_M1>(x0: {
                        (x: _M1): {
                            (x: any): void;
                        };
                    }, x1: _M1): void;
                    OnMouseMove<_M1>(x0: {
                        (x: _M1): {
                            (x: any): void;
                        };
                    }, x1: _M1): void;
                    OnMouseOut<_M1>(x0: {
                        (x: _M1): {
                            (x: any): void;
                        };
                    }, x1: _M1): void;
                    OnMouseUp<_M1>(x0: {
                        (x: _M1): {
                            (x: any): void;
                        };
                    }, x1: _M1): void;
                    OnKeyDown<_M1>(x0: {
                        (x: _M1): {
                            (x: any): void;
                        };
                    }, x1: _M1): void;
                    OnKeyPress<_M1>(x0: {
                        (x: _M1): {
                            (x: any): void;
                        };
                    }, x1: _M1): void;
                    OnKeyUp<_M1>(x0: {
                        (x: _M1): {
                            (x: any): void;
                        };
                    }, x1: _M1): void;
                    OnBlur<_M1>(x0: {
                        (x: _M1): void;
                    }, x1: _M1): void;
                    OnChange<_M1>(x0: {
                        (x: _M1): void;
                    }, x1: _M1): void;
                    OnFocus<_M1>(x0: {
                        (x: _M1): void;
                    }, x1: _M1): void;
                    OnError<_M1>(x0: {
                        (x: _M1): void;
                    }, x1: _M1): void;
                    OnLoad<_M1>(x0: {
                        (x: _M1): void;
                    }, x1: _M1): void;
                    OnUnLoad<_M1>(x0: {
                        (x: _M1): void;
                    }, x1: _M1): void;
                    OnResize<_M1>(x0: {
                        (x: _M1): void;
                    }, x1: _M1): void;
                    OnScroll<_M1>(x0: {
                        (x: _M1): void;
                    }, x1: _M1): void;
                    OnSelect<_M1>(x0: {
                        (x: _M1): void;
                    }, x1: _M1): void;
                    OnSubmit<_M1>(x0: {
                        (x: _M1): void;
                    }, x1: _M1): void;
                }
                interface MouseEvent {
                    X: number;
                    Y: number;
                }
                interface CharacterCode {
                    CharacterCode: number;
                }
                interface KeyCode {
                    KeyCode: number;
                }
            }
            module Default {
                module HTML5 {
                    var Tags : {
                        (): __ABBREV.__Html.Html5TagBuilder;
                    };
                    var Attr : {
                        (): __ABBREV.__Html.Html5AttributeBuilder;
                    };
                }
                var OnLoad : {
                    (init: {
                        (): void;
                    }): void;
                };
                var Text : {
                    (x: string): __ABBREV.__Html.IPagelet;
                };
                var A : {
                    <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
                };
                var B : {
                    <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
                };
                var Body : {
                    <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
                };
                var Br : {
                    <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
                };
                var Button : {
                    <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
                };
                var Code : {
                    <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
                };
                var Div : {
                    <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
                };
                var Em : {
                    <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
                };
                var Form : {
                    <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
                };
                var H1 : {
                    <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
                };
                var H2 : {
                    <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
                };
                var H3 : {
                    <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
                };
                var H4 : {
                    <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
                };
                var Head : {
                    <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
                };
                var Hr : {
                    <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
                };
                var I : {
                    <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
                };
                var IFrame : {
                    <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
                };
                var Img : {
                    <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
                };
                var Input : {
                    <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
                };
                var LI : {
                    <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
                };
                var OL : {
                    <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
                };
                var P : {
                    <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
                };
                var Pre : {
                    <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
                };
                var Script : {
                    <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
                };
                var Select : {
                    <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
                };
                var Span : {
                    <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
                };
                var Table : {
                    <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
                };
                var TBody : {
                    <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
                };
                var TD : {
                    <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
                };
                var TextArea : {
                    <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
                };
                var TFoot : {
                    <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
                };
                var TH : {
                    <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
                };
                var THead : {
                    <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
                };
                var TR : {
                    <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
                };
                var UL : {
                    <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
                };
                var NewAttr : {
                    (x: string): {
                        (x: string): __ABBREV.__Html.IPagelet;
                    };
                };
                var Action : {
                    (x: string): __ABBREV.__Html.IPagelet;
                };
                var Align : {
                    (x: string): __ABBREV.__Html.IPagelet;
                };
                var Alt : {
                    (x: string): __ABBREV.__Html.IPagelet;
                };
                var HRef : {
                    (x: string): __ABBREV.__Html.IPagelet;
                };
                var Height : {
                    (x: string): __ABBREV.__Html.IPagelet;
                };
                var Id : {
                    (x: string): __ABBREV.__Html.IPagelet;
                };
                var Name : {
                    (x: string): __ABBREV.__Html.IPagelet;
                };
                var RowSpan : {
                    (x: string): __ABBREV.__Html.IPagelet;
                };
                var Selected : {
                    (x: string): __ABBREV.__Html.IPagelet;
                };
                var Src : {
                    (x: string): __ABBREV.__Html.IPagelet;
                };
                var VAlign : {
                    (x: string): __ABBREV.__Html.IPagelet;
                };
                var Width : {
                    (x: string): __ABBREV.__Html.IPagelet;
                };
                var Tags : {
                    (): __ABBREV.__Html.TagBuilder;
                };
                var Deprecated : {
                    (): __ABBREV.__Html.DeprecatedTagBuilder;
                };
                var Attr : {
                    (): __ABBREV.__Html.AttributeBuilder;
                };
            }
            module Operators {
                var add : {
                    <_M1>(el: __ABBREV.__Html.Element, inner: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
                };
                var OnAfterRender : {
                    <_M1>(f: {
                        (x: _M1): void;
                    }, w: _M1): void;
                };
                var OnBeforeRender : {
                    <_M1>(f: {
                        (x: _M1): void;
                    }, w: _M1): void;
                };
            }
            module PageletExtensions {
                var IPagelet_AppendTo : {
                    (p: __ABBREV.__Html.IPagelet, targetId: string): void;
                };
            }
            interface IPagelet {
                Render(): void;
                get_Body(): __ABBREV.__Dom.Node;
            }
            interface Element {
                OnLoad(f: {
                    (): void;
                }): void;
                AppendI(pl: __ABBREV.__Html.IPagelet): void;
                AppendN(node: __ABBREV.__Dom.Node): void;
                Render(): void;
                get_Body(): __ABBREV.__Dom.Node;
                get_Text(): string;
                set_Text(x: string): void;
                get_Html(): string;
                set_Html(x: string): void;
                get_Value(): string;
                set_Value(x: string): void;
                get_Id(): string;
                get_HtmlProvider(): __ABBREV.__Interfaces.IHtmlProvider;
                get_Item(name: string): string;
                set_Item(name: string, value: string): void;
            }
            interface Html5TagBuilder {
                NewTag<_M1>(name: string, children: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
            }
            interface DeprecatedTagBuilder {
                NewTag<_M1>(name: string, children: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
            }
            interface TagBuilder {
                NewTag<_M1>(name: string, children: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
                text(data: string): __ABBREV.__Html.IPagelet;
                Div<_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Html.Element;
            }
            interface Html5AttributeBuilder {
                NewAttr(name: string, value: string): __ABBREV.__Html.IPagelet;
            }
            interface DeprecatedAttributeBuilder {
                NewAttr(name: string, value: string): __ABBREV.__Html.IPagelet;
            }
            interface AttributeBuilder {
                NewAttr(name: string, value: string): __ABBREV.__Html.IPagelet;
                Class(x: string): __ABBREV.__Html.IPagelet;
                get_CheckBox(): __ABBREV.__Html.IPagelet;
                get_Hidden(): __ABBREV.__Html.IPagelet;
                get_Radio(): __ABBREV.__Html.IPagelet;
                get_Reset(): __ABBREV.__Html.IPagelet;
                get_Submit(): __ABBREV.__Html.IPagelet;
                get_Password(): __ABBREV.__Html.IPagelet;
                get_TextField(): __ABBREV.__Html.IPagelet;
            }
        }
    }
}
declare module __ABBREV {
    
    export import __Interfaces = IntelliFactory.WebSharper.Html.Interfaces;
    export import __Html = IntelliFactory.WebSharper.Html;
    export import __Dom = IntelliFactory.WebSharper.Dom;
    export import __Events = IntelliFactory.WebSharper.Html.Events;
    export import __WebSharper = IntelliFactory.WebSharper;
}
