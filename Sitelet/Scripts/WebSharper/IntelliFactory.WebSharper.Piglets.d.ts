declare module IntelliFactory {
    module WebSharper {
        module Piglets {
            module ErrorMessage {
                var Create : {
                    <_M1>(msg: string, reader: __ABBREV.__Piglets.Reader<_M1>): __ABBREV.__Piglets.ErrorMessage;
                };
            }
            module Result {
                var Failwith : {
                    (msg: string): __ABBREV.__Piglets.Result<any>;
                };
                var Ap : {
                    <_M1>(r1: __ABBREV.__Piglets.Result<{
                        (x: any): _M1;
                    }>, r2: __ABBREV.__Piglets.Result<any>): __ABBREV.__Piglets.Result<_M1>;
                };
                var Join : {
                    (r: __ABBREV.__Piglets.Result<__ABBREV.__Piglets.Result<any>>): __ABBREV.__Piglets.Result<any>;
                };
                var Map : {
                    <_M1>(f: {
                        (x: any): _M1;
                    }, ra: __ABBREV.__Piglets.Result<any>): __ABBREV.__Piglets.Result<_M1>;
                };
                var Map2 : {
                    <_M1, _M2>(f: {
                        (x: any): {
                            (x: _M1): _M2;
                        };
                    }, ra: __ABBREV.__Piglets.Result<any>, rb: __ABBREV.__Piglets.Result<_M1>): __ABBREV.__Piglets.Result<_M2>;
                };
                var Iter : {
                    (f: {
                        (x: any): void;
                    }): {
                        (x: __ABBREV.__Piglets.Result<any>): void;
                    };
                };
                var Bind : {
                    <_M1>(f: {
                        (x: any): __ABBREV.__Piglets.Result<_M1>;
                    }): {
                        (x: __ABBREV.__Piglets.Result<any>): __ABBREV.__Piglets.Result<_M1>;
                    };
                };
            }
            module Reader {
                var MapResult : {
                    <_M1>(f: {
                        (x: __ABBREV.__Piglets.Result<_M1>): __ABBREV.__Piglets.Result<any>;
                    }, r: __ABBREV.__Piglets.Reader<_M1>): __ABBREV.__Piglets.Reader<any>;
                };
                var MapResult2 : {
                    <_M1, _M2>(f: {
                        (x: __ABBREV.__Piglets.Result<_M1>): {
                            (x: __ABBREV.__Piglets.Result<_M2>): __ABBREV.__Piglets.Result<any>;
                        };
                    }, rb: __ABBREV.__Piglets.Reader<_M1>, rc: __ABBREV.__Piglets.Reader<_M2>): __ABBREV.__Piglets.Reader<any>;
                };
                var Map : {
                    <_M1>(f: {
                        (x: _M1): any;
                    }, r: __ABBREV.__Piglets.Reader<_M1>): __ABBREV.__Piglets.Reader<any>;
                };
                var Map2 : {
                    <_M1, _M2>(f: {
                        (x: _M1): {
                            (x: _M2): any;
                        };
                    }, rb: __ABBREV.__Piglets.Reader<_M1>, rc: __ABBREV.__Piglets.Reader<_M2>): __ABBREV.__Piglets.Reader<any>;
                };
                var MapToResult : {
                    <_M1>(f: {
                        (x: _M1): __ABBREV.__Piglets.Result<any>;
                    }, r: __ABBREV.__Piglets.Reader<_M1>): __ABBREV.__Piglets.Reader<any>;
                };
            }
            module Controls {
                var input : {
                    <_M1>(type: string, ofString: {
                        (x: string): _M1;
                    }, toString: {
                        (x: _M1): string;
                    }, stream: __ABBREV.__Piglets.Stream<_M1>): __ABBREV.__Html.Element;
                };
                var WithLabel : {
                    (label: string, element: __ABBREV.__Html.Element): __ABBREV.__Html.Element;
                };
                var WithLabelAfter : {
                    (label: string, element: __ABBREV.__Html.Element): __ABBREV.__Html.Element;
                };
                var IntInput : {
                    (stream: __ABBREV.__Piglets.Stream<number>): __ABBREV.__Html.Element;
                };
                var TextArea : {
                    (stream: __ABBREV.__Piglets.Stream<string>): __ABBREV.__Html.Element;
                };
                var CheckBox : {
                    (stream: __ABBREV.__Piglets.Stream<boolean>): __ABBREV.__Html.Element;
                };
                var Radio : {
                    <_M1>(stream: __ABBREV.__Piglets.Stream<_M1>, values: __ABBREV.__WebSharper.seq<any>): __ABBREV.__Html.Element;
                };
                var Select : {
                    <_M1>(stream: __ABBREV.__Piglets.Stream<_M1>, values: __ABBREV.__WebSharper.seq<any>): __ABBREV.__Html.Element;
                };
                var RenderMany : {
                    <_M1, _M2, _M3, _M4>(stream: __ABBREV.__Many.Stream<_M1, _M2, __ABBREV.__Html.Element, _M3, _M4>, renderOne: {
                        (x: __ABBREV.__Many.Operations): _M2;
                    }, container: __ABBREV.__Html.Element): __ABBREV.__Html.Element;
                };
                var RenderChoice : {
                    <_M1, _M2, _M3, _M4, _M5>(stream: __ABBREV.__Choose.Stream<_M1, _M2, _M3, _M4, _M5, __ABBREV.__Html.Element>, renderOne: _M5, container: __ABBREV.__Html.Element): __ABBREV.__Html.Element;
                };
                var ShowResult : {
                    <_M1, _M2, _M3>(reader: __ABBREV.__Piglets.Reader<_M1>, render: {
                        (x: __ABBREV.__Piglets.Result<_M1>): _M2;
                    }, container: __ABBREV.__Html.Element): __ABBREV.__Html.Element;
                };
                var Show : {
                    <_M1, _M2, _M3>(reader: __ABBREV.__Piglets.Reader<_M1>, render: {
                        (x: _M1): _M2;
                    }, container: __ABBREV.__Html.Element): __ABBREV.__Html.Element;
                };
                var ShowString : {
                    <_M1>(reader: __ABBREV.__Piglets.Reader<_M1>, render: {
                        (x: _M1): string;
                    }, container: __ABBREV.__Html.Element): __ABBREV.__Html.Element;
                };
                var ShowErrors : {
                    <_M1, _M2, _M3>(reader: __ABBREV.__Piglets.Reader<_M1>, render: {
                        (x: __ABBREV.__List.T<string>): _M2;
                    }, container: __ABBREV.__Html.Element): __ABBREV.__Html.Element;
                };
                var EnableOnSuccess : {
                    <_M1>(reader: __ABBREV.__Piglets.Reader<_M1>, element: __ABBREV.__Html.Element): __ABBREV.__Html.Element;
                };
                var Submit : {
                    (submit: __ABBREV.__Piglets.Writer<void>): __ABBREV.__Html.Element;
                };
                var SubmitValidate : {
                    <_M1>(submit: __ABBREV.__Piglets.Submitter<_M1>): __ABBREV.__Html.Element;
                };
                var Button : {
                    (submit: __ABBREV.__Piglets.Writer<void>): __ABBREV.__Html.Element;
                };
                var ButtonValidate : {
                    <_M1>(submit: __ABBREV.__Piglets.Submitter<_M1>): __ABBREV.__Html.Element;
                };
                var Link : {
                    (submit: __ABBREV.__Piglets.Writer<void>): __ABBREV.__Html.Element;
                };
                var Attr : {
                    <_M1>(reader: __ABBREV.__Piglets.Reader<_M1>, attrName: string, render: {
                        (x: _M1): string;
                    }, element: __ABBREV.__Html.Element): __ABBREV.__Html.Element;
                };
                var AttrResult : {
                    <_M1>(reader: __ABBREV.__Piglets.Reader<_M1>, attrName: string, render: {
                        (x: __ABBREV.__Piglets.Result<_M1>): string;
                    }, element: __ABBREV.__Html.Element): __ABBREV.__Html.Element;
                };
                var Css : {
                    <_M1>(reader: __ABBREV.__Piglets.Reader<_M1>, attrName: string, render: {
                        (x: _M1): string;
                    }, element: __ABBREV.__Html.Element): __ABBREV.__Html.Element;
                };
                var CssResult : {
                    <_M1>(reader: __ABBREV.__Piglets.Reader<_M1>, attrName: string, render: {
                        (x: __ABBREV.__Piglets.Result<_M1>): string;
                    }, element: __ABBREV.__Html.Element): __ABBREV.__Html.Element;
                };
                var nextId : {
                    (): {
                        (): string;
                    };
                };
            }
            module Many {
                interface Stream<_T1, _T2, _T3, _T4, _T5> {
                    Subscribe(f: {
                        (x: __ABBREV.__Piglets.Result<_T1[]>): void;
                    }): __ABBREV.__WebSharper.IDisposableProxy;
                    Render<_M1>(c: __ABBREV.__Piglets.Container<_T3, _M1>, f: {
                        (x: __ABBREV.__Many.Operations): _T2;
                    }): _M1;
                    AddRender(f: _T4): _T5;
                    update(): void;
                    get_Latest(): __ABBREV.__Piglets.Result<_T1[]>;
                    get_Add(): __ABBREV.__Piglets.Writer<_T1>;
                }
                interface Operations {
                    get_Delete(): __ABBREV.__Piglets.Writer<void>;
                    get_MoveUp(): __ABBREV.__Piglets.Submitter<void>;
                    get_MoveDown(): __ABBREV.__Piglets.Submitter<void>;
                }
                interface UnitStream<_T1, _T2, _T3> {
                    get_Add(): __ABBREV.__Piglets.Writer<void>;
                }
            }
            module Choose {
                interface Stream<_T1, _T2, _T3, _T4, _T5, _T6> {
                    Subscribe(f: {
                        (x: __ABBREV.__Piglets.Result<_T1>): void;
                    }): __ABBREV.__WebSharper.IDisposableProxy;
                    Chooser(f: _T3): _T4;
                    Choice<_M1>(c: __ABBREV.__Piglets.Container<_T6, _M1>, f: _T5): _M1;
                    Dispose(): void;
                    get_Latest(): __ABBREV.__Piglets.Result<_T1>;
                    get_ChooserStream(): __ABBREV.__Piglets.Stream<_T2>;
                }
            }
            module Piglet1 {
                module Validation {
                    var Is_ : {
                        <_M1, _M2>(pred: {
                            (x: _M1): boolean;
                        }, msg: __ABBREV.__Piglets.ErrorMessage, p: __ABBREV.__Piglets.Piglet<_M1, _M2>): __ABBREV.__Piglets.Piglet<_M1, _M2>;
                    };
                    var Is : {
                        <_M1, _M2>(pred: {
                            (x: _M1): boolean;
                        }, msg: string, p: __ABBREV.__Piglets.Piglet<_M1, _M2>): __ABBREV.__Piglets.Piglet<_M1, _M2>;
                    };
                    var NotEmpty : {
                        (value: string): boolean;
                    };
                    var Match : {
                        (regexp: string): {
                            (x: string): boolean;
                        };
                    };
                }
                interface Builder {
                    Bind<_M1, _M2, _M3, _M4, _M5, _M6, _M7>(p: __ABBREV.__Piglets.Piglet<_M1, {
                        (x: _M2): _M3;
                    }>, f: {
                        (x: _M1): __ABBREV.__Piglets.Piglet<_M4, {
                            (x: _M5): _M6;
                        }>;
                    }): __ABBREV.__Piglets.Piglet<_M4, {
                        (x: {
                            (x: __ABBREV.__Choose.Stream<_M4, _M1, _M2, _M3, _M5, _M6>): _M7;
                        }): _M7;
                    }>;
                    Return<_M1, _M2>(x: _M1): __ABBREV.__Piglets.Piglet<_M1, {
                        (x: _M2): _M2;
                    }>;
                    ReturnFrom<_M1, _M2>(p: __ABBREV.__Piglets.Piglet<_M1, _M2>): __ABBREV.__Piglets.Piglet<_M1, _M2>;
                    Yield<_M1, _M2>(x: _M1): __ABBREV.__Piglets.Piglet<_M1, {
                        (x: {
                            (x: __ABBREV.__Piglets.Stream<_M1>): _M2;
                        }): _M2;
                    }>;
                    YieldFrom<_M1, _M2>(p: __ABBREV.__Piglets.Piglet<_M1, _M2>): __ABBREV.__Piglets.Piglet<_M1, _M2>;
                    Zero<_M1, _M2>(): __ABBREV.__Piglets.Piglet<_M1, {
                        (x: _M2): _M2;
                    }>;
                }
                var Yield : {
                    <_M1, _M2>(x: _M1): __ABBREV.__Piglets.Piglet<_M1, {
                        (x: {
                            (x: __ABBREV.__Piglets.Stream<_M1>): _M2;
                        }): _M2;
                    }>;
                };
                var YieldFailure : {
                    <_M1, _M2>(): __ABBREV.__Piglets.Piglet<_M1, {
                        (x: {
                            (x: __ABBREV.__Piglets.Stream<_M1>): _M2;
                        }): _M2;
                    }>;
                };
                var Return : {
                    <_M1, _M2>(x: _M1): __ABBREV.__Piglets.Piglet<_M1, {
                        (x: _M2): _M2;
                    }>;
                };
                var ReturnFailure : {
                    <_M1, _M2>(): __ABBREV.__Piglets.Piglet<_M1, {
                        (x: _M2): _M2;
                    }>;
                };
                var WithSubmit : {
                    <_M1, _M2, _M3>(pin: __ABBREV.__Piglets.Piglet<_M1, {
                        (x: _M2): {
                            (x: __ABBREV.__Piglets.Submitter<_M1>): _M3;
                        };
                    }>): __ABBREV.__Piglets.Piglet<_M1, {
                        (x: _M2): _M3;
                    }>;
                };
                var WithSubmitClearError : {
                    <_M1, _M2, _M3>(pin: __ABBREV.__Piglets.Piglet<_M1, {
                        (x: _M2): {
                            (x: __ABBREV.__Piglets.Submitter<_M1>): _M3;
                        };
                    }>): __ABBREV.__Piglets.Piglet<_M1, {
                        (x: _M2): _M3;
                    }>;
                };
                var Choose : {
                    <_M1, _M2, _M3, _M4, _M5, _M6, _M7>(chooser: __ABBREV.__Piglets.Piglet<_M1, {
                        (x: _M2): _M3;
                    }>, choices: {
                        (x: _M1): __ABBREV.__Piglets.Piglet<_M4, {
                            (x: _M5): _M6;
                        }>;
                    }): __ABBREV.__Piglets.Piglet<_M4, {
                        (x: {
                            (x: __ABBREV.__Choose.Stream<_M4, _M1, _M2, _M3, _M5, _M6>): _M7;
                        }): _M7;
                    }>;
                };
                var ManyPiglet : {
                    <_M1, _M2, _M3, _M4, _M5, _M6>(inits: _M1[], create: __ABBREV.__Piglets.Piglet<_M1, {
                        (x: _M2): _M3;
                    }>, p: {
                        (x: _M1): __ABBREV.__Piglets.Piglet<_M1, {
                            (x: _M4): _M5;
                        }>;
                    }): __ABBREV.__Piglets.Piglet<_M1[], {
                        (x: {
                            (x: __ABBREV.__Many.Stream<_M1, _M4, _M5, _M2, _M3>): _M6;
                        }): _M6;
                    }>;
                };
                var ManyInit : {
                    <_M1, _M2, _M3, _M4>(inits: _M1[], init: _M1, p: {
                        (x: _M1): __ABBREV.__Piglets.Piglet<_M1, {
                            (x: _M2): _M3;
                        }>;
                    }): __ABBREV.__Piglets.Piglet<_M1[], {
                        (x: {
                            (x: __ABBREV.__Many.UnitStream<_M1, _M2, _M3>): _M4;
                        }): _M4;
                    }>;
                };
                var Many : {
                    <_M1, _M2, _M3, _M4>(init: _M1, p: {
                        (x: _M1): __ABBREV.__Piglets.Piglet<_M1, {
                            (x: _M2): _M3;
                        }>;
                    }): __ABBREV.__Piglets.Piglet<_M1[], {
                        (x: {
                            (x: __ABBREV.__Many.UnitStream<_M1, _M2, _M3>): _M4;
                        }): _M4;
                    }>;
                };
                var TransmitStream : {
                    <_M1, _M2, _M3>(p: __ABBREV.__Piglets.Piglet<_M1, {
                        (x: _M2): {
                            (x: __ABBREV.__Piglets.Stream<_M1>): _M3;
                        };
                    }>): __ABBREV.__Piglets.Piglet<_M1, {
                        (x: _M2): _M3;
                    }>;
                };
                var TransmitReaderMapResult : {
                    <_M1, _M2, _M3, _M4>(f: {
                        (x: __ABBREV.__Piglets.Result<_M1>): __ABBREV.__Piglets.Result<_M2>;
                    }, p: __ABBREV.__Piglets.Piglet<_M1, {
                        (x: _M3): {
                            (x: __ABBREV.__Piglets.Reader<_M2>): _M4;
                        };
                    }>): __ABBREV.__Piglets.Piglet<_M1, {
                        (x: _M3): _M4;
                    }>;
                };
                var TransmitReaderMapToResult : {
                    <_M1, _M2, _M3, _M4>(f: {
                        (x: _M1): __ABBREV.__Piglets.Result<_M2>;
                    }, p: __ABBREV.__Piglets.Piglet<_M1, {
                        (x: _M3): {
                            (x: __ABBREV.__Piglets.Reader<_M2>): _M4;
                        };
                    }>): __ABBREV.__Piglets.Piglet<_M1, {
                        (x: _M3): _M4;
                    }>;
                };
                var TransmitReaderMap : {
                    <_M1, _M2, _M3, _M4>(f: {
                        (x: _M1): _M2;
                    }, p: __ABBREV.__Piglets.Piglet<_M1, {
                        (x: _M3): {
                            (x: __ABBREV.__Piglets.Reader<_M2>): _M4;
                        };
                    }>): __ABBREV.__Piglets.Piglet<_M1, {
                        (x: _M3): _M4;
                    }>;
                };
                var TransmitReader : {
                    <_M1, _M2, _M3>(p: __ABBREV.__Piglets.Piglet<_M1, {
                        (x: _M2): {
                            (x: __ABBREV.__Piglets.Reader<_M1>): _M3;
                        };
                    }>): __ABBREV.__Piglets.Piglet<_M1, {
                        (x: _M2): _M3;
                    }>;
                };
                var TransmitWriter : {
                    <_M1, _M2, _M3>(p: __ABBREV.__Piglets.Piglet<_M1, {
                        (x: _M2): {
                            (x: __ABBREV.__Piglets.Writer<_M1>): _M3;
                        };
                    }>): __ABBREV.__Piglets.Piglet<_M1, {
                        (x: _M2): _M3;
                    }>;
                };
                var MapResult : {
                    <_M1, _M2, _M3>(m: {
                        (x: __ABBREV.__Piglets.Result<_M1>): __ABBREV.__Piglets.Result<_M2>;
                    }, p: __ABBREV.__Piglets.Piglet<_M1, _M3>): __ABBREV.__Piglets.Piglet<_M2, _M3>;
                };
                var MapToResult : {
                    <_M1, _M2, _M3>(m: {
                        (x: _M1): __ABBREV.__Piglets.Result<_M2>;
                    }, p: __ABBREV.__Piglets.Piglet<_M1, _M3>): __ABBREV.__Piglets.Piglet<_M2, _M3>;
                };
                var Map : {
                    <_M1, _M2, _M3>(m: {
                        (x: _M1): _M2;
                    }, p: __ABBREV.__Piglets.Piglet<_M1, _M3>): __ABBREV.__Piglets.Piglet<_M2, _M3>;
                };
                var MapAsyncResult : {
                    <_M1, _M2, _M3>(m: {
                        (x: __ABBREV.__Piglets.Result<_M1>): any;
                    }, p: __ABBREV.__Piglets.Piglet<_M1, _M3>): __ABBREV.__Piglets.Piglet<_M2, _M3>;
                };
                var MapToAsyncResult : {
                    <_M1, _M2, _M3>(m: {
                        (x: _M1): any;
                    }, p: __ABBREV.__Piglets.Piglet<_M1, _M3>): __ABBREV.__Piglets.Piglet<_M2, _M3>;
                };
                var MapAsync : {
                    <_M1, _M2, _M3>(m: {
                        (x: _M1): any;
                    }, p: __ABBREV.__Piglets.Piglet<_M1, _M3>): __ABBREV.__Piglets.Piglet<_M2, _M3>;
                };
                var MapResultWithWriter : {
                    <_M1, _M2, _M3>(f: {
                        (x: __ABBREV.__Piglets.Writer<_M1>): {
                            (x: __ABBREV.__Piglets.Result<_M2>): void;
                        };
                    }, p: __ABBREV.__Piglets.Piglet<_M2, _M3>): __ABBREV.__Piglets.Piglet<_M1, _M3>;
                };
                var MapWithWriter : {
                    <_M1, _M2, _M3>(f: {
                        (x: __ABBREV.__Piglets.Writer<_M1>): {
                            (x: _M2): void;
                        };
                    }, p: __ABBREV.__Piglets.Piglet<_M2, _M3>): __ABBREV.__Piglets.Piglet<_M1, _M3>;
                };
                var FlushErrors : {
                    <_M1, _M2>(p: __ABBREV.__Piglets.Piglet<_M1, _M2>): __ABBREV.__Piglets.Piglet<_M1, _M2>;
                };
                var RunResult : {
                    <_M1, _M2>(action: {
                        (x: __ABBREV.__Piglets.Result<_M1>): void;
                    }, p: __ABBREV.__Piglets.Piglet<_M1, _M2>): __ABBREV.__Piglets.Piglet<_M1, _M2>;
                };
                var Run : {
                    <_M1, _M2>(action: {
                        (x: _M1): void;
                    }, p: __ABBREV.__Piglets.Piglet<_M1, _M2>): __ABBREV.__Piglets.Piglet<_M1, _M2>;
                };
                var Render : {
                    <_M1, _M2, _M3>(view: _M1, p: __ABBREV.__Piglets.Piglet<_M2, {
                        (x: _M1): _M3;
                    }>): _M3;
                };
                var MapViewArgs : {
                    <_M1, _M2, _M3, _M4>(view: _M1, p: __ABBREV.__Piglets.Piglet<_M2, {
                        (x: _M1): _M3;
                    }>): __ABBREV.__Piglets.Piglet<_M2, {
                        (x: {
                            (x: _M3): _M4;
                        }): _M4;
                    }>;
                };
                var YieldOption : {
                    <_M1, _M2>(init: __ABBREV.__WebSharper.OptionProxy<_M1>, noneValue: _M1): __ABBREV.__Piglets.Piglet<__ABBREV.__WebSharper.OptionProxy<_M1>, {
                        (x: {
                            (x: __ABBREV.__Piglets.Stream<_M1>): _M2;
                        }): _M2;
                    }>;
                };
                var Confirm : {
                    <_M1, _M2, _M3, _M4, _M5, _M6>(init: _M1, validate: {
                        (x: __ABBREV.__Piglets.Piglet<_M1, {
                            (x: {
                                (x: __ABBREV.__Piglets.Stream<_M1>): _M2;
                            }): _M2;
                        }>): __ABBREV.__Piglets.Piglet<_M1, {
                            (x: {
                                (x: _M3): {
                                    (x: _M4): any;
                                };
                            }): {
                                (x: __ABBREV.__Piglets.Stream<_M1>): _M5;
                            };
                        }>;
                    }, nomatch: string): __ABBREV.__Piglets.Piglet<_M1, {
                        (x: {
                            (x: _M5): _M6;
                        }): _M6;
                    }>;
                };
            }
            module Pervasives {
                var op_LessMultiplyGreater : {
                    <_M1, _M2, _M3, _M4, _M5>(f: __ABBREV.__Piglets.Piglet<{
                        (x: _M1): _M2;
                    }, {
                        (x: _M3): _M4;
                    }>, x: __ABBREV.__Piglets.Piglet<_M1, {
                        (x: _M4): _M5;
                    }>): __ABBREV.__Piglets.Piglet<_M2, {
                        (x: _M3): _M5;
                    }>;
                };
                var op_LessMultiplyQmarkGreater : {
                    <_M1, _M2, _M3, _M4, _M5>(f: __ABBREV.__Piglets.Piglet<{
                        (x: _M1): _M2;
                    }, {
                        (x: _M3): _M4;
                    }>, x: __ABBREV.__Piglets.Piglet<__ABBREV.__Piglets.Result<_M1>, {
                        (x: _M4): _M5;
                    }>): __ABBREV.__Piglets.Piglet<_M2, {
                        (x: _M3): _M5;
                    }>;
                };
            }
            module Stream1 {
                var Ap : {
                    <_M1, _M2>(sf: __ABBREV.__Piglets.Stream<{
                        (x: _M1): _M2;
                    }>, sx: __ABBREV.__Piglets.Stream<_M1>): __ABBREV.__Piglets.Stream<_M2>;
                };
                var ApJoin : {
                    <_M1, _M2>(sf: __ABBREV.__Piglets.Stream<{
                        (x: _M1): _M2;
                    }>, sx: __ABBREV.__Piglets.Stream<__ABBREV.__Piglets.Result<_M1>>): __ABBREV.__Piglets.Stream<_M2>;
                };
                var Map : {
                    <_M1, _M2>(a2b: {
                        (x: _M1): _M2;
                    }, b2a: {
                        (x: _M2): _M1;
                    }, s: __ABBREV.__Piglets.Stream<_M1>): __ABBREV.__Piglets.Stream<_M2>;
                };
            }
            interface ErrorMessage {
                get_Message(): string;
                get_Source(): number;
            }
            interface Reader<_T1> {
                SubscribeImmediate(f: {
                    (x: __ABBREV.__Piglets.Result<_T1>): void;
                }): __ABBREV.__WebSharper.IDisposableProxy;
                Through<_M1>(r: __ABBREV.__Piglets.Reader<_M1>): __ABBREV.__Piglets.Reader<_T1>;
                get_Id(): number;
            }
            interface Result<_T1> {
                get_isSuccess(): boolean;
            }
            interface Writer<_T1> {
                Trigger(x0: __ABBREV.__Piglets.Result<_T1>): void;
            }
            interface Stream<_T1> {
                Subscribe(f: {
                    (x: __ABBREV.__Piglets.Result<_T1>): void;
                }): __ABBREV.__WebSharper.IDisposableProxy;
                Trigger(x: __ABBREV.__Piglets.Result<_T1>): void;
                Trigger1(x: __ABBREV.__Piglets.Result<_T1>): void;
                Write(x: _T1): __ABBREV.__Piglets.Writer<void>;
                get_Latest(): __ABBREV.__Piglets.Result<_T1>;
            }
            interface Submitter<_T1> {
                Trigger(): void;
                Subscribe(f: {
                    (x: __ABBREV.__Piglets.Result<_T1>): void;
                }): __ABBREV.__WebSharper.IDisposableProxy;
                Trigger1(x: __ABBREV.__Piglets.Result<void>): void;
                get_Input(): __ABBREV.__Piglets.Reader<_T1>;
                get_Output(): __ABBREV.__Piglets.Stream<_T1>;
                get_Latest(): __ABBREV.__Piglets.Result<_T1>;
            }
            interface Piglet<_T1, _T2> {
                get_Stream(): __ABBREV.__Piglets.Stream<_T1>;
                stream: __ABBREV.__Piglets.Stream<_T1>;
                view: _T2;
            }
            interface Container<_T1, _T2> {
                Add(x0: _T1): void;
                Remove(x0: number): void;
                MoveUp(x0: number): void;
                get_Container(): _T2;
            }
        }
    }
}
declare module __ABBREV {
    
    export import __Piglets = IntelliFactory.WebSharper.Piglets;
    export import __Html = IntelliFactory.WebSharper.Html;
    export import __WebSharper = IntelliFactory.WebSharper;
    export import __Many = IntelliFactory.WebSharper.Piglets.Many;
    export import __Choose = IntelliFactory.WebSharper.Piglets.Choose;
    export import __List = IntelliFactory.WebSharper.List;
}
