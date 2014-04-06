declare module IntelliFactory {
    module Reactive {
        module HotStream {
            var New1 : {
                (): __ABBREV.__Reactive.HotStream<any>;
            };
            var New : {
                <_M1>(x: any): __ABBREV.__Reactive.HotStream<any>;
            };
        }
        module Reactive {
            var Return : {
                <_M1>(x: _M1): __ABBREV.__Control.IObservableProxy<_M1>;
            };
            var Never : {
                <_M1>(): __ABBREV.__Control.IObservableProxy<_M1>;
            };
            var Select : {
                <_M1, _M2>(io: __ABBREV.__Control.IObservableProxy<_M1>, f: {
                    (x: _M1): _M2;
                }): __ABBREV.__Control.IObservableProxy<_M2>;
            };
            var Where : {
                <_M1>(io: __ABBREV.__Control.IObservableProxy<_M1>, f: {
                    (x: _M1): boolean;
                }): __ABBREV.__Control.IObservableProxy<_M1>;
            };
            var Choose : {
                <_M1, _M2>(io: __ABBREV.__Control.IObservableProxy<_M1>, f: {
                    (x: _M1): __ABBREV.__WebSharper.OptionProxy<_M2>;
                }): __ABBREV.__Control.IObservableProxy<_M2>;
            };
            var Drop : {
                <_M1>(io: __ABBREV.__Control.IObservableProxy<_M1>, count: number): __ABBREV.__Control.IObservableProxy<_M1>;
            };
            var Merge : {
                <_M1>(io1: __ABBREV.__Control.IObservableProxy<_M1>, io2: __ABBREV.__Control.IObservableProxy<_M1>): __ABBREV.__Control.IObservableProxy<_M1>;
            };
            var Concat : {
                <_M1>(io1: __ABBREV.__Control.IObservableProxy<_M1>, io2: __ABBREV.__Control.IObservableProxy<_M1>): __ABBREV.__Control.IObservableProxy<_M1>;
            };
            var Range : {
                (start: number, count: number): __ABBREV.__Control.IObservableProxy<number>;
            };
            var CombineLatest : {
                <_M1, _M2, _M3>(io1: __ABBREV.__Control.IObservableProxy<_M1>, io2: __ABBREV.__Control.IObservableProxy<_M2>, f: {
                    (x: _M1): {
                        (x: _M2): _M3;
                    };
                }): __ABBREV.__Control.IObservableProxy<_M3>;
            };
            var Switch : {
                <_M1>(io: __ABBREV.__Control.IObservableProxy<__ABBREV.__Control.IObservableProxy<_M1>>): __ABBREV.__Control.IObservableProxy<_M1>;
            };
            var SelectMany : {
                <_M1>(io: __ABBREV.__Control.IObservableProxy<__ABBREV.__Control.IObservableProxy<_M1>>): __ABBREV.__Control.IObservableProxy<_M1>;
            };
            var Aggregate : {
                <_M1, _M2>(io: __ABBREV.__Control.IObservableProxy<_M1>, seed: _M2, acc: {
                    (x: _M2): {
                        (x: _M1): _M2;
                    };
                }): __ABBREV.__Control.IObservableProxy<_M2>;
            };
            var CollectLatest : {
                <_M1>(outer: __ABBREV.__Control.IObservableProxy<__ABBREV.__Control.IObservableProxy<_M1>>): __ABBREV.__Control.IObservableProxy<__ABBREV.__WebSharper.seq<_M1>>;
            };
            var Sequence : {
                <_M1>(ios: __ABBREV.__WebSharper.seq<__ABBREV.__Control.IObservableProxy<_M1>>): __ABBREV.__Control.IObservableProxy<__ABBREV.__WebSharper.seq<_M1>>;
            };
            var Heat : {
                <_M1>(io: __ABBREV.__Control.IObservableProxy<_M1>): __ABBREV.__Control.IObservableProxy<_M1>;
            };
            var Default : {
                (): __ABBREV.__Reactive.IReactive;
            };
        }
        interface IReactive {
            Return<_M1>(x0: _M1): __ABBREV.__Control.IObservableProxy<_M1>;
            Never<_M1>(): __ABBREV.__Control.IObservableProxy<_M1>;
            Select<_M1, _M2>(x0: __ABBREV.__Control.IObservableProxy<_M1>, x1: {
                (x: _M1): _M2;
            }): __ABBREV.__Control.IObservableProxy<_M2>;
            Concat<_M1>(x0: __ABBREV.__Control.IObservableProxy<_M1>, x1: __ABBREV.__Control.IObservableProxy<_M1>): __ABBREV.__Control.IObservableProxy<_M1>;
            Merge<_M1>(x0: __ABBREV.__Control.IObservableProxy<_M1>, x1: __ABBREV.__Control.IObservableProxy<_M1>): __ABBREV.__Control.IObservableProxy<_M1>;
            Switch<_M1>(x0: __ABBREV.__Control.IObservableProxy<__ABBREV.__Control.IObservableProxy<_M1>>): __ABBREV.__Control.IObservableProxy<_M1>;
            SelectMany<_M1>(x0: __ABBREV.__Control.IObservableProxy<__ABBREV.__Control.IObservableProxy<_M1>>): __ABBREV.__Control.IObservableProxy<_M1>;
            CollectLatest<_M1>(x0: __ABBREV.__Control.IObservableProxy<__ABBREV.__Control.IObservableProxy<_M1>>): __ABBREV.__Control.IObservableProxy<__ABBREV.__WebSharper.seq<_M1>>;
            CombineLatest<_M1, _M2, _M3>(x0: __ABBREV.__Control.IObservableProxy<_M1>, x1: __ABBREV.__Control.IObservableProxy<_M2>, x2: {
                (x: _M1): {
                    (x: _M2): _M3;
                };
            }): __ABBREV.__Control.IObservableProxy<_M3>;
            Heat<_M1>(x0: __ABBREV.__Control.IObservableProxy<_M1>): __ABBREV.__Control.IObservableProxy<_M1>;
            Aggregate<_M1, _M2>(x0: __ABBREV.__Control.IObservableProxy<_M1>, x1: _M2, x2: {
                (x: _M2): {
                    (x: _M1): _M2;
                };
            }): __ABBREV.__Control.IObservableProxy<_M2>;
            Choose<_M1, _M2>(x0: __ABBREV.__Control.IObservableProxy<_M1>, x1: {
                (x: _M1): __ABBREV.__WebSharper.OptionProxy<_M2>;
            }): __ABBREV.__Control.IObservableProxy<_M2>;
            Where<_M1>(x0: __ABBREV.__Control.IObservableProxy<_M1>, x1: {
                (x: _M1): boolean;
            }): __ABBREV.__Control.IObservableProxy<_M1>;
            Drop<_M1>(x0: __ABBREV.__Control.IObservableProxy<_M1>, x1: number): __ABBREV.__Control.IObservableProxy<_M1>;
            Sequence<_M1>(x0: __ABBREV.__WebSharper.seq<__ABBREV.__Control.IObservableProxy<_M1>>): __ABBREV.__Control.IObservableProxy<__ABBREV.__WebSharper.seq<_M1>>;
        }
        interface HotStream<_T1> {
            Trigger(v: _T1): void;
            Subscribe(o: __ABBREV.__Control.IObserverProxy<_T1>): __ABBREV.__WebSharper.IDisposableProxy;
            Latest: __ABBREV.__WebSharper.ref<__ABBREV.__WebSharper.OptionProxy<_T1>>;
            Event: __ABBREV.__Control.FSharpEvent<_T1>;
        }
    }
}
declare module __ABBREV {
    
    export import __Reactive = IntelliFactory.Reactive;
    export import __Control = IntelliFactory.WebSharper.Control;
    export import __WebSharper = IntelliFactory.WebSharper;
}
