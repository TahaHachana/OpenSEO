declare module IntelliFactory {
    module Html {
        module Web {
            interface Control {
            }
        }
        module Html {
            interface TagContent<_T1> {
                Name: string;
                Attributes: __ABBREV.__List.T<any>;
                Contents: __ABBREV.__List.T<__ABBREV.__Html.Element<_T1>>;
                Annotation: __ABBREV.__WebSharper.OptionProxy<_T1>;
            }
            interface Element<_T1> {
            }
            interface Attribute<_T1> {
                Name: string;
                Value: string;
            }
            interface INode<_T1> {
                get_Node(): __ABBREV.__Html.Node<_T1>;
            }
            interface Node<_T1> {
            }
            interface IElement<_T1> {
                get_Element(): __ABBREV.__Html.Element<_T1>;
            }
            interface Document<_T1> {
                Annotations: any;
                Body: __ABBREV.__Html.Element<void>;
            }
            interface Writer {
            }
        }
    }
}
declare module __ABBREV {
    
    export import __List = IntelliFactory.WebSharper.List;
    export import __Html = IntelliFactory.Html.Html;
    export import __WebSharper = IntelliFactory.WebSharper;
}
