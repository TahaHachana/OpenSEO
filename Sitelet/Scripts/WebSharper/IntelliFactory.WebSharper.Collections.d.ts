declare module IntelliFactory {
    module WebSharper {
        module Collections {
            module LinkedList {
                interface NodeProxy<_T1> {
                }
                interface EnumeratorProxy<_T1> {
                    MoveNext(): boolean;
                    Dispose(): void;
                    get_Current(): _T1;
                }
                interface ListProxy<_T1> {
                    AddAfter(after: __ABBREV.__LinkedList.NodeProxy<_T1>, value: _T1): __ABBREV.__LinkedList.NodeProxy<_T1>;
                    AddBefore(before: __ABBREV.__LinkedList.NodeProxy<_T1>, value: _T1): __ABBREV.__LinkedList.NodeProxy<_T1>;
                    AddFirst(value: _T1): __ABBREV.__LinkedList.NodeProxy<_T1>;
                    AddLast(value: _T1): __ABBREV.__LinkedList.NodeProxy<_T1>;
                    Clear(): void;
                    Contains<_M1>(value: _M1): boolean;
                    Find(value: _T1): __ABBREV.__LinkedList.NodeProxy<_T1>;
                    FindLast(value: _T1): __ABBREV.__LinkedList.NodeProxy<_T1>;
                    GetEnumerator(): __ABBREV.__LinkedList.EnumeratorProxy<_T1>;
                    Remove(node: __ABBREV.__LinkedList.NodeProxy<_T1>): void;
                    Remove1(value: _T1): boolean;
                    RemoveFirst(): void;
                    RemoveLast(): void;
                    get_Count(): number;
                    get_First(): __ABBREV.__LinkedList.NodeProxy<_T1>;
                    get_Last(): __ABBREV.__LinkedList.NodeProxy<_T1>;
                }
            }
            module ResizeArray {
                interface ResizeArrayProxy<_T1> {
                    GetEnumerator(): __ABBREV.__WebSharper.IEnumeratorProxy<__ABBREV.__WebSharper.ObjectProxy>;
                    Add(x: _T1): void;
                    AddRange(x: __ABBREV.__WebSharper.seq<_T1>): void;
                    Clear(): void;
                    CopyTo(arr: _T1[]): void;
                    CopyTo1(arr: _T1[], offset: number): void;
                    CopyTo2(index: number, target: _T1[], offset: number, count: number): void;
                    GetRange(index: number, count: number): __ABBREV.__ResizeArray.ResizeArrayProxy<_T1>;
                    Insert(index: number, items: _T1): void;
                    InsertRange(index: number, items: __ABBREV.__WebSharper.seq<_T1>): void;
                    RemoveAt(x: number): void;
                    RemoveRange(index: number, count: number): void;
                    Reverse(): void;
                    Reverse1(index: number, count: number): void;
                    ToArray(): _T1[];
                    get_Count(): number;
                    get_Item(x: number): _T1;
                    set_Item(x: number, v: _T1): void;
                }
            }
            module SetModule {
                var Filter : {
                    <_M1>(f: {
                        (x: _M1): boolean;
                    }, s: __ABBREV.__Collections.FSharpSet<_M1>): __ABBREV.__Collections.FSharpSet<_M1>;
                };
                var FoldBack : {
                    <_M1, _M2>(f: {
                        (x: _M1): {
                            (x: _M2): _M2;
                        };
                    }, a: __ABBREV.__Collections.FSharpSet<_M1>, s: _M2): _M2;
                };
                var Partition : {
                    <_M1>(f: {
                        (x: _M1): boolean;
                    }, a: __ABBREV.__Collections.FSharpSet<_M1>): any;
                };
            }
            module MapModule {
                var Exists : {
                    <_M1, _M2>(f: {
                        (x: _M1): {
                            (x: _M2): boolean;
                        };
                    }, m: __ABBREV.__Collections.FSharpMap<_M1, _M2>): boolean;
                };
                var Filter : {
                    <_M1, _M2>(f: {
                        (x: _M1): {
                            (x: _M2): boolean;
                        };
                    }, m: __ABBREV.__Collections.FSharpMap<_M1, _M2>): __ABBREV.__Collections.FSharpMap<_M1, _M2>;
                };
                var FindKey : {
                    <_M1, _M2>(f: {
                        (x: _M1): {
                            (x: _M2): boolean;
                        };
                    }, m: __ABBREV.__Collections.FSharpMap<_M1, _M2>): _M1;
                };
                var Fold : {
                    <_M1, _M2, _M3>(f: {
                        (x: _M3): {
                            (x: _M1): {
                                (x: _M2): _M3;
                            };
                        };
                    }, s: _M3, m: __ABBREV.__Collections.FSharpMap<_M1, _M2>): _M3;
                };
                var FoldBack : {
                    <_M1, _M2, _M3>(f: {
                        (x: _M1): {
                            (x: _M2): {
                                (x: _M3): _M3;
                            };
                        };
                    }, m: __ABBREV.__Collections.FSharpMap<_M1, _M2>, s: _M3): _M3;
                };
                var ForAll : {
                    <_M1, _M2>(f: {
                        (x: _M1): {
                            (x: _M2): boolean;
                        };
                    }, m: __ABBREV.__Collections.FSharpMap<_M1, _M2>): boolean;
                };
                var Iterate : {
                    <_M1, _M2>(f: {
                        (x: _M1): {
                            (x: _M2): void;
                        };
                    }, m: __ABBREV.__Collections.FSharpMap<_M1, _M2>): void;
                };
                var OfArray : {
                    <_M1, _M2>(a: any[]): __ABBREV.__Collections.FSharpMap<_M1, _M2>;
                };
                var Partition : {
                    <_M1, _M2>(f: {
                        (x: _M1): {
                            (x: _M2): boolean;
                        };
                    }, m: __ABBREV.__Collections.FSharpMap<_M1, _M2>): any;
                };
                var Pick : {
                    <_M1, _M2, _M3>(f: {
                        (x: _M1): {
                            (x: _M2): __ABBREV.__WebSharper.OptionProxy<_M3>;
                        };
                    }, m: __ABBREV.__Collections.FSharpMap<_M1, _M2>): _M3;
                };
                var ToSeq : {
                    <_M1, _M2>(m: __ABBREV.__Collections.FSharpMap<_M1, _M2>): __ABBREV.__WebSharper.seq<any>;
                };
                var TryFind : {
                    <_M1, _M2>(k: _M1, m: __ABBREV.__Collections.FSharpMap<_M1, _M2>): __ABBREV.__WebSharper.OptionProxy<_M2>;
                };
                var TryFindKey : {
                    <_M1, _M2>(f: {
                        (x: _M1): {
                            (x: _M2): boolean;
                        };
                    }, m: __ABBREV.__Collections.FSharpMap<_M1, _M2>): __ABBREV.__WebSharper.OptionProxy<_M1>;
                };
                var TryPick : {
                    <_M1, _M2, _M3>(f: {
                        (x: _M1): {
                            (x: _M2): __ABBREV.__WebSharper.OptionProxy<_M3>;
                        };
                    }, m: __ABBREV.__Collections.FSharpMap<_M1, _M2>): __ABBREV.__WebSharper.OptionProxy<_M3>;
                };
                var Map : {
                    <_M1, _M2, _M3>(f: {
                        (x: _M1): {
                            (x: _M2): _M3;
                        };
                    }, m: __ABBREV.__Collections.FSharpMap<_M1, _M2>): __ABBREV.__Collections.FSharpMap<_M1, _M3>;
                };
            }
            interface Dictionary<_T1, _T2> {
                Add(k: _T1, v: _T2): void;
                Clear(): void;
                ContainsKey(k: _T1): boolean;
                GetEnumerator(): __ABBREV.__WebSharper.IEnumeratorProxy<__ABBREV.__WebSharper.ObjectProxy>;
                Remove(k: _T1): boolean;
                get_Item(k: _T1): _T2;
                set_Item(k: _T1, v: _T2): void;
            }
            interface FSharpMap<_T1, _T2> {
                Add(k: _T1, v: _T2): __ABBREV.__Collections.FSharpMap<_T1, _T2>;
                ContainsKey(k: _T1): boolean;
                Remove(k: _T1): __ABBREV.__Collections.FSharpMap<_T1, _T2>;
                TryFind(k: _T1): __ABBREV.__WebSharper.OptionProxy<_T2>;
                GetEnumerator(): __ABBREV.__WebSharper.IEnumeratorProxy<__ABBREV.__WebSharper.KeyValuePairProxy<_T1, _T2>>;
                GetHashCode(): number;
                Equals(other: __ABBREV.__WebSharper.ObjectProxy): boolean;
                CompareTo(other: __ABBREV.__WebSharper.ObjectProxy): number;
                get_Tree(): any;
                get_Count(): number;
                get_IsEmpty(): boolean;
                get_Item(k: _T1): _T2;
            }
            interface FSharpSet<_T1> {
                add(x: __ABBREV.__Collections.FSharpSet<_T1>): __ABBREV.__Collections.FSharpSet<_T1>;
                sub(x: __ABBREV.__Collections.FSharpSet<_T1>): __ABBREV.__Collections.FSharpSet<_T1>;
                Add(x: _T1): __ABBREV.__Collections.FSharpSet<_T1>;
                Contains(v: _T1): boolean;
                IsProperSubsetOf(s: __ABBREV.__Collections.FSharpSet<_T1>): boolean;
                IsProperSupersetOf(s: __ABBREV.__Collections.FSharpSet<_T1>): boolean;
                IsSubsetOf(s: __ABBREV.__Collections.FSharpSet<_T1>): boolean;
                IsSupersetOf(s: __ABBREV.__Collections.FSharpSet<_T1>): boolean;
                Remove(v: _T1): __ABBREV.__Collections.FSharpSet<_T1>;
                GetEnumerator(): __ABBREV.__WebSharper.IEnumeratorProxy<_T1>;
                GetHashCode(): number;
                Equals(other: __ABBREV.__WebSharper.ObjectProxy): boolean;
                CompareTo(other: __ABBREV.__WebSharper.ObjectProxy): number;
                get_Count(): number;
                get_IsEmpty(): boolean;
                get_Tree(): any;
                get_MaximumElement(): _T1;
                get_MinimumElement(): _T1;
            }
        }
    }
}
declare module __ABBREV {
    
    export import __LinkedList = IntelliFactory.WebSharper.Collections.LinkedList;
    export import __WebSharper = IntelliFactory.WebSharper;
    export import __ResizeArray = IntelliFactory.WebSharper.Collections.ResizeArray;
    export import __Collections = IntelliFactory.WebSharper.Collections;
}
