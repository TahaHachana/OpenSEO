declare module IntelliFactory {
    module WebSharper {
        module Char {
            var GetNumericValue : {
                (c: number): number;
            };
            var IsControl : {
                (c: number): boolean;
            };
            var IsDigit : {
                (c: number): boolean;
            };
            var IsLetter : {
                (c: number): boolean;
            };
            var IsLetterOrDigit : {
                (c: number): boolean;
            };
            var IsLower : {
                (c: number): boolean;
            };
            var IsUpper : {
                (c: number): boolean;
            };
        }
        module Arrays {
            var reverse : {
                (array: __ABBREV.__WebSharper.ArrayProxy, offset: number, length: number): void;
            };
            var checkRange : {
                <_M1>(arr: _M1[], start: number, size: number): void;
            };
            var checkLength : {
                <_M1, _M2>(arr1: _M1[], arr2: _M2[]): void;
            };
            var average : {
                <_M1>(arr: _M1[]): _M1;
            };
            var averageBy : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, arr: _M1[]): _M2;
            };
            var blit : {
                <_M1>(arr1: _M1[], start1: number, arr2: _M1[], start2: number, length: number): void;
            };
            var choose : {
                <_M1, _M2>(f: {
                    (x: _M1): __ABBREV.__WebSharper.OptionProxy<_M2>;
                }, arr: _M1[]): _M2[];
            };
            var collect : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2[];
                }, x: _M1[]): _M2[];
            };
            var concat : {
                <_M1>(xs: __ABBREV.__WebSharper.seq<_M1[]>): _M1[];
            };
            var create : {
                <_M1>(size: number, value: _M1): _M1[];
            };
            var exists2 : {
                <_M1, _M2>(f: {
                    (x: _M1): {
                        (x: _M2): boolean;
                    };
                }, arr1: _M1[], arr2: _M2[]): boolean;
            };
            var fill : {
                <_M1>(arr: _M1[], start: number, length: number, value: _M1): void;
            };
            var filter : {
                <_M1>(f: {
                    (x: _M1): boolean;
                }, arr: _M1[]): _M1[];
            };
            var Find : {
                <_M1>(f: {
                    (x: _M1): boolean;
                }, arr: _M1[]): _M1;
            };
            var FindIndex : {
                <_M1>(f: {
                    (x: _M1): boolean;
                }, arr: _M1[]): number;
            };
            var fold : {
                <_M1, _M2>(f: {
                    (x: _M2): {
                        (x: _M1): _M2;
                    };
                }, zero: _M2, arr: _M1[]): _M2;
            };
            var fold2 : {
                <_M1, _M2, _M3>(f: {
                    (x: _M3): {
                        (x: _M1): {
                            (x: _M2): _M3;
                        };
                    };
                }, zero: _M3, arr1: _M1[], arr2: _M2[]): _M3;
            };
            var foldBack : {
                <_M1, _M2>(f: {
                    (x: _M1): {
                        (x: _M2): _M2;
                    };
                }, arr: _M1[], zero: _M2): _M2;
            };
            var foldBack2 : {
                <_M1, _M2, _M3>(f: {
                    (x: _M1): {
                        (x: _M2): {
                            (x: _M3): _M3;
                        };
                    };
                }, arr1: _M1[], arr2: _M2[], zero: _M3): _M3;
            };
            var forall2 : {
                <_M1, _M2>(f: {
                    (x: _M1): {
                        (x: _M2): boolean;
                    };
                }, arr1: _M1[], arr2: _M2[]): boolean;
            };
            var init : {
                <_M1>(size: number, f: {
                    (x: number): _M1;
                }): _M1[];
            };
            var iter : {
                <_M1>(f: {
                    (x: _M1): void;
                }, arr: _M1[]): void;
            };
            var iter2 : {
                <_M1, _M2>(f: {
                    (x: _M1): {
                        (x: _M2): void;
                    };
                }, arr1: _M1[], arr2: _M2[]): void;
            };
            var iteri : {
                <_M1>(f: {
                    (x: number): {
                        (x: _M1): void;
                    };
                }, arr: _M1[]): void;
            };
            var iteri2 : {
                <_M1, _M2>(f: {
                    (x: number): {
                        (x: _M1): {
                            (x: _M2): void;
                        };
                    };
                }, arr1: _M1[], arr2: _M2[]): void;
            };
            var map : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, arr: _M1[]): _M2[];
            };
            var map2 : {
                <_M1, _M2, _M3>(f: {
                    (x: _M1): {
                        (x: _M2): _M3;
                    };
                }, arr1: _M1[], arr2: _M2[]): _M3[];
            };
            var mapi : {
                <_M1, _M2>(f: {
                    (x: number): {
                        (x: _M1): _M2;
                    };
                }, arr: _M1[]): _M2[];
            };
            var mapi2 : {
                <_M1, _M2, _M3>(f: {
                    (x: number): {
                        (x: _M1): {
                            (x: _M2): _M3;
                        };
                    };
                }, arr1: _M1[], arr2: _M2[]): _M3[];
            };
            var max : {
                <_M1>(x: _M1[]): _M1;
            };
            var maxBy : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, arr: _M1[]): _M1;
            };
            var min : {
                <_M1>(x: _M1[]): _M1;
            };
            var minBy : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, arr: _M1[]): _M1;
            };
            var ofSeq : {
                <_M1>(xs: __ABBREV.__WebSharper.seq<_M1>): _M1[];
            };
            var partition : {
                <_M1>(f: {
                    (x: _M1): boolean;
                }, arr: _M1[]): any;
            };
            var permute : {
                <_M1>(f: {
                    (x: number): number;
                }, arr: _M1[]): _M1[];
            };
            var Pick : {
                <_M1, _M2>(f: {
                    (x: _M1): __ABBREV.__WebSharper.OptionProxy<_M2>;
                }, arr: _M1[]): _M2;
            };
            var nonEmpty : {
                <_M1>(arr: _M1[]): void;
            };
            var reduce : {
                <_M1>(f: {
                    (x: _M1): {
                        (x: _M1): _M1;
                    };
                }, arr: _M1[]): _M1;
            };
            var reduceBack : {
                <_M1>(f: {
                    (x: _M1): {
                        (x: _M1): _M1;
                    };
                }, arr: _M1[]): _M1;
            };
            var scan : {
                <_M1, _M2>(f: {
                    (x: _M2): {
                        (x: _M1): _M2;
                    };
                }, zero: _M2, arr: _M1[]): _M2[];
            };
            var scanBack : {
                <_M1, _M2>(f: {
                    (x: _M1): {
                        (x: _M2): _M2;
                    };
                }, arr: _M1[], zero: _M2): _M2[];
            };
            var sort : {
                <_M1>(arr: _M1[]): _M1[];
            };
            var sortBy : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, arr: _M1[]): _M1[];
            };
            var sortInPlace : {
                <_M1>(arr: _M1[]): void;
            };
            var sortInPlaceBy : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, arr: _M1[]): void;
            };
            var sortInPlaceWith : {
                <_M1>(comparer: {
                    (x: _M1): {
                        (x: _M1): number;
                    };
                }, arr: _M1[]): void;
            };
            var sortWith : {
                <_M1>(comparer: {
                    (x: _M1): {
                        (x: _M1): number;
                    };
                }, arr: _M1[]): _M1[];
            };
            var sub : {
                <_M1>(arr: _M1[], start: number, length: number): _M1[];
            };
            var tryFind : {
                <_M1>(f: {
                    (x: _M1): boolean;
                }, arr: _M1[]): __ABBREV.__WebSharper.OptionProxy<_M1>;
            };
            var tryFindIndex : {
                <_M1>(f: {
                    (x: _M1): boolean;
                }, arr: _M1[]): __ABBREV.__WebSharper.OptionProxy<number>;
            };
            var tryPick : {
                <_M1, _M2>(f: {
                    (x: _M1): __ABBREV.__WebSharper.OptionProxy<_M2>;
                }, arr: _M1[]): __ABBREV.__WebSharper.OptionProxy<_M2>;
            };
            var unzip : {
                <_M1, _M2>(arr: any[]): any;
            };
            var unzip3 : {
                <_M1, _M2, _M3>(arr: any[]): any;
            };
            var zip : {
                <_M1, _M2>(arr1: _M1[], arr2: _M2[]): any[];
            };
            var zip3 : {
                <_M1, _M2, _M3>(arr1: _M1[], arr2: _M2[], arr3: _M3[]): any[];
            };
        }
        module List {
            module T {
                var Construct : {
                    (head: any, tail: __ABBREV.__List.T<any>): __ABBREV.__List.T<any>;
                };
                var get_Nil : {
                    (): __ABBREV.__List.T<any>;
                };
            }
            interface T<_T1> {
                GetEnumerator(): __ABBREV.__WebSharper.IEnumeratorProxy<_T1>;
                get_Length(): number;
                get_Item(x: number): _T1;
            }
            var append : {
                <_M1>(x: __ABBREV.__List.T<_M1>, y: __ABBREV.__List.T<_M1>): __ABBREV.__List.T<_M1>;
            };
            var choose : {
                <_M1, _M2>(f: {
                    (x: _M1): __ABBREV.__WebSharper.OptionProxy<_M2>;
                }, l: __ABBREV.__List.T<_M1>): __ABBREV.__List.T<_M2>;
            };
            var collect : {
                <_M1, _M2>(f: {
                    (x: _M1): __ABBREV.__List.T<_M2>;
                }, l: __ABBREV.__List.T<_M1>): __ABBREV.__List.T<_M2>;
            };
            var concat : {
                <_M1>(s: __ABBREV.__WebSharper.seq<__ABBREV.__List.T<_M1>>): __ABBREV.__List.T<_M1>;
            };
            var exists2 : {
                <_M1, _M2>(p: {
                    (x: _M1): {
                        (x: _M2): boolean;
                    };
                }, l1: __ABBREV.__List.T<_M1>, l2: __ABBREV.__List.T<_M2>): boolean;
            };
            var filter : {
                <_M1>(p: {
                    (x: _M1): boolean;
                }, l: __ABBREV.__List.T<_M1>): __ABBREV.__List.T<_M1>;
            };
            var fold2 : {
                <_M1, _M2, _M3>(f: {
                    (x: _M3): {
                        (x: _M1): {
                            (x: _M2): _M3;
                        };
                    };
                }, s: _M3, l1: __ABBREV.__List.T<_M1>, l2: __ABBREV.__List.T<_M2>): _M3;
            };
            var foldBack : {
                <_M1, _M2>(f: {
                    (x: _M1): {
                        (x: _M2): _M2;
                    };
                }, l: __ABBREV.__List.T<_M1>, s: _M2): _M2;
            };
            var foldBack2 : {
                <_M1, _M2, _M3>(f: {
                    (x: _M1): {
                        (x: _M2): {
                            (x: _M3): _M3;
                        };
                    };
                }, l1: __ABBREV.__List.T<_M1>, l2: __ABBREV.__List.T<_M2>, s: _M3): _M3;
            };
            var forall2 : {
                <_M1, _M2>(p: {
                    (x: _M1): {
                        (x: _M2): boolean;
                    };
                }, l1: __ABBREV.__List.T<_M1>, l2: __ABBREV.__List.T<_M2>): boolean;
            };
            var init : {
                <_M1>(s: number, f: {
                    (x: number): _M1;
                }): __ABBREV.__List.T<_M1>;
            };
            var iter2 : {
                <_M1, _M2>(f: {
                    (x: _M1): {
                        (x: _M2): void;
                    };
                }, l1: __ABBREV.__List.T<_M1>, l2: __ABBREV.__List.T<_M2>): void;
            };
            var iteri2 : {
                <_M1, _M2>(f: {
                    (x: number): {
                        (x: _M1): {
                            (x: _M2): void;
                        };
                    };
                }, l1: __ABBREV.__List.T<_M1>, l2: __ABBREV.__List.T<_M2>): void;
            };
            var map : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, l: __ABBREV.__List.T<_M1>): __ABBREV.__List.T<_M2>;
            };
            var map2 : {
                <_M1, _M2, _M3>(f: {
                    (x: _M1): {
                        (x: _M2): _M3;
                    };
                }, l1: __ABBREV.__List.T<_M1>, l2: __ABBREV.__List.T<_M2>): __ABBREV.__List.T<_M3>;
            };
            var map3 : {
                <_M1, _M2, _M3, _M4>(f: {
                    (x: _M1): {
                        (x: _M2): {
                            (x: _M3): _M4;
                        };
                    };
                }, l1: __ABBREV.__List.T<_M1>, l2: __ABBREV.__List.T<_M2>, l3: __ABBREV.__List.T<_M3>): __ABBREV.__List.T<_M4>;
            };
            var mapi : {
                <_M1, _M2>(f: {
                    (x: number): {
                        (x: _M1): _M2;
                    };
                }, l: __ABBREV.__List.T<_M1>): __ABBREV.__List.T<_M2>;
            };
            var mapi2 : {
                <_M1, _M2, _M3>(f: {
                    (x: number): {
                        (x: _M1): {
                            (x: _M2): _M3;
                        };
                    };
                }, l1: __ABBREV.__List.T<_M1>, l2: __ABBREV.__List.T<_M2>): __ABBREV.__List.T<_M3>;
            };
            var max : {
                <_M1>(l: __ABBREV.__List.T<_M1>): _M1;
            };
            var maxBy : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, l: __ABBREV.__List.T<_M1>): _M1;
            };
            var min : {
                <_M1>(l: __ABBREV.__List.T<_M1>): _M1;
            };
            var minBy : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, l: __ABBREV.__List.T<_M1>): _M1;
            };
            var ofArray : {
                <_M1>(arr: _M1[]): __ABBREV.__List.T<_M1>;
            };
            var ofSeq : {
                <_M1, _M2>(s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__List.T<_M2>;
            };
            var partition : {
                <_M1>(p: {
                    (x: _M1): boolean;
                }, l: __ABBREV.__List.T<_M1>): any;
            };
            var permute : {
                <_M1>(f: {
                    (x: number): number;
                }, l: __ABBREV.__List.T<_M1>): __ABBREV.__List.T<_M1>;
            };
            var reduceBack : {
                <_M1>(f: {
                    (x: _M1): {
                        (x: _M1): _M1;
                    };
                }, l: __ABBREV.__List.T<_M1>): _M1;
            };
            var replicate : {
                <_M1>(size: number, value: _M1): __ABBREV.__List.T<_M1>;
            };
            var rev : {
                <_M1>(l: __ABBREV.__List.T<_M1>): __ABBREV.__List.T<_M1>;
            };
            var scan : {
                <_M1, _M2>(f: {
                    (x: _M2): {
                        (x: _M1): _M2;
                    };
                }, s: _M2, l: __ABBREV.__List.T<_M1>): __ABBREV.__List.T<_M2>;
            };
            var scanBack : {
                <_M1, _M2>(f: {
                    (x: _M1): {
                        (x: _M2): _M2;
                    };
                }, l: __ABBREV.__List.T<_M1>, s: _M2): __ABBREV.__List.T<_M2>;
            };
            var sort : {
                <_M1>(l: __ABBREV.__List.T<_M1>): __ABBREV.__List.T<_M1>;
            };
            var sortBy : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, l: __ABBREV.__List.T<_M1>): __ABBREV.__List.T<_M1>;
            };
            var sortWith : {
                <_M1>(f: {
                    (x: _M1): {
                        (x: _M1): number;
                    };
                }, l: __ABBREV.__List.T<_M1>): __ABBREV.__List.T<_M1>;
            };
            var unzip : {
                <_M1, _M2>(l: __ABBREV.__List.T<any>): any;
            };
            var unzip3 : {
                <_M1, _M2, _M3>(l: __ABBREV.__List.T<any>): any;
            };
            var zip : {
                <_M1, _M2>(l1: __ABBREV.__List.T<_M1>, l2: __ABBREV.__List.T<_M2>): __ABBREV.__List.T<any>;
            };
            var zip3 : {
                <_M1, _M2, _M3>(l1: __ABBREV.__List.T<_M1>, l2: __ABBREV.__List.T<_M2>, l3: __ABBREV.__List.T<_M3>): __ABBREV.__List.T<any>;
            };
        }
        module Unchecked {
            var compareArrays : {
                (a: __ABBREV.__WebSharper.ObjectProxy[], b: __ABBREV.__WebSharper.ObjectProxy[]): number;
            };
            var Compare : {
                <_M1>(a: _M1, b: _M1): number;
            };
            var arrayEquals : {
                (a: __ABBREV.__WebSharper.ObjectProxy[], b: __ABBREV.__WebSharper.ObjectProxy[]): boolean;
            };
            var Equals : {
                <_M1>(a: _M1, b: _M1): boolean;
            };
            var hashMix : {
                (x: number, y: number): number;
            };
            var hashArray : {
                (o: __ABBREV.__WebSharper.ObjectProxy[]): number;
            };
            var hashString : {
                (s: string): number;
            };
            var hashObject : {
                (o: __ABBREV.__WebSharper.ObjectProxy): number;
            };
            var Hash : {
                <_M1>(o: _M1): number;
            };
        }
        module Strings {
            interface StringProxy {
            }
            var Compare : {
                (x: string, y: string): number;
            };
            var CopyTo : {
                (s: string, o: number, d: number[], off: number, ct: number): void;
            };
            var PadLeft : {
                (s: string, n: number): string;
            };
            var PadRight : {
                (s: string, n: number): string;
            };
            var Replace : {
                (subject: string, search: string, replace: string): string;
            };
            var ReplaceChar : {
                (s: string, oldC: number, newC: number): string;
            };
            var ToCharArray : {
                (s: string): number[];
            };
            var ToCharArrayRange : {
                (s: string, startIndex: number, length: number): number[];
            };
            var Split : {
                (s: string, pat: __ABBREV.__WebSharper.ObjectProxy, opts: any): string[];
            };
            var SplitChars : {
                (s: string, sep: number[], opts: any): string[];
            };
            var SplitStrings : {
                (s: string, sep: string[], opts: any): string[];
            };
            var protect : {
                (s: string): string;
            };
            var collect : {
                (f: {
                    (x: number): string;
                }, s: string): string;
            };
            var concat : {
                (separator: string, strings: __ABBREV.__WebSharper.seq<string>): string;
            };
            var exists : {
                (f: {
                    (x: number): boolean;
                }, s: string): boolean;
            };
            var forall : {
                (f: {
                    (x: number): boolean;
                }, s: string): boolean;
            };
            var init : {
                (count: number, f: {
                    (x: number): string;
                }): string;
            };
            var iter : {
                (f: {
                    (x: number): void;
                }, s: string): void;
            };
            var iteri : {
                (f: {
                    (x: number): {
                        (x: number): void;
                    };
                }, s: string): void;
            };
            var length : {
                (s: string): number;
            };
            var map : {
                (f: {
                    (x: number): number;
                }, s: string): string;
            };
            var mapi : {
                (f: {
                    (x: number): {
                        (x: number): number;
                    };
                }, s: string): string;
            };
            var replicate : {
                (count: number, s: string): string;
            };
        }
        module Stack {
            interface StackProxy<_T1> {
            }
        }
        module Seq {
            var insufficient : {
                <_M1>(): _M1;
            };
            var append : {
                <_M1>(s1: __ABBREV.__WebSharper.seq<_M1>, s2: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M1>;
            };
            var average : {
                <_M1>(s: __ABBREV.__WebSharper.seq<_M1>): _M1;
            };
            var averageBy : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, s: __ABBREV.__WebSharper.seq<_M1>): _M2;
            };
            var cache : {
                <_M1>(s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M1>;
            };
            var choose : {
                <_M1, _M2>(f: {
                    (x: _M1): __ABBREV.__WebSharper.OptionProxy<_M2>;
                }, s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M2>;
            };
            var collect : {
                <_M1, _M2, _M3>(f: {
                    (x: _M1): _M2;
                }, s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M3>;
            };
            var compareWith : {
                <_M1>(f: {
                    (x: _M1): {
                        (x: _M1): number;
                    };
                }, s1: __ABBREV.__WebSharper.seq<_M1>, s2: __ABBREV.__WebSharper.seq<_M1>): number;
            };
            var concat : {
                <_M1, _M2>(ss: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M2>;
            };
            var countBy : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<any>;
            };
            var delay : {
                <_M1>(f: {
                    (): __ABBREV.__WebSharper.seq<_M1>;
                }): __ABBREV.__WebSharper.seq<_M1>;
            };
            var distinct : {
                <_M1>(s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M1>;
            };
            var distinctBy : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M1>;
            };
            var empty : {
                <_M1>(): __ABBREV.__WebSharper.seq<_M1>;
            };
            var exists : {
                <_M1, _M2>(p: {
                    (x: _M1): boolean;
                }, s: __ABBREV.__WebSharper.seq<_M2>): boolean;
            };
            var exists2 : {
                <_M1, _M2, _M3, _M4>(p: {
                    (x: _M1): {
                        (x: _M2): boolean;
                    };
                }, s1: __ABBREV.__WebSharper.seq<_M3>, s2: __ABBREV.__WebSharper.seq<_M4>): boolean;
            };
            var filter : {
                <_M1>(f: {
                    (x: _M1): boolean;
                }, s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M1>;
            };
            var find : {
                <_M1>(p: {
                    (x: _M1): boolean;
                }, s: __ABBREV.__WebSharper.seq<_M1>): _M1;
            };
            var findIndex : {
                <_M1>(p: {
                    (x: _M1): boolean;
                }, s: __ABBREV.__WebSharper.seq<_M1>): number;
            };
            var fold : {
                <_M1, _M2>(f: {
                    (x: _M2): {
                        (x: _M1): _M2;
                    };
                }, x: _M2, s: __ABBREV.__WebSharper.seq<_M1>): _M2;
            };
            var forall : {
                <_M1>(p: {
                    (x: _M1): boolean;
                }, s: __ABBREV.__WebSharper.seq<_M1>): boolean;
            };
            var forall2 : {
                <_M1, _M2>(p: {
                    (x: _M1): {
                        (x: _M2): boolean;
                    };
                }, s1: __ABBREV.__WebSharper.seq<_M1>, s2: __ABBREV.__WebSharper.seq<_M2>): boolean;
            };
            var groupBy : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<any>;
            };
            var head : {
                <_M1>(s: __ABBREV.__WebSharper.seq<_M1>): _M1;
            };
            var init : {
                <_M1>(n: number, f: {
                    (x: number): _M1;
                }): __ABBREV.__WebSharper.seq<_M1>;
            };
            var initInfinite : {
                <_M1>(f: {
                    (x: number): _M1;
                }): __ABBREV.__WebSharper.seq<_M1>;
            };
            var isEmpty : {
                <_M1>(s: __ABBREV.__WebSharper.seq<_M1>): boolean;
            };
            var iter : {
                <_M1>(p: {
                    (x: _M1): void;
                }, s: __ABBREV.__WebSharper.seq<_M1>): void;
            };
            var iter2 : {
                <_M1, _M2, _M3, _M4>(p: {
                    (x: _M1): {
                        (x: _M2): void;
                    };
                }, s1: __ABBREV.__WebSharper.seq<_M3>, s2: __ABBREV.__WebSharper.seq<_M4>): void;
            };
            var iteri : {
                <_M1, _M2>(p: {
                    (x: number): {
                        (x: _M1): void;
                    };
                }, s: __ABBREV.__WebSharper.seq<_M2>): void;
            };
            var length : {
                <_M1>(s: __ABBREV.__WebSharper.seq<_M1>): number;
            };
            var map : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M2>;
            };
            var mapi : {
                <_M1, _M2>(f: {
                    (x: number): {
                        (x: _M1): _M2;
                    };
                }, s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M2>;
            };
            var mapi2 : {
                <_M1, _M2, _M3>(f: {
                    (x: _M1): {
                        (x: _M2): _M3;
                    };
                }, s1: __ABBREV.__WebSharper.seq<_M1>, s2: __ABBREV.__WebSharper.seq<_M2>): __ABBREV.__WebSharper.seq<_M3>;
            };
            var maxBy : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, s: __ABBREV.__WebSharper.seq<_M1>): _M1;
            };
            var minBy : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, s: __ABBREV.__WebSharper.seq<_M1>): _M1;
            };
            var max : {
                <_M1>(s: __ABBREV.__WebSharper.seq<_M1>): _M1;
            };
            var min : {
                <_M1>(s: __ABBREV.__WebSharper.seq<_M1>): _M1;
            };
            var nth : {
                <_M1, _M2>(index: number, s: __ABBREV.__WebSharper.seq<_M1>): _M2;
            };
            var pairwise : {
                <_M1>(s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<any>;
            };
            var pick : {
                <_M1, _M2>(p: {
                    (x: _M1): __ABBREV.__WebSharper.OptionProxy<_M2>;
                }, s: __ABBREV.__WebSharper.seq<_M1>): _M2;
            };
            var readOnly : {
                <_M1>(s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M1>;
            };
            var reduce : {
                <_M1>(f: {
                    (x: _M1): {
                        (x: _M1): _M1;
                    };
                }, source: __ABBREV.__WebSharper.seq<_M1>): _M1;
            };
            var scan : {
                <_M1, _M2>(f: {
                    (x: _M2): {
                        (x: _M1): _M2;
                    };
                }, x: _M2, s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M2>;
            };
            var skip : {
                <_M1>(n: number, s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M1>;
            };
            var skipWhile : {
                <_M1>(f: {
                    (x: _M1): boolean;
                }, s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M1>;
            };
            var sort : {
                <_M1>(s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M1>;
            };
            var sortBy : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M1>;
            };
            var sum : {
                <_M1>(s: __ABBREV.__WebSharper.seq<_M1>): _M1;
            };
            var sumBy : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, s: __ABBREV.__WebSharper.seq<_M1>): _M2;
            };
            var take : {
                <_M1>(n: number, s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M1>;
            };
            var takeWhile : {
                <_M1>(f: {
                    (x: _M1): boolean;
                }, s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M1>;
            };
            var toArray : {
                <_M1>(s: __ABBREV.__WebSharper.seq<_M1>): _M1[];
            };
            var toList : {
                <_M1>(s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__List.T<_M1>;
            };
            var truncate : {
                <_M1>(n: number, s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M1>;
            };
            var tryFind : {
                <_M1, _M2>(ok: {
                    (x: _M1): boolean;
                }, s: __ABBREV.__WebSharper.seq<_M2>): __ABBREV.__WebSharper.OptionProxy<_M1>;
            };
            var tryFindIndex : {
                <_M1, _M2>(ok: {
                    (x: _M1): boolean;
                }, s: __ABBREV.__WebSharper.seq<_M2>): __ABBREV.__WebSharper.OptionProxy<number>;
            };
            var tryPick : {
                <_M1, _M2, _M3>(f: {
                    (x: _M1): __ABBREV.__WebSharper.OptionProxy<_M2>;
                }, s: __ABBREV.__WebSharper.seq<_M3>): __ABBREV.__WebSharper.OptionProxy<_M2>;
            };
            var unfold : {
                <_M1, _M2>(f: {
                    (x: _M1): __ABBREV.__WebSharper.OptionProxy<any>;
                }, s: _M1): __ABBREV.__WebSharper.seq<_M2>;
            };
            var windowed : {
                <_M1>(windowSize: number, s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M1[]>;
            };
            var zip : {
                <_M1, _M2>(s1: __ABBREV.__WebSharper.seq<_M1>, s2: __ABBREV.__WebSharper.seq<_M2>): __ABBREV.__WebSharper.seq<any>;
            };
            var zip3 : {
                <_M1, _M2, _M3>(s1: __ABBREV.__WebSharper.seq<_M1>, s2: __ABBREV.__WebSharper.seq<_M2>, s3: __ABBREV.__WebSharper.seq<_M3>): __ABBREV.__WebSharper.seq<any>;
            };
            var enumFinally : {
                <_M1>(s: __ABBREV.__WebSharper.seq<_M1>, f: {
                    (): void;
                }): __ABBREV.__WebSharper.seq<_M1>;
            };
            var enumUsing : {
                <_M1, _M2, _M3>(x: _M1, f: {
                    (x: _M1): _M2;
                }): __ABBREV.__WebSharper.seq<_M3>;
            };
            var enumWhile : {
                <_M1>(f: {
                    (): boolean;
                }, s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M1>;
            };
        }
        module Queue {
            interface QueueProxy<_T1> {
            }
        }
        module Option {
            var bind : {
                <_M1, _M2>(f: {
                    (x: _M1): __ABBREV.__WebSharper.OptionProxy<_M2>;
                }, x: __ABBREV.__WebSharper.OptionProxy<_M1>): __ABBREV.__WebSharper.OptionProxy<_M2>;
            };
            var exists : {
                <_M1>(p: {
                    (x: _M1): boolean;
                }, x: __ABBREV.__WebSharper.OptionProxy<_M1>): boolean;
            };
            var fold : {
                <_M1, _M2>(f: {
                    (x: _M2): {
                        (x: _M1): _M2;
                    };
                }, s: _M2, x: __ABBREV.__WebSharper.OptionProxy<_M1>): _M2;
            };
            var foldBack : {
                <_M1, _M2>(f: {
                    (x: _M1): {
                        (x: _M2): _M2;
                    };
                }, x: __ABBREV.__WebSharper.OptionProxy<_M1>, s: _M2): _M2;
            };
            var forall : {
                <_M1>(p: {
                    (x: _M1): boolean;
                }, x: __ABBREV.__WebSharper.OptionProxy<_M1>): boolean;
            };
            var iter : {
                <_M1>(p: {
                    (x: _M1): void;
                }, x: __ABBREV.__WebSharper.OptionProxy<_M1>): void;
            };
            var map : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, x: __ABBREV.__WebSharper.OptionProxy<_M1>): __ABBREV.__WebSharper.OptionProxy<_M2>;
            };
            var toArray : {
                <_M1>(x: __ABBREV.__WebSharper.OptionProxy<_M1>): _M1[];
            };
            var toList : {
                <_M1>(x: __ABBREV.__WebSharper.OptionProxy<_M1>): __ABBREV.__List.T<_M1>;
            };
        }
        module OperatorIntrinsics {
            var GetStringSlice : {
                (source: string, start: __ABBREV.__WebSharper.OptionProxy<number>, finish: __ABBREV.__WebSharper.OptionProxy<number>): string;
            };
            var GetArraySlice : {
                <_M1>(source: _M1[], start: __ABBREV.__WebSharper.OptionProxy<number>, finish: __ABBREV.__WebSharper.OptionProxy<number>): _M1[];
            };
            var SetArraySlice : {
                <_M1>(dst: _M1[], start: __ABBREV.__WebSharper.OptionProxy<number>, finish: __ABBREV.__WebSharper.OptionProxy<number>, src: _M1[]): void;
            };
            var GetArraySlice2D : {
                <_M1>(arr: any, start1: __ABBREV.__WebSharper.OptionProxy<number>, finish1: __ABBREV.__WebSharper.OptionProxy<number>, start2: __ABBREV.__WebSharper.OptionProxy<number>, finish2: __ABBREV.__WebSharper.OptionProxy<number>): any;
            };
            var GetArraySlice2DFixed1 : {
                <_M1>(arr: any, fixed1: number, start2: __ABBREV.__WebSharper.OptionProxy<number>, finish2: __ABBREV.__WebSharper.OptionProxy<number>): _M1[];
            };
            var GetArraySlice2DFixed2 : {
                <_M1>(arr: any, start1: __ABBREV.__WebSharper.OptionProxy<number>, finish1: __ABBREV.__WebSharper.OptionProxy<number>, fixed2: number): _M1[];
            };
            var SetArraySlice2DFixed1 : {
                <_M1>(dst: any, fixed1: number, start2: __ABBREV.__WebSharper.OptionProxy<number>, finish2: __ABBREV.__WebSharper.OptionProxy<number>, src: _M1[]): void;
            };
            var SetArraySlice2DFixed2 : {
                <_M1>(dst: any, start1: __ABBREV.__WebSharper.OptionProxy<number>, finish1: __ABBREV.__WebSharper.OptionProxy<number>, fixed2: number, src: _M1[]): void;
            };
            var SetArraySlice2D : {
                <_M1>(dst: any, start1: __ABBREV.__WebSharper.OptionProxy<number>, finish1: __ABBREV.__WebSharper.OptionProxy<number>, start2: __ABBREV.__WebSharper.OptionProxy<number>, finish2: __ABBREV.__WebSharper.OptionProxy<number>, src: any): void;
            };
        }
        module Operators {
            var range : {
                <_M1>(min: _M1, max: _M1): __ABBREV.__WebSharper.seq<_M1>;
            };
            var step : {
                <_M1, _M2>(min: _M1, step: _M2, max: _M1): __ABBREV.__WebSharper.seq<_M1>;
            };
            var Compare : {
                <_M1>(a: _M1, b: _M1): number;
            };
            var Decrement : {
                (x: __ABBREV.__WebSharper.ref<number>): void;
            };
            var DefaultArg : {
                <_M1>(x: __ABBREV.__WebSharper.OptionProxy<_M1>, d: _M1): _M1;
            };
            var FailWith : {
                <_M1>(msg: string): _M1;
            };
            var Increment : {
                (x: __ABBREV.__WebSharper.ref<number>): void;
            };
            var Max : {
                <_M1>(a: _M1, b: _M1): _M1;
            };
            var Min : {
                <_M1>(a: _M1, b: _M1): _M1;
            };
            var Pown : {
                <_M1>(a: _M1, n: number): number;
            };
            var Sign : {
                <_M1>(x: _M1): number;
            };
            var Truncate : {
                <_M1>(x: _M1): _M1;
            };
            var Using : {
                <_M1, _M2>(t: _M1, f: {
                    (x: _M1): _M2;
                }): _M2;
            };
            var KeyValue : {
                <_M1, _M2>(kvp: __ABBREV.__WebSharper.KeyValuePairProxy<_M1, _M2>): any;
            };
        }
        module Lazy {
            var Create : {
                <_M1>(f: {
                    (): _M1;
                }): __ABBREV.__WebSharper.LazyProxy<_M1>;
            };
            var CreateFromValue : {
                <_M1>(v: _M1): __ABBREV.__WebSharper.LazyProxy<_M1>;
            };
            var Force : {
                <_M1>(x: __ABBREV.__WebSharper.LazyProxy<_M1>): _M1;
            };
        }
        module Arrays2D {
            var zeroCreate : {
                <_M1>(n: number, m: number): any;
            };
            var init : {
                <_M1>(n: number, m: number, f: {
                    (x: number): {
                        (x: number): _M1;
                    };
                }): any;
            };
            var iter : {
                <_M1>(f: {
                    (x: _M1): void;
                }, array: any): void;
            };
            var iteri : {
                <_M1>(f: {
                    (x: number): {
                        (x: number): {
                            (x: _M1): void;
                        };
                    };
                }, array: any): void;
            };
            var map : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, array: any): any;
            };
            var mapi : {
                <_M1, _M2>(f: {
                    (x: number): {
                        (x: number): {
                            (x: _M1): _M2;
                        };
                    };
                }, array: any): any;
            };
            var copy : {
                <_M1>(array: any): any;
            };
        }
        module IntrinsicFunctionProxy {
            var GetArraySub : {
                <_M1>(arr: _M1[], start: number, len: number): _M1[];
            };
            var SetArraySub : {
                <_M1>(arr: _M1[], start: number, len: number, src: _M1[]): void;
            };
            var Array2DZeroCreate : {
                <_M1>(n: number, m: number): any;
            };
            var GetArray2DSub : {
                <_M1>(src: any, src1: number, src2: number, len1: number, len2: number): any;
            };
            var SetArray2DSub : {
                <_M1>(dst: any, src1: number, src2: number, len1: number, len2: number, src: any): void;
            };
            var GetLength : {
                <_M1>(arr: __ABBREV.__WebSharper.ArrayProxy): number;
            };
        }
        module ExtraTopLevelOperatorsProxy {
            var array2D : {
                <_M1, _M2>(rows: __ABBREV.__WebSharper.seq<_M1>): any;
            };
        }
        module Util {
            var observer : {
                <_M1>(h: {
                    (x: _M1): void;
                }): any;
            };
            var addListener : {
                <_M1>(event: any, h: {
                    (x: _M1): void;
                }): void;
            };
            var subscribeTo : {
                <_M1>(event: any, h: {
                    (x: _M1): void;
                }): __ABBREV.__WebSharper.IDisposableProxy;
            };
        }
        module Pervasives {
            var NewFromList : {
                <_M1>(fields: __ABBREV.__WebSharper.seq<any>): _M1;
            };
        }
        module Remoting {
            interface IAjaxProvider {
                Async(x0: string, x1: __ABBREV.__WebSharper.ObjectProxy, x2: string, x3: {
                    (x: string): void;
                }, x4: {
                    (x: __ABBREV.__WebSharper.ExceptionProxy): void;
                }): void;
                Sync(x0: string, x1: __ABBREV.__WebSharper.ObjectProxy, x2: string): string;
            }
            var makeHeaders : {
                (m: string): __ABBREV.__WebSharper.ObjectProxy;
            };
            var makePayload : {
                (data: __ABBREV.__WebSharper.ObjectProxy[]): string;
            };
            var Call : {
                (m: string, data: __ABBREV.__WebSharper.ObjectProxy[]): __ABBREV.__WebSharper.ObjectProxy;
            };
            var Async : {
                (m: string, data: __ABBREV.__WebSharper.ObjectProxy[]): any;
            };
            var Send : {
                (m: string, data: __ABBREV.__WebSharper.ObjectProxy[]): void;
            };
            var EndPoint : {
                (): string;
            };
            var AjaxProvider : {
                (): __ABBREV.__Remoting.IAjaxProvider;
            };
        }
        module Json {
            interface Resource {
            }
            var lookup : {
                <_M1>(x: string[]): __ABBREV.__WebSharper.ObjectProxy;
            };
            var restore : {
                (ty: __ABBREV.__WebSharper.ObjectProxy, obj: __ABBREV.__WebSharper.ObjectProxy): __ABBREV.__WebSharper.ObjectProxy;
            };
            var shallowMap : {
                (f: {
                    (x: __ABBREV.__WebSharper.ObjectProxy): __ABBREV.__WebSharper.ObjectProxy;
                }, x: __ABBREV.__WebSharper.ObjectProxy): __ABBREV.__WebSharper.ObjectProxy;
            };
            var Activate : {
                <_M1>(json: __ABBREV.__WebSharper.ObjectProxy): _M1;
            };
        }
        module JavaScript {
            interface Kind {
            }
        }
        interface AsyncProxy {
        }
        interface AsyncBuilderProxy {
        }
        interface Char {
        }
        interface ChoiceProxy11<_T1, _T2> {
        }
        interface ChoiceProxy4<_T1, _T2, _T3> {
        }
        interface ChoiceProxy1<_T1, _T2, _T3, _T4> {
        }
        interface ChoiceProxy2<_T1, _T2, _T3, _T4, _T5> {
        }
        interface ChoiceProxy3<_T1, _T2, _T3, _T4, _T5, _T6> {
        }
        interface ChoiceProxy<_T1, _T2, _T3, _T4, _T5, _T6, _T7> {
        }
        interface DateTimeProxy {
        }
        interface DoubleProxy {
        }
        interface ExceptionProxy {
        }
        interface MatchFailureExceptionProxy {
        }
        interface IDisposableProxy {
            Dispose(): void;
        }
        interface seq<_T1> {
        }
        interface IEnumeratorProxy1 {
            MoveNext(): boolean;
            Reset(): void;
            get_Current(): __ABBREV.__WebSharper.ObjectProxy;
        }
        interface ObjectProxy {
        }
        interface IEnumeratorProxy<_T1> {
            get_Current(): _T1;
        }
        interface Int32Proxy {
        }
        interface ArrayProxy {
        }
        interface KeyValuePairProxy<_T1, _T2> {
        }
        interface LazyProxy<_T1> {
        }
        interface Math {
        }
        interface OptionProxy<_T1> {
        }
        interface TimeSpanProxy {
        }
        interface ref<_T1> {
        }
    }
}
declare module __ABBREV {
    
    export import __WebSharper = IntelliFactory.WebSharper;
    export import __List = IntelliFactory.WebSharper.List;
    export import __Remoting = IntelliFactory.WebSharper.Remoting;
}
