declare module IntelliFactory {
    module WebSharper {
        module Testing {
            module Assert {
                var Raises : {
                    <_M1>(f: {
                        (): void;
                    }): void;
                };
                var For : {
                    <_M1>(times: number, gen: any, attempt: {
                        (x: _M1): void;
                    }): void;
                };
            }
            module Random {
                interface Generator<_T1> {
                    Base: _T1[];
                    Next: {
                        (): _T1;
                    };
                }
                var Map : {
                    <_M1, _M2>(f: {
                        (x: _M1): _M2;
                    }, gen: any): any;
                };
                var Implies : {
                    (a: boolean, b: boolean): boolean;
                };
                var Imply : {
                    (a: boolean, b: boolean): boolean;
                };
                var Exponential : {
                    (lambda: number): any;
                };
                var Within : {
                    (low: number, hi: number): any;
                };
                var FloatWithin : {
                    (low: number, hi: number): any;
                };
                var ArrayOf : {
                    <_M1>(generator: any): any;
                };
                var ListOf : {
                    <_M1>(generator: any): any;
                };
                var Tuple2Of : {
                    <_M1, _M2>(a: any, b: any): any;
                };
                var Tuple3Of : {
                    <_M1, _M2, _M3>(a: any, b: any, c: any): any;
                };
                var OneOf : {
                    <_M1>(seeds: _M1[]): any;
                };
                var Mix : {
                    <_M1>(a: any, b: any): any;
                };
                var Const : {
                    <_M1>(x: _M1): any;
                };
                var OptionOf : {
                    <_M1>(generator: any): any;
                };
                var StandardUniform : {
                    (): any;
                };
                var Boolean : {
                    (): any;
                };
                var Float : {
                    (): any;
                };
                var FloatExhaustive : {
                    (): any;
                };
                var Int : {
                    (): any;
                };
                var Natural : {
                    (): any;
                };
                var String : {
                    (): any;
                };
                var StringExhaustive : {
                    (): any;
                };
            }
            module Pervasives {
                interface TestBuilder {
                    Delay(f: {
                        (): void;
                    }): void;
                    Zero(): void;
                }
                var Test : {
                    (name: string): __ABBREV.__Pervasives.TestBuilder;
                };
                var Is : {
                    <_M1>(a: _M1, b: _M1): void;
                };
                var Isnt : {
                    <_M1>(a: _M1, b: _M1): void;
                };
            }
        }
    }
}
declare module __ABBREV {
    
    export import __Pervasives = IntelliFactory.WebSharper.Testing.Pervasives;
}
