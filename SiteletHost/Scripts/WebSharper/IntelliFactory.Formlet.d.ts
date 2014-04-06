declare module IntelliFactory {
    module Formlet {
        module Base {
            module Tree {
                interface Edit<_T1> {
                    GetEnumerator(): __ABBREV.__WebSharper.IEnumeratorProxy1;
                    GetEnumerator1(): __ABBREV.__WebSharper.IEnumeratorProxy<_T1>;
                    get_Sequence(): __ABBREV.__WebSharper.seq<_T1>;
                }
                interface Tree<_T1> {
                    Map<_M1>(f: {
                        (x: _T1): _M1;
                    }): __ABBREV.__Tree.Tree<_M1>;
                    GetEnumerator(): __ABBREV.__WebSharper.IEnumeratorProxy1;
                    GetEnumerator1(): __ABBREV.__WebSharper.IEnumeratorProxy<_T1>;
                    get_Sequence(): __ABBREV.__WebSharper.seq<_T1>;
                }
                var ShowEdit : {
                    <_M1>(edit: __ABBREV.__Tree.Edit<_M1>): string;
                };
                var Count : {
                    <_M1>(t: __ABBREV.__Tree.Tree<_M1>): number;
                };
                var Range : {
                    <_M1>(edit: __ABBREV.__Tree.Edit<_M1>, input: __ABBREV.__Tree.Tree<_M1>): any;
                };
                var FromSequence : {
                    <_M1>(vs: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Tree.Tree<_M1>;
                };
                var ReplacedTree : {
                    <_M1>(edit: __ABBREV.__Tree.Edit<_M1>, input: __ABBREV.__Tree.Tree<_M1>): __ABBREV.__Tree.Tree<_M1>;
                };
                var Apply : {
                    <_M1>(edit: __ABBREV.__Tree.Edit<_M1>, input: __ABBREV.__Tree.Tree<_M1>): __ABBREV.__Tree.Tree<_M1>;
                };
                var Set : {
                    <_M1>(value: _M1): __ABBREV.__Tree.Edit<_M1>;
                };
                var Transform : {
                    <_M1, _M2>(f: {
                        (x: __ABBREV.__Tree.Tree<_M1>): __ABBREV.__Tree.Tree<_M2>;
                    }, edit: __ABBREV.__Tree.Edit<_M1>): __ABBREV.__Tree.Edit<_M2>;
                };
                var Delete : {
                    <_M1>(): __ABBREV.__Tree.Edit<_M1>;
                };
                var FlipEdit : {
                    <_M1>(edit: __ABBREV.__Tree.Edit<_M1>): __ABBREV.__Tree.Edit<_M1>;
                };
                var DeepFlipEdit : {
                    <_M1>(edit: __ABBREV.__Tree.Edit<_M1>): __ABBREV.__Tree.Edit<_M1>;
                };
            }
            module Result {
                var Join : {
                    (res: __ABBREV.__Base.Result<__ABBREV.__Base.Result<any>>): __ABBREV.__Base.Result<any>;
                };
                var Apply : {
                    <_M1>(f: __ABBREV.__Base.Result<{
                        (x: any): _M1;
                    }>, r: __ABBREV.__Base.Result<any>): __ABBREV.__Base.Result<_M1>;
                };
                var OfOption : {
                    (o: __ABBREV.__WebSharper.OptionProxy<any>): __ABBREV.__Base.Result<any>;
                };
                var Map : {
                    <_M1>(f: {
                        (x: any): _M1;
                    }, res: __ABBREV.__Base.Result<any>): __ABBREV.__Base.Result<_M1>;
                };
                var Sequence : {
                    (rs: __ABBREV.__WebSharper.seq<__ABBREV.__Base.Result<any>>): __ABBREV.__Base.Result<__ABBREV.__List.T<any>>;
                };
            }
            interface Layout<_T1> {
                Apply: {
                    (x: __ABBREV.__Control.IObservableProxy<__ABBREV.__Tree.Edit<_T1>>): __ABBREV.__WebSharper.OptionProxy<any>;
                };
            }
            interface Container<_T1> {
                Body: _T1;
                SyncRoot: __ABBREV.__WebSharper.ObjectProxy;
                Insert: {
                    (x: number): {
                        (x: _T1): void;
                    };
                };
                Remove: {
                    (x: __ABBREV.__WebSharper.seq<_T1>): void;
                };
            }
            interface Reactive {
                Reactive: __ABBREV.__Reactive.IReactive;
            }
            interface LayoutUtils {
                Default<_M1>(): any;
                Delay<_M1>(f: {
                    (): any;
                }): any;
                New<_M1>(container: {
                    (): any;
                }): any;
            }
            interface Result<_T1> {
            }
            interface Form<_T1, _T2> {
                Dispose(): void;
                Body: __ABBREV.__Control.IObservableProxy<__ABBREV.__Tree.Edit<_T1>>;
                Dispose1: {
                    (): void;
                };
                Notify: {
                    (x: __ABBREV.__WebSharper.ObjectProxy): void;
                };
                State: __ABBREV.__Control.IObservableProxy<__ABBREV.__Base.Result<_T2>>;
            }
            interface IFormlet<_T1, _T2> {
                Build(): __ABBREV.__Base.Form<_T1, _T2>;
                MapResult<_M1>(x0: {
                    (x: __ABBREV.__Base.Result<_T2>): __ABBREV.__Base.Result<_M1>;
                }): __ABBREV.__Base.IFormlet<_T1, _T2>;
                get_Layout(): any;
            }
            interface Utils<_T1> {
                Reactive: __ABBREV.__Reactive.IReactive;
                DefaultLayout: any;
            }
            interface FormletProvider<_T1> {
                BuildForm<_M1>(formlet: __ABBREV.__Base.IFormlet<_T1, _M1>): __ABBREV.__Base.Form<_T1, _M1>;
                New<_M1>(build: {
                    (): __ABBREV.__Base.Form<_T1, _M1>;
                }): __ABBREV.__Base.IFormlet<_T1, _M1>;
                FromState<_M1>(state: __ABBREV.__Control.IObservableProxy<__ABBREV.__Base.Result<_M1>>): __ABBREV.__Base.IFormlet<_T1, _M1>;
                WithLayout<_M1>(layout: any, formlet: __ABBREV.__Base.IFormlet<_T1, _M1>): __ABBREV.__Base.IFormlet<_T1, _M1>;
                InitWith<_M1>(value: _M1, formlet: __ABBREV.__Base.IFormlet<_T1, _M1>): __ABBREV.__Base.IFormlet<_T1, _M1>;
                ReplaceFirstWithFailure<_M1>(formlet: __ABBREV.__Base.IFormlet<_T1, _M1>): __ABBREV.__Base.IFormlet<_T1, _M1>;
                InitWithFailure<_M1>(formlet: __ABBREV.__Base.IFormlet<_T1, _M1>): __ABBREV.__Base.IFormlet<_T1, _M1>;
                ApplyLayout<_M1>(formlet: __ABBREV.__Base.IFormlet<_T1, _M1>): __ABBREV.__Base.IFormlet<_T1, _M1>;
                AppendLayout<_M1>(layout: any, formlet: __ABBREV.__Base.IFormlet<_T1, _M1>): __ABBREV.__Base.IFormlet<_T1, _M1>;
                MapBody<_M1>(f: {
                    (x: _T1): _T1;
                }, formlet: __ABBREV.__Base.IFormlet<_T1, _M1>): __ABBREV.__Base.IFormlet<_T1, _M1>;
                WithLayoutOrDefault<_M1>(formlet: __ABBREV.__Base.IFormlet<_T1, _M1>): __ABBREV.__Base.IFormlet<_T1, _M1>;
                MapResult<_M1, _M2>(f: {
                    (x: __ABBREV.__Base.Result<_M1>): __ABBREV.__Base.Result<_M2>;
                }, formlet: __ABBREV.__Base.IFormlet<_T1, _M1>): __ABBREV.__Base.IFormlet<_T1, _M2>;
                Map<_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, formlet: __ABBREV.__Base.IFormlet<_T1, _M1>): __ABBREV.__Base.IFormlet<_T1, _M2>;
                Apply<_M1, _M2>(f: __ABBREV.__Base.IFormlet<_T1, {
                    (x: _M1): _M2;
                }>, x: __ABBREV.__Base.IFormlet<_T1, _M1>): __ABBREV.__Base.IFormlet<_T1, _M2>;
                Return<_M1>(x: _M1): __ABBREV.__Base.IFormlet<_T1, _M1>;
                Fail<_M1>(fs: __ABBREV.__List.T<string>): __ABBREV.__Base.Form<_T1, _M1>;
                FailWith<_M1>(fs: __ABBREV.__List.T<string>): __ABBREV.__Base.IFormlet<_T1, _M1>;
                ReturnEmpty<_M1>(x: _M1): __ABBREV.__Base.IFormlet<_T1, _M1>;
                Never<_M1>(): __ABBREV.__Base.IFormlet<_T1, _M1>;
                Empty<_M1>(): __ABBREV.__Base.IFormlet<_T1, _M1>;
                EmptyForm<_M1>(): __ABBREV.__Base.Form<_T1, _M1>;
                Join<_M1>(formlet: __ABBREV.__Base.IFormlet<_T1, __ABBREV.__Base.IFormlet<_T1, _M1>>): __ABBREV.__Base.IFormlet<_T1, _M1>;
                Switch<_M1>(formlet: __ABBREV.__Base.IFormlet<_T1, __ABBREV.__Base.IFormlet<_T1, _M1>>): __ABBREV.__Base.IFormlet<_T1, _M1>;
                FlipBody<_M1>(formlet: __ABBREV.__Base.IFormlet<_T1, _M1>): __ABBREV.__Base.IFormlet<_T1, _M1>;
                SelectMany<_M1>(formlet: __ABBREV.__Base.IFormlet<_T1, __ABBREV.__Base.IFormlet<_T1, _M1>>): __ABBREV.__Base.IFormlet<_T1, __ABBREV.__List.T<_M1>>;
                WithNotificationChannel<_M1>(formlet: __ABBREV.__Base.IFormlet<_T1, _M1>): __ABBREV.__Base.IFormlet<_T1, any>;
                Replace<_M1, _M2>(formlet: __ABBREV.__Base.IFormlet<_T1, _M1>, f: {
                    (x: _M1): __ABBREV.__Base.IFormlet<_T1, _M2>;
                }): __ABBREV.__Base.IFormlet<_T1, _M2>;
                Deletable<_M1>(formlet: __ABBREV.__Base.IFormlet<_T1, __ABBREV.__WebSharper.OptionProxy<_M1>>): __ABBREV.__Base.IFormlet<_T1, __ABBREV.__WebSharper.OptionProxy<_M1>>;
                WithCancelation<_M1>(formlet: __ABBREV.__Base.IFormlet<_T1, _M1>, cancelFormlet: __ABBREV.__Base.IFormlet<_T1, void>): __ABBREV.__Base.IFormlet<_T1, __ABBREV.__WebSharper.OptionProxy<_M1>>;
                Bind<_M1, _M2>(formlet: __ABBREV.__Base.IFormlet<_T1, _M1>, f: {
                    (x: _M1): __ABBREV.__Base.IFormlet<_T1, _M2>;
                }): __ABBREV.__Base.IFormlet<_T1, _M2>;
                Delay<_M1>(f: {
                    (): __ABBREV.__Base.IFormlet<_T1, _M1>;
                }): __ABBREV.__Base.IFormlet<_T1, _M1>;
                Sequence<_M1, _M2>(fs: __ABBREV.__WebSharper.seq<__ABBREV.__Base.IFormlet<_T1, _M2>>): __ABBREV.__Base.IFormlet<_T1, __ABBREV.__List.T<_M2>>;
                LiftResult<_M1>(formlet: __ABBREV.__Base.IFormlet<_T1, _M1>): __ABBREV.__Base.IFormlet<_T1, __ABBREV.__Base.Result<_M1>>;
                WithNotification<_M1>(notify: {
                    (x: __ABBREV.__WebSharper.ObjectProxy): void;
                }, formlet: __ABBREV.__Base.IFormlet<_T1, _M1>): __ABBREV.__Base.IFormlet<_T1, _M1>;
                BindWith<_M1, _M2>(hF: {
                    (x: _T1): {
                        (x: _T1): _T1;
                    };
                }, formlet: __ABBREV.__Base.IFormlet<_T1, _M1>, f: {
                    (x: _M1): __ABBREV.__Base.IFormlet<_T1, _M2>;
                }): __ABBREV.__Base.IFormlet<_T1, _M2>;
            }
            interface FormletBuilder<_T1> {
                Return<_M1>(x: _M1): __ABBREV.__Base.IFormlet<_T1, _M1>;
                Bind<_M1, _M2>(x: __ABBREV.__Base.IFormlet<_T1, _M1>, f: {
                    (x: _M1): __ABBREV.__Base.IFormlet<_T1, _M2>;
                }): __ABBREV.__Base.IFormlet<_T1, _M2>;
                Delay<_M1>(f: {
                    (): __ABBREV.__Base.IFormlet<_T1, _M1>;
                }): __ABBREV.__Base.IFormlet<_T1, _M1>;
                ReturnFrom<_M1>(f: _M1): _M1;
            }
            interface IValidatorProvider {
                Matches(x0: string, x1: string): boolean;
            }
            interface Validator {
                Validate<_M1, _M2, _M3>(f: {
                    (x: _M2): boolean;
                }, msg: string, flet: _M3): _M3;
                Is<_M1, _M2, _M3>(f: {
                    (x: _M1): boolean;
                }, m: string, flet: _M2): _M2;
                IsNotEmpty<_M1, _M2>(msg: string, flet: _M2): _M2;
                IsRegexMatch<_M1, _M2>(regex: string, msg: string, flet: _M1): _M1;
                IsEmail<_M1, _M2>(msg: string): {
                    (x: _M1): _M1;
                };
                IsInt<_M1, _M2>(msg: string): {
                    (x: _M1): _M1;
                };
                IsFloat<_M1, _M2>(msg: string): {
                    (x: _M1): _M1;
                };
                IsTrue<_M1, _M2>(msg: string, flet: _M1): _M1;
                IsGreaterThan<_M1, _M2, _M3>(min: _M1, msg: string, flet: _M2): _M2;
                IsLessThan<_M1, _M2, _M3>(max: _M1, msg: string, flet: _M2): _M2;
                IsEqual<_M1, _M2, _M3>(value: _M1, msg: string, flet: _M2): _M2;
                IsNotEqual<_M1, _M2, _M3>(value: _M1, msg: string, flet: _M2): _M2;
            }
        }
    }
}
declare module __ABBREV {
    
    export import __WebSharper = IntelliFactory.WebSharper;
    export import __Tree = IntelliFactory.Formlet.Base.Tree;
    export import __Base = IntelliFactory.Formlet.Base;
    export import __List = IntelliFactory.WebSharper.List;
    export import __Control = IntelliFactory.WebSharper.Control;
    export import __Reactive = IntelliFactory.Reactive;
}
