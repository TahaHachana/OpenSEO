declare module IntelliFactory {
    module WebSharper {
        module Formlet {
            module Body {
                var New : {
                    (el: __ABBREV.__Html.Element, l: __ABBREV.__WebSharper.OptionProxy<{
                        (): __ABBREV.__Html.Element;
                    }>): __ABBREV.__Formlet.Body;
                };
            }
            module Layout {
                module Padding {
                    var get_Default : {
                        (): __ABBREV.__Layout.Padding;
                    };
                }
                module LabelConfiguration {
                    var get_Default : {
                        (): __ABBREV.__Layout.LabelConfiguration;
                    };
                }
                module FormRowConfiguration {
                    var get_Default : {
                        (): __ABBREV.__Layout.FormRowConfiguration;
                    };
                }
                interface Align {
                }
                interface VerticalAlign {
                }
                interface FormRowConfiguration {
                    Padding: __ABBREV.__WebSharper.OptionProxy<__ABBREV.__Layout.Padding>;
                    Color: __ABBREV.__WebSharper.OptionProxy<{
                        (x: number): string;
                    }>;
                    Class: __ABBREV.__WebSharper.OptionProxy<{
                        (x: number): string;
                    }>;
                    Style: __ABBREV.__WebSharper.OptionProxy<{
                        (x: number): string;
                    }>;
                    LabelConfiguration: __ABBREV.__WebSharper.OptionProxy<__ABBREV.__Layout.LabelConfiguration>;
                }
                interface LabelConfiguration {
                    Align: __ABBREV.__Layout.Align;
                    VerticalAlign: __ABBREV.__Layout.VerticalAlign;
                    Placement: __ABBREV.__Layout.Placement;
                }
                interface Padding {
                    Left: __ABBREV.__WebSharper.OptionProxy<number>;
                    Right: __ABBREV.__WebSharper.OptionProxy<number>;
                    Top: __ABBREV.__WebSharper.OptionProxy<number>;
                    Bottom: __ABBREV.__WebSharper.OptionProxy<number>;
                }
                interface Placement {
                }
            }
            module Data {
                interface Formlet<_T1> {
                    Run(f: {
                        (x: _T1): void;
                    }): __ABBREV.__Html.IPagelet;
                    Build(): __ABBREV.__Base.Form<__ABBREV.__Formlet.Body, _T1>;
                    get_Layout(): any;
                    MapResult<_M1>(f: {
                        (x: __ABBREV.__Base.Result<_T1>): __ABBREV.__Base.Result<_M1>;
                    }): __ABBREV.__Base.IFormlet<__ABBREV.__Formlet.Body, _T1>;
                    get_Body(): __ABBREV.__Dom.Node;
                    Render(): void;
                    BuildInternal: {
                        (): __ABBREV.__Base.Form<__ABBREV.__Formlet.Body, _T1>;
                    };
                    LayoutInternal: any;
                    ElementInternal: __ABBREV.__WebSharper.OptionProxy<__ABBREV.__Html.Element>;
                    FormletBase: __ABBREV.__Base.FormletProvider<__ABBREV.__Formlet.Body>;
                    Utils: any;
                }
                var NewBody : {
                    (arg00: __ABBREV.__Html.Element, arg10: __ABBREV.__WebSharper.OptionProxy<{
                        (): __ABBREV.__Html.Element;
                    }>): __ABBREV.__Formlet.Body;
                };
                var UtilsProvider : {
                    (): any;
                };
                var BaseFormlet : {
                    (): __ABBREV.__Base.FormletProvider<__ABBREV.__Formlet.Body>;
                };
                var PropagateRenderFrom : {
                    <_M1, _M2, _M3>(f1: __ABBREV.__Base.IFormlet<_M1, _M2>, f2: _M3): _M3;
                };
                var OfIFormlet : {
                    <_M1>(formlet: __ABBREV.__Base.IFormlet<__ABBREV.__Formlet.Body, _M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var MkFormlet : {
                    <_M1, _M2, _M3>(f: {
                        (): any;
                    }): __ABBREV.__Data.Formlet<_M3>;
                };
                var $ : {
                    <_M1, _M2>(f: __ABBREV.__Data.Formlet<{
                        (x: _M1): _M2;
                    }>, x: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M2>;
                };
                var RX : {
                    (): __ABBREV.__Reactive.IReactive;
                };
                var Layout : {
                    (): __ABBREV.__Formlet.LayoutProvider;
                };
                var DefaultLayout : {
                    (): any;
                };
                var Validator : {
                    (): __ABBREV.__Base.Validator;
                };
            }
            module Enhance {
                module FormButtonConfiguration {
                    var get_Default : {
                        (): __ABBREV.__Enhance.FormButtonConfiguration;
                    };
                }
                module ValidationIconConfiguration {
                    var get_Default : {
                        (): __ABBREV.__Enhance.ValidationIconConfiguration;
                    };
                }
                module ValidationFrameConfiguration {
                    var get_Default : {
                        (): __ABBREV.__Enhance.ValidationFrameConfiguration;
                    };
                }
                module Padding {
                    var get_Default : {
                        (): __ABBREV.__Enhance.Padding;
                    };
                }
                module FormContainerConfiguration {
                    var get_Default : {
                        (): __ABBREV.__Enhance.FormContainerConfiguration;
                    };
                }
                module ManyConfiguration {
                    var get_Default : {
                        (): __ABBREV.__Enhance.ManyConfiguration;
                    };
                }
                interface FormButtonConfiguration {
                    Label: __ABBREV.__WebSharper.OptionProxy<string>;
                    Style: __ABBREV.__WebSharper.OptionProxy<string>;
                    Class: __ABBREV.__WebSharper.OptionProxy<string>;
                }
                interface ValidationIconConfiguration {
                    ValidIconClass: string;
                    ErrorIconClass: string;
                }
                interface ValidationFrameConfiguration {
                    ValidClass: __ABBREV.__WebSharper.OptionProxy<string>;
                    ValidStyle: __ABBREV.__WebSharper.OptionProxy<string>;
                    ErrorClass: __ABBREV.__WebSharper.OptionProxy<string>;
                    ErrorStyle: __ABBREV.__WebSharper.OptionProxy<string>;
                }
                interface Padding {
                    Left: __ABBREV.__WebSharper.OptionProxy<number>;
                    Right: __ABBREV.__WebSharper.OptionProxy<number>;
                    Top: __ABBREV.__WebSharper.OptionProxy<number>;
                    Bottom: __ABBREV.__WebSharper.OptionProxy<number>;
                }
                interface FormPart {
                }
                interface FormContainerConfiguration {
                    Header: __ABBREV.__WebSharper.OptionProxy<__ABBREV.__Enhance.FormPart>;
                    Padding: __ABBREV.__Enhance.Padding;
                    Description: __ABBREV.__WebSharper.OptionProxy<__ABBREV.__Enhance.FormPart>;
                    BackgroundColor: __ABBREV.__WebSharper.OptionProxy<string>;
                    BorderColor: __ABBREV.__WebSharper.OptionProxy<string>;
                    CssClass: __ABBREV.__WebSharper.OptionProxy<string>;
                    Style: __ABBREV.__WebSharper.OptionProxy<string>;
                }
                interface ManyConfiguration {
                    AddIconClass: string;
                    RemoveIconClass: string;
                }
                interface JsonPostConfiguration {
                    PostUrl: __ABBREV.__WebSharper.OptionProxy<string>;
                    ParameterName: string;
                    EncodingType: __ABBREV.__WebSharper.OptionProxy<string>;
                }
                var WithResetFormlet : {
                    <_M1, _M2>(formlet: __ABBREV.__Data.Formlet<_M1>, reset: __ABBREV.__Data.Formlet<_M2>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithResetAction : {
                    <_M1>(f: {
                        (): boolean;
                    }, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithSubmitFormlet : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>, submit: {
                        (x: __ABBREV.__Base.Result<_M1>): __ABBREV.__Data.Formlet<void>;
                    }): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithSubmitAndReset : {
                    <_M1, _M2>(formlet: __ABBREV.__Data.Formlet<_M1>, submReset: {
                        (x: {
                            (): void;
                        }): {
                            (x: __ABBREV.__Base.Result<_M1>): __ABBREV.__Data.Formlet<_M2>;
                        };
                    }): __ABBREV.__Data.Formlet<_M2>;
                };
                var InputButton : {
                    (conf: __ABBREV.__Enhance.FormButtonConfiguration, enabled: boolean): __ABBREV.__Data.Formlet<number>;
                };
                var WithCustomSubmitAndResetButtons : {
                    <_M1>(submitConf: __ABBREV.__Enhance.FormButtonConfiguration, resetConf: __ABBREV.__Enhance.FormButtonConfiguration, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithSubmitAndResetButtons : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithCustomValidationIcon : {
                    <_M1>(vic: __ABBREV.__Enhance.ValidationIconConfiguration, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithValidationIcon : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WrapFormlet : {
                    <_M1>(wrapper: {
                        (x: __ABBREV.__Control.IObservableProxy<__ABBREV.__Base.Result<_M1>>): {
                            (x: __ABBREV.__Formlet.Body): __ABBREV.__Html.Element;
                        };
                    }, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithCustomValidationFrame : {
                    <_M1>(vc: __ABBREV.__Enhance.ValidationFrameConfiguration, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithCustomResetButton : {
                    <_M1>(buttonConf: __ABBREV.__Enhance.FormButtonConfiguration, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithResetButton : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithCustomSubmitButton : {
                    <_M1>(buttonConf: __ABBREV.__Enhance.FormButtonConfiguration, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithSubmitButton : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithErrorSummary : {
                    <_M1>(label: string, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithValidationFrame : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithErrorFormlet : {
                    <_M1, _M2>(f: {
                        (x: __ABBREV.__List.T<string>): __ABBREV.__Data.Formlet<_M1>;
                    }, formlet: __ABBREV.__Data.Formlet<_M2>): __ABBREV.__Data.Formlet<_M2>;
                };
                var WithLabel : {
                    <_M1>(labelGen: {
                        (): __ABBREV.__Html.Element;
                    }, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithLabelConfiguration : {
                    <_M1>(lc: __ABBREV.__Layout.LabelConfiguration, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithLabelAndInfo : {
                    <_M1>(label: string, info: string, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithTextLabel : {
                    <_M1>(label: string, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithLabelAbove : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithLabelLeft : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithCustomFormContainer : {
                    <_M1>(fc: __ABBREV.__Enhance.FormContainerConfiguration, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithFormContainer : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithCssClass : {
                    <_M1>(css: string, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithLegend : {
                    <_M1>(label: string, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithRowConfiguration : {
                    <_M1>(rc: __ABBREV.__Layout.FormRowConfiguration, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var Cancel : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>, isCancel: {
                        (x: _M1): boolean;
                    }): __ABBREV.__Data.Formlet<_M1>;
                };
                var Replace : {
                    <_M1, _M2>(formlet: __ABBREV.__Data.Formlet<_M1>, f: {
                        (x: _M1): __ABBREV.__Data.Formlet<_M2>;
                    }): __ABBREV.__Data.Formlet<_M2>;
                };
                var Deletable : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<__ABBREV.__WebSharper.OptionProxy<_M1>>): __ABBREV.__Data.Formlet<__ABBREV.__WebSharper.OptionProxy<_M1>>;
                };
                var Many_ : {
                    <_M1, _M2>(add: __ABBREV.__Data.Formlet<_M1>, f: {
                        (x: _M1): __ABBREV.__Data.Formlet<__ABBREV.__WebSharper.OptionProxy<_M2>>;
                    }): __ABBREV.__Data.Formlet<__ABBREV.__WebSharper.seq<_M2>>;
                };
                var CustomMany : {
                    <_M1>(config: __ABBREV.__Enhance.ManyConfiguration, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<__ABBREV.__List.T<_M1>>;
                };
                var Many : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<__ABBREV.__List.T<_M1>>;
                };
                var WithJsonPost : {
                    <_M1>(conf: any, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Html.Element;
                };
            }
            module Controls {
                var SelectControl : {
                    <_M1>(readOnly: boolean, def: number, vls: __ABBREV.__List.T<any>): __ABBREV.__Data.Formlet<_M1>;
                };
                var Select : {
                    <_M1>(def: number, vls: __ABBREV.__List.T<any>): __ABBREV.__Data.Formlet<_M1>;
                };
                var ReadOnlySelect : {
                    <_M1>(def: number, vls: __ABBREV.__List.T<any>): __ABBREV.__Data.Formlet<_M1>;
                };
                var InputControl : {
                    (value: string, f: {
                        (x: __ABBREV.__Reactive.HotStream<__ABBREV.__Base.Result<string>>): __ABBREV.__Html.Element;
                    }): __ABBREV.__Data.Formlet<string>;
                };
                var OnTextChange : {
                    (f: {
                        (): void;
                    }, control: __ABBREV.__Html.Element): void;
                };
                var TextAreaControl : {
                    (readOnly: boolean, value: string): __ABBREV.__Data.Formlet<string>;
                };
                var TextArea : {
                    (value: string): __ABBREV.__Data.Formlet<string>;
                };
                var ReadOnlyTextArea : {
                    (value: string): __ABBREV.__Data.Formlet<string>;
                };
                var InputField : {
                    (readOnly: boolean, typ: string, cls: string, value: string): __ABBREV.__Data.Formlet<string>;
                };
                var CheckboxControl : {
                    (readOnly: boolean, def: boolean): __ABBREV.__Data.Formlet<boolean>;
                };
                var Checkbox : {
                    (def: boolean): __ABBREV.__Data.Formlet<boolean>;
                };
                var ReadOnlyCheckbox : {
                    (def: boolean): __ABBREV.__Data.Formlet<boolean>;
                };
                var CheckboxGroupControl : {
                    <_M1>(readOnly: boolean, values: __ABBREV.__List.T<any>): __ABBREV.__Data.Formlet<__ABBREV.__List.T<_M1>>;
                };
                var CheckboxGroup : {
                    <_M1>(values: __ABBREV.__List.T<any>): __ABBREV.__Data.Formlet<__ABBREV.__List.T<_M1>>;
                };
                var RadioButtonGroupControl : {
                    <_M1>(readOnly: boolean, def: __ABBREV.__WebSharper.OptionProxy<number>, values: __ABBREV.__List.T<any>): __ABBREV.__Data.Formlet<_M1>;
                };
                var RadioButtonGroup : {
                    <_M1>(def: __ABBREV.__WebSharper.OptionProxy<number>, values: __ABBREV.__List.T<any>): __ABBREV.__Data.Formlet<_M1>;
                };
                var ReadOnlyRadioButtonGroup : {
                    <_M1>(def: __ABBREV.__WebSharper.OptionProxy<number>, values: __ABBREV.__List.T<any>): __ABBREV.__Data.Formlet<_M1>;
                };
                var Password : {
                    (value: string): __ABBREV.__Data.Formlet<string>;
                };
                var Input : {
                    (value: string): __ABBREV.__Data.Formlet<string>;
                };
                var ReadOnlyInput : {
                    (value: string): __ABBREV.__Data.Formlet<string>;
                };
                var ElementButton : {
                    (genElem: {
                        (): __ABBREV.__Html.Element;
                    }): __ABBREV.__Data.Formlet<number>;
                };
                var Button : {
                    (label: string): __ABBREV.__Data.Formlet<number>;
                };
            }
            module Formlet {
                var BuildFormlet : {
                    <_M1, _M2, _M3>(f: {
                        (): any;
                    }): __ABBREV.__Data.Formlet<_M3>;
                };
                var New : {
                    <_M1>(f: {
                        (): __ABBREV.__Base.Form<__ABBREV.__Formlet.Body, _M1>;
                    }): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithLayoutOrDefault : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var Return : {
                    <_M1>(x: _M1): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithCancelation : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>, c: __ABBREV.__Data.Formlet<void>): __ABBREV.__Data.Formlet<__ABBREV.__WebSharper.OptionProxy<_M1>>;
                };
                var InitWith : {
                    <_M1>(value: _M1, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var InitWithFailure : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var Horizontal : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var Vertical : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var Flowlet : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var ReplaceFirstWithFailure : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var Never : {
                    <_M1>(): __ABBREV.__Data.Formlet<_M1>;
                };
                var Empty : {
                    <_M1>(): __ABBREV.__Data.Formlet<_M1>;
                };
                var ReturnEmpty : {
                    <_M1>(x: _M1): __ABBREV.__Data.Formlet<_M1>;
                };
                var BuildForm : {
                    <_M1>(f: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Base.Form<__ABBREV.__Formlet.Body, _M1>;
                };
                var Deletable : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<__ABBREV.__WebSharper.OptionProxy<_M1>>): __ABBREV.__Data.Formlet<__ABBREV.__WebSharper.OptionProxy<_M1>>;
                };
                var FailWith : {
                    <_M1>(fs: __ABBREV.__List.T<string>): __ABBREV.__Data.Formlet<_M1>;
                };
                var Map : {
                    <_M1, _M2>(f: {
                        (x: _M1): _M2;
                    }, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M2>;
                };
                var MapBody : {
                    <_M1>(f: {
                        (x: __ABBREV.__Formlet.Body): __ABBREV.__Formlet.Body;
                    }, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var MapResult : {
                    <_M1, _M2>(f: {
                        (x: __ABBREV.__Base.Result<_M1>): __ABBREV.__Base.Result<_M2>;
                    }, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M2>;
                };
                var Delay : {
                    <_M1>(f: {
                        (): __ABBREV.__Data.Formlet<_M1>;
                    }): __ABBREV.__Data.Formlet<_M1>;
                };
                var Bind : {
                    <_M1, _M2>(fl: __ABBREV.__Data.Formlet<_M1>, f: {
                        (x: _M1): __ABBREV.__Data.Formlet<_M2>;
                    }): __ABBREV.__Data.Formlet<_M2>;
                };
                var Replace : {
                    <_M1, _M2>(formlet: __ABBREV.__Data.Formlet<_M1>, f: {
                        (x: _M1): __ABBREV.__Data.Formlet<_M2>;
                    }): __ABBREV.__Data.Formlet<_M2>;
                };
                var Join : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<__ABBREV.__Data.Formlet<_M1>>): __ABBREV.__Data.Formlet<_M1>;
                };
                var Switch : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<__ABBREV.__Data.Formlet<_M1>>): __ABBREV.__Data.Formlet<_M1>;
                };
                var FlipBody : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var SelectMany : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<__ABBREV.__Data.Formlet<_M1>>): __ABBREV.__Data.Formlet<__ABBREV.__List.T<_M1>>;
                };
                var LiftResult : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<__ABBREV.__Base.Result<_M1>>;
                };
                var Sequence : {
                    <_M1>(fs: __ABBREV.__WebSharper.seq<__ABBREV.__Data.Formlet<_M1>>): __ABBREV.__Data.Formlet<__ABBREV.__List.T<_M1>>;
                };
                var WithLayout : {
                    <_M1>(l: any, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithNotification : {
                    <_M1>(c: {
                        (x: __ABBREV.__WebSharper.ObjectProxy): void;
                    }, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithNotificationChannel : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<any>;
                };
                var ApplyLayout : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var MapElement : {
                    <_M1>(f: {
                        (x: __ABBREV.__Html.Element): __ABBREV.__Html.Element;
                    }, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var OfElement : {
                    (genElem: {
                        (): __ABBREV.__Html.Element;
                    }): __ABBREV.__Data.Formlet<void>;
                };
                var WithLabel : {
                    <_M1>(label: __ABBREV.__WebSharper.OptionProxy<{
                        (): __ABBREV.__Html.Element;
                    }>, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var Run : {
                    <_M1>(f: {
                        (x: _M1): void;
                    }, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Html.IPagelet;
                };
                var BindWith : {
                    <_M1, _M2>(compose: {
                        (x: __ABBREV.__Formlet.Body): {
                            (x: __ABBREV.__Formlet.Body): __ABBREV.__Formlet.Body;
                        };
                    }, formlet: __ABBREV.__Data.Formlet<_M1>, f: {
                        (x: _M1): __ABBREV.__Data.Formlet<_M2>;
                    }): __ABBREV.__Data.Formlet<_M2>;
                };
                var Render : {
                    (formlet: __ABBREV.__Data.Formlet<void>): __ABBREV.__Html.IPagelet;
                };
                var Choose : {
                    <_M1>(fs: __ABBREV.__WebSharper.seq<__ABBREV.__Data.Formlet<_M1>>): __ABBREV.__Data.Formlet<_M1>;
                };
                var Do : {
                    (): __ABBREV.__Formlet.FormletBuilder;
                };
            }
            module CssConstants {
                var InputTextClass : {
                    (): string;
                };
            }
            interface Body {
                Element: __ABBREV.__Html.Element;
                Label: __ABBREV.__WebSharper.OptionProxy<{
                    (): __ABBREV.__Html.Element;
                }>;
            }
            interface LayoutProvider {
                HorizontalAlignElem(align: __ABBREV.__Layout.Align, el: __ABBREV.__Html.Element): __ABBREV.__Html.Element;
                VerticalAlignedTD(valign: __ABBREV.__Layout.VerticalAlign, elem: __ABBREV.__Html.Element): __ABBREV.__Html.Element;
                MakeRow(rowConfig: __ABBREV.__Layout.FormRowConfiguration, rowIndex: number, body: __ABBREV.__Formlet.Body): __ABBREV.__Html.Element;
                MakeLayout(lm: {
                    (): any;
                }): any;
                RowLayout(rowConfig: __ABBREV.__Layout.FormRowConfiguration): any;
                ColumnLayout(rowConfig: __ABBREV.__Layout.FormRowConfiguration): any;
                LabelLayout(lc: __ABBREV.__Layout.LabelConfiguration): any;
                get_Flowlet(): any;
                get_Vertical(): any;
                get_Horizontal(): any;
            }
            interface FormletBuilder {
                Return<_M1>(x: _M1): __ABBREV.__Data.Formlet<_M1>;
                Bind<_M1, _M2>(formlet: __ABBREV.__Data.Formlet<_M1>, f: {
                    (x: _M1): __ABBREV.__Data.Formlet<_M2>;
                }): __ABBREV.__Data.Formlet<_M2>;
                Delay<_M1>(f: {
                    (): __ABBREV.__Data.Formlet<_M1>;
                }): __ABBREV.__Data.Formlet<_M1>;
                ReturnFrom<_M1>(f: __ABBREV.__Base.IFormlet<__ABBREV.__Formlet.Body, _M1>): __ABBREV.__Data.Formlet<_M1>;
            }
        }
    }
}
declare module __ABBREV {
    
    export import __Html = IntelliFactory.WebSharper.Html;
    export import __WebSharper = IntelliFactory.WebSharper;
    export import __Formlet = IntelliFactory.WebSharper.Formlet;
    export import __Layout = IntelliFactory.WebSharper.Formlet.Layout;
    export import __Base = IntelliFactory.Formlet.Base;
    export import __Dom = IntelliFactory.WebSharper.Dom;
    export import __Data = IntelliFactory.WebSharper.Formlet.Data;
    export import __Reactive = IntelliFactory.Reactive;
    export import __Enhance = IntelliFactory.WebSharper.Formlet.Enhance;
    export import __Control = IntelliFactory.WebSharper.Control;
    export import __List = IntelliFactory.WebSharper.List;
}
