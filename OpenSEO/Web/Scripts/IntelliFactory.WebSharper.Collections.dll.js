(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,WebSharper,Collections,BalancedTree,Operators,List,T,Seq,Arrays,JavaScript,Enumerator,DictionaryUtil,Dictionary,Unchecked,_FSharpMap_2,_Pair_2,Option,MapUtil,_FSharpSet_1,SetUtil;
 Runtime.Define(Global,{
  IntelliFactory:{
   WebSharper:{
    Collections:{
     BalancedTree:{
      Add:function(x,t)
      {
       return BalancedTree.Put(function()
       {
        return function(x1)
        {
         return x1;
        };
       },x,t);
      },
      Branch:function(node,left,right)
      {
       return{
        Node:node,
        Left:left,
        Right:right,
        Height:1+Operators.Max(left==null?0:left.Height,right==null?0:right.Height),
        Count:1+(left==null?0:left.Count)+(right==null?0:right.Count)
       };
      },
      Build:function(data,min,max)
      {
       var sz,center,left,right;
       sz=max-min+1;
       if(sz<=0)
        {
         return null;
        }
       else
        {
         center=(min+max)/2>>0;
         left=BalancedTree.Build(data,min,center-1);
         right=BalancedTree.Build(data,center+1,max);
         return BalancedTree.Branch(data[center],left,right);
        }
      },
      Contains:function(v,t)
      {
       return!((BalancedTree.Lookup(v,t))[0]==null);
      },
      Enumerate:function(flip,t)
      {
       var gen;
       gen=Runtime.Tupled(function(tupledArg)
       {
        var t1,spine,t2,spine1,other;
        t1=tupledArg[0];
        spine=tupledArg[1];
        if(t1==null)
         {
          if(spine.$==1)
           {
            t2=spine.$0[0];
            spine1=spine.$1;
            other=spine.$0[1];
            return{
             $:1,
             $0:[t2,[other,spine1]]
            };
           }
          else
           {
            return{
             $:0
            };
           }
         }
        else
         {
          if(flip)
           {
            return gen([t1.Right,Runtime.New(T,{
             $:1,
             $0:[t1.Node,t1.Left],
             $1:spine
            })]);
           }
          else
           {
            return gen([t1.Left,Runtime.New(T,{
             $:1,
             $0:[t1.Node,t1.Right],
             $1:spine
            })]);
           }
         }
       });
       return Seq.unfold(gen,[t,Runtime.New(T,{
        $:0
       })]);
      },
      Lookup:function(k,t)
      {
       var spine,t1,loop,matchValue;
       spine=[[]];
       t1=[t];
       loop=[true];
       while(loop[0])
        {
         if(t1[0]==null)
          {
           loop[0]=false;
          }
         else
          {
           matchValue=Operators.Compare(k,t1[0].Node);
           if(matchValue===0)
            {
             loop[0]=false;
            }
           else
            {
             if(matchValue===1)
              {
               spine[0].unshift([true,t1[0].Node,t1[0].Left]);
               t1[0]=t1[0].Right;
              }
             else
              {
               spine[0].unshift([false,t1[0].Node,t1[0].Right]);
               t1[0]=t1[0].Left;
              }
            }
          }
        }
       return[t1[0],spine[0]];
      },
      OfSeq:function(data)
      {
       var data1;
       data1=Arrays.sort(Seq.toArray(Seq.distinct(data)));
       return BalancedTree.Build(data1,0,data1.length-1);
      },
      Put:function(combine,k,t)
      {
       var patternInput,t1,spine;
       patternInput=BalancedTree.Lookup(k,t);
       t1=patternInput[0];
       spine=patternInput[1];
       if(t1==null)
        {
         return BalancedTree.Rebuild(spine,BalancedTree.Branch(k,null,null));
        }
       else
        {
         return BalancedTree.Rebuild(spine,BalancedTree.Branch((combine(t1.Node))(k),t1.Left,t1.Right));
        }
      },
      Rebuild:function(spine,t)
      {
       var h,t1,i,matchValue,x1,l,m,x2,r,m1;
       h=function(x)
       {
        if(x==null)
         {
          return 0;
         }
        else
         {
          return x.Height;
         }
       };
       t1=[t];
       for(i=0;i<=spine.length-1;i++){
        t1[0]=(matchValue=spine[i],matchValue[0]?(x1=matchValue[1],(l=matchValue[2],h(t1[0])>h(l)+1?h(t1[0].Left)===h(t1[0].Right)+1?(m=t1[0].Left,BalancedTree.Branch(m.Node,BalancedTree.Branch(x1,l,m.Left),BalancedTree.Branch(t1[0].Node,m.Right,t1[0].Right))):BalancedTree.Branch(t1[0].Node,BalancedTree.Branch(x1,l,t1[0].Left),t1[0].Right):BalancedTree.Branch(x1,l,t1[0]))):(x2=matchValue[1],(r=matchValue[2],h(t1[0])>h(r)+1?h(t1[0].Right)===h(t1[0].Left)+1?(m1=t1[0].Right,BalancedTree.Branch(m1.Node,BalancedTree.Branch(t1[0].Node,t1[0].Left,m1.Left),BalancedTree.Branch(x2,m1.Right,r))):BalancedTree.Branch(t1[0].Node,t1[0].Left,BalancedTree.Branch(x2,t1[0].Right,r)):BalancedTree.Branch(x2,t1[0],r))));
       }
       return t1[0];
      },
      Remove:function(k,src)
      {
       var patternInput,t,spine,x,x1,x2,t1,t2,f,f1,f2;
       patternInput=BalancedTree.Lookup(k,src);
       t=patternInput[0];
       spine=patternInput[1];
       if(t==null)
        {
         return src;
        }
       else
        {
         if(t.Right==null)
          {
           return BalancedTree.Rebuild(spine,t.Left);
          }
         else
          {
           if(t.Left==null)
            {
             return BalancedTree.Rebuild(spine,t.Right);
            }
           else
            {
             x=(x1=(x2=Seq.append((t1=t.Left,BalancedTree.Enumerate(false,t1)),(t2=t.Right,BalancedTree.Enumerate(false,t2))),(f=function(source)
             {
              return Seq.toArray(source);
             },f(x2))),(f1=function(data)
             {
              return BalancedTree.Build(data,0,data.length-1);
             },f1(x1)));
             f2=function(t3)
             {
              return BalancedTree.Rebuild(spine,t3);
             };
             return f2(x);
            }
          }
        }
      },
      TryFind:function(v,t)
      {
       var x;
       x=(BalancedTree.Lookup(v,t))[0];
       if(x==null)
        {
         return{
          $:0
         };
        }
       else
        {
         return{
          $:1,
          $0:x.Node
         };
        }
      }
     },
     Dictionary:Runtime.Class({
      Add:function(k,v)
      {
       var h;
       h=this.hash.call(null,k);
       if(this.data.hasOwnProperty(h))
        {
         return Operators.FailWith("An item with the same key has already been added.");
        }
       else
        {
         this.data[h]={
          K:k,
          V:v
         };
         this.count=this.count+1;
        }
      },
      Clear:function()
      {
       this.data={};
       this.count=0;
      },
      ContainsKey:function(k)
      {
       return this.data.hasOwnProperty(this.hash.call(null,k));
      },
      GetEnumerator:function()
      {
       var s;
       s=Arrays.map(Runtime.Tupled(function(tuple)
       {
        return tuple[1];
       }),JavaScript.GetFields(this.data));
       return Enumerator.Get(s);
      },
      Remove:function(k)
      {
       var h;
       h=this.hash.call(null,k);
       if(this.data.hasOwnProperty(h))
        {
         JavaScript.Delete(this.data,h);
         this.count=this.count-1;
         return true;
        }
       else
        {
         return false;
        }
      },
      get_Item:function(k)
      {
       var k1,x;
       k1=this.hash.call(null,k);
       if(this.data.hasOwnProperty(k1))
        {
         x=this.data[k1];
         return x.V;
        }
       else
        {
         return DictionaryUtil.notPresent();
        }
      },
      set_Item:function(k,v)
      {
       var h;
       h=this.hash.call(null,k);
       if(!this.data.hasOwnProperty(h))
        {
         this.count=this.count+1;
        }
       this.data[h]={
        K:k,
        V:v
       };
      }
     },{
      New:function(dictionary,comparer)
      {
       var r;
       r=Dictionary.New11(dictionary,function(x)
       {
        return function(y)
        {
         return comparer.Equals(x,y);
        };
       },function(x)
       {
        return comparer.GetHashCode(x);
       });
       return Runtime.New(this,r);
      },
      New1:function(dictionary)
      {
       var r;
       r=Dictionary.New11(dictionary,function(x)
       {
        return function(y)
        {
         return Unchecked.Equals(x,y);
        };
       },function(obj)
       {
        return Unchecked.Hash(obj);
       });
       return Runtime.New(this,r);
      },
      New11:function(init,equals,hash)
      {
       var r,enumerator,x,x1;
       r={};
       r.hash=hash;
       r.count=0;
       r.data={};
       enumerator=Enumerator.Get(init);
       while(enumerator.MoveNext())
        {
         x=enumerator.get_Current();
         r.data[x1=x.K,r.hash.call(null,x1)]=x.V;
        }
       return Runtime.New(this,r);
      },
      New2:function()
      {
       var r;
       r=Dictionary.New11([],function(x)
       {
        return function(y)
        {
         return Unchecked.Equals(x,y);
        };
       },function(obj)
       {
        return Unchecked.Hash(obj);
       });
       return Runtime.New(this,r);
      },
      New3:function(comparer)
      {
       var r;
       r=Dictionary.New11([],function(x)
       {
        return function(y)
        {
         return comparer.Equals(x,y);
        };
       },function(x)
       {
        return comparer.GetHashCode(x);
       });
       return Runtime.New(this,r);
      }
     }),
     DictionaryUtil:{
      notPresent:function()
      {
       return Operators.FailWith("The given key was not present in the dictionary.");
      }
     },
     "FSharpMap`2":Runtime.Class({
      Add:function(k,v)
      {
       var x,f,x1;
       return _FSharpMap_2.New1((x=this.tree,(f=(x1=Runtime.New(_Pair_2,{
        Key:k,
        Value:v
       }),function(t)
       {
        return BalancedTree.Add(x1,t);
       }),f(x))));
      },
      CompareTo:function(other)
      {
       return Seq.compareWith(function(x)
       {
        return function(y)
        {
         return Operators.Compare(x,y);
        };
       },this,other);
      },
      ContainsKey:function(k)
      {
       var x,f,v;
       x=this.tree;
       f=(v=Runtime.New(_Pair_2,{
        Key:k,
        Value:undefined
       }),function(t)
       {
        return BalancedTree.Contains(v,t);
       });
       return f(x);
      },
      Equals:function(other)
      {
       if(this.get_Count()===other.get_Count())
        {
         return Seq.forall2(function(x)
         {
          return function(y)
          {
           return Unchecked.Equals(x,y);
          };
         },this,other);
        }
       else
        {
         return false;
        }
      },
      GetEnumerator:function()
      {
       var s,x,t,f,mapping;
       s=(x=(t=this.tree,BalancedTree.Enumerate(false,t)),(f=(mapping=function(kv)
       {
        return{
         K:kv.Key,
         V:kv.Value
        };
       },function(source)
       {
        return Seq.map(mapping,source);
       }),f(x)));
       return Enumerator.Get(s);
      },
      GetHashCode:function()
      {
       var x;
       x=Seq.toArray(this);
       return Unchecked.Hash(x);
      },
      Remove:function(k)
      {
       var x,f,k1;
       return _FSharpMap_2.New1((x=this.tree,(f=(k1=Runtime.New(_Pair_2,{
        Key:k,
        Value:undefined
       }),function(src)
       {
        return BalancedTree.Remove(k1,src);
       }),f(x))));
      },
      TryFind:function(k)
      {
       var x,x1,f,v,f1,mapping;
       x=(x1=this.tree,(f=(v=Runtime.New(_Pair_2,{
        Key:k,
        Value:undefined
       }),function(t)
       {
        return BalancedTree.TryFind(v,t);
       }),f(x1)));
       f1=(mapping=function(kv)
       {
        return kv.Value;
       },function(option)
       {
        return Option.map(mapping,option);
       });
       return f1(x);
      },
      get_Count:function()
      {
       var tree;
       tree=this.tree;
       if(tree==null)
        {
         return 0;
        }
       else
        {
         return tree.Count;
        }
      },
      get_IsEmpty:function()
      {
       return this.tree==null;
      },
      get_Item:function(k)
      {
       var matchValue,v;
       matchValue=this.TryFind(k);
       if(matchValue.$==0)
        {
         return Operators.FailWith("The given key was not present in the dictionary.");
        }
       else
        {
         v=matchValue.$0;
         return v;
        }
      },
      get_Tree:function()
      {
       return this.tree;
      }
     },{
      New:function(s)
      {
       var r;
       r=_FSharpMap_2.New1(MapUtil.fromSeq(s));
       return Runtime.New(this,r);
      },
      New1:function(tree)
      {
       var r;
       r={};
       r.tree=tree;
       return Runtime.New(this,r);
      }
     }),
     "FSharpSet`1":Runtime.Class({
      Add:function(x)
      {
       return _FSharpSet_1.New1(BalancedTree.Add(x,this.tree));
      },
      CompareTo:function(other)
      {
       return Seq.compareWith(function(e1)
       {
        return function(e2)
        {
         return Operators.Compare(e1,e2);
        };
       },this,other);
      },
      Contains:function(v)
      {
       return BalancedTree.Contains(v,this.tree);
      },
      Equals:function(other)
      {
       if(this.get_Count()===other.get_Count())
        {
         return Seq.forall2(function(x)
         {
          return function(y)
          {
           return Unchecked.Equals(x,y);
          };
         },this,other);
        }
       else
        {
         return false;
        }
      },
      GetEnumerator:function()
      {
       var _this,t;
       _this=(t=this.tree,BalancedTree.Enumerate(false,t));
       return Enumerator.Get(_this);
      },
      GetHashCode:function()
      {
       var _this;
       return-1741749453+(_this=Seq.toArray(this),Unchecked.Hash(_this));
      },
      IsProperSubsetOf:function(s)
      {
       if(this.IsSubsetOf(s))
        {
         return this.get_Count()<s.get_Count();
        }
       else
        {
         return false;
        }
      },
      IsProperSupersetOf:function(s)
      {
       if(this.IsSupersetOf(s))
        {
         return this.get_Count()>s.get_Count();
        }
       else
        {
         return false;
        }
      },
      IsSubsetOf:function(s)
      {
       return Seq.forall(function(arg00)
       {
        return s.Contains(arg00);
       },this);
      },
      IsSupersetOf:function(s)
      {
       var _this=this;
       return Seq.forall(function(arg00)
       {
        return _this.Contains(arg00);
       },s);
      },
      Remove:function(v)
      {
       return _FSharpSet_1.New1(BalancedTree.Remove(v,this.tree));
      },
      get_Count:function()
      {
       var tree;
       tree=this.tree;
       if(tree==null)
        {
         return 0;
        }
       else
        {
         return tree.Count;
        }
      },
      get_IsEmpty:function()
      {
       return this.tree==null;
      },
      get_MaximumElement:function()
      {
       var t;
       return Seq.head((t=this.tree,BalancedTree.Enumerate(true,t)));
      },
      get_MinimumElement:function()
      {
       var t;
       return Seq.head((t=this.tree,BalancedTree.Enumerate(false,t)));
      },
      get_Tree:function()
      {
       return this.tree;
      }
     },{
      New:function(s)
      {
       var r;
       r=_FSharpSet_1.New1(SetUtil.ofSeq(s));
       return Runtime.New(this,r);
      },
      New1:function(tree)
      {
       var r;
       r={};
       r.tree=tree;
       return Runtime.New(this,r);
      }
     }),
     MapModule:{
      Exists:function(f,m)
      {
       var f1,predicate;
       f1=(predicate=function(kv)
       {
        return(f(kv.K))(kv.V);
       },function(source)
       {
        return Seq.exists(predicate,source);
       });
       return f1(m);
      },
      Filter:function(f,m)
      {
       var x,x1,x2,x3,t,f1,predicate,f2,f3,f4;
       x=(x1=(x2=(x3=(t=m.get_Tree(),BalancedTree.Enumerate(false,t)),(f1=(predicate=function(kv)
       {
        return(f(kv.Key))(kv.Value);
       },function(source)
       {
        return Seq.filter(predicate,source);
       }),f1(x3))),(f2=function(source)
       {
        return Seq.toArray(source);
       },f2(x2))),(f3=function(data)
       {
        return BalancedTree.Build(data,0,data.length-1);
       },f3(x1)));
       f4=function(t1)
       {
        return _FSharpMap_2.New1(t1);
       };
       return f4(x);
      },
      FindKey:function(f,m)
      {
       var f1,chooser;
       f1=(chooser=function(kv)
       {
        if((f(kv.K))(kv.V))
         {
          return{
           $:1,
           $0:kv.K
          };
         }
        else
         {
          return{
           $:0
          };
         }
       },function(source)
       {
        return Seq.pick(chooser,source);
       });
       return f1(m);
      },
      Fold:function(f,s,m)
      {
       var x,t,f1,folder;
       x=(t=m.get_Tree(),BalancedTree.Enumerate(false,t));
       f1=(folder=function(s1)
       {
        return function(kv)
        {
         return((f(s1))(kv.Key))(kv.Value);
        };
       },function(source)
       {
        return Seq.fold(folder,s,source);
       });
       return f1(x);
      },
      FoldBack:function(f,m,s)
      {
       var x,t,f1,folder;
       x=(t=m.get_Tree(),BalancedTree.Enumerate(true,t));
       f1=(folder=function(s1)
       {
        return function(kv)
        {
         return((f(kv.Key))(kv.Value))(s1);
        };
       },function(source)
       {
        return Seq.fold(folder,s,source);
       });
       return f1(x);
      },
      ForAll:function(f,m)
      {
       var f1,predicate;
       f1=(predicate=function(kv)
       {
        return(f(kv.K))(kv.V);
       },function(source)
       {
        return Seq.forall(predicate,source);
       });
       return f1(m);
      },
      Iterate:function(f,m)
      {
       var f1,action;
       f1=(action=function(kv)
       {
        return(f(kv.K))(kv.V);
       },function(source)
       {
        return Seq.iter(action,source);
       });
       return f1(m);
      },
      Map:function(f,m)
      {
       var x,x1,x2,t,f1,mapping,f2,f3;
       x=(x1=(x2=(t=m.get_Tree(),BalancedTree.Enumerate(false,t)),(f1=(mapping=function(kv)
       {
        return Runtime.New(_Pair_2,{
         Key:kv.Key,
         Value:(f(kv.Key))(kv.Value)
        });
       },function(source)
       {
        return Seq.map(mapping,source);
       }),f1(x2))),(f2=function(data)
       {
        return BalancedTree.OfSeq(data);
       },f2(x1)));
       f3=function(t1)
       {
        return _FSharpMap_2.New1(t1);
       };
       return f3(x);
      },
      OfArray:function(a)
      {
       var x,x1,f,mapping,f1,f2;
       x=(x1=(f=(mapping=Runtime.Tupled(function(tupledArg)
       {
        var k,v;
        k=tupledArg[0];
        v=tupledArg[1];
        return Runtime.New(_Pair_2,{
         Key:k,
         Value:v
        });
       }),function(source)
       {
        return Seq.map(mapping,source);
       }),f(a)),(f1=function(data)
       {
        return BalancedTree.OfSeq(data);
       },f1(x1)));
       f2=function(t)
       {
        return _FSharpMap_2.New1(t);
       };
       return f2(x);
      },
      Partition:function(f,m)
      {
       var patternInput,x,t,f1,predicate,y,x1,t1,t2;
       patternInput=(x=Seq.toArray((t=m.get_Tree(),BalancedTree.Enumerate(false,t))),(f1=(predicate=function(kv)
       {
        return(f(kv.Key))(kv.Value);
       },function(array)
       {
        return Arrays.partition(predicate,array);
       }),f1(x)));
       y=patternInput[1];
       x1=patternInput[0];
       return[(t1=BalancedTree.Build(x1,0,x1.length-1),_FSharpMap_2.New1(t1)),(t2=BalancedTree.Build(y,0,y.length-1),_FSharpMap_2.New1(t2))];
      },
      Pick:function(f,m)
      {
       var f1,chooser;
       f1=(chooser=function(kv)
       {
        return(f(kv.K))(kv.V);
       },function(source)
       {
        return Seq.pick(chooser,source);
       });
       return f1(m);
      },
      ToSeq:function(m)
      {
       var x,t,f,mapping;
       x=(t=m.get_Tree(),BalancedTree.Enumerate(false,t));
       f=(mapping=function(kv)
       {
        return[kv.Key,kv.Value];
       },function(source)
       {
        return Seq.map(mapping,source);
       });
       return f(x);
      },
      TryFind:function(k,m)
      {
       return m.TryFind(k);
      },
      TryFindKey:function(f,m)
      {
       var f1,predicate;
       f1=(predicate=function(kv)
       {
        return(f(kv.K))(kv.V);
       },function(source)
       {
        return Seq.tryFind(predicate,source);
       });
       return f1(m);
      },
      TryPick:function(f,m)
      {
       var f1,chooser;
       f1=(chooser=function(kv)
       {
        return(f(kv.K))(kv.V);
       },function(source)
       {
        return Seq.tryPick(chooser,source);
       });
       return f1(m);
      }
     },
     MapUtil:{
      fromSeq:function(s)
      {
       var a;
       a=Seq.toArray(Seq.delay(function()
       {
        return Seq.collect(Runtime.Tupled(function(matchValue)
        {
         var v,k;
         v=matchValue[1];
         k=matchValue[0];
         return[Runtime.New(_Pair_2,{
          Key:k,
          Value:v
         })];
        }),Seq.distinctBy(Runtime.Tupled(function(tuple)
        {
         return tuple[0];
        }),s));
       }));
       Arrays.sortInPlace(a);
       return BalancedTree.Build(a,0,a.length-1);
      }
     },
     "Pair`2":Runtime.Class({
      CompareTo:function(other)
      {
       return Operators.Compare(this.Key,other.Key);
      },
      Equals:function(other)
      {
       return Unchecked.Equals(this.Key,other.Key);
      },
      GetHashCode:function()
      {
       var x;
       x=this.Key;
       return Unchecked.Hash(x);
      }
     }),
     SetModule:{
      Filter:function(f,s)
      {
       var t,data;
       t=(data=Seq.toArray(Seq.filter(f,s)),BalancedTree.Build(data,0,data.length-1));
       return _FSharpSet_1.New1(t);
      },
      FoldBack:function(f,a,s)
      {
       var t;
       return Seq.fold(function(s1)
       {
        return function(x)
        {
         return(f(x))(s1);
        };
       },s,(t=a.get_Tree(),BalancedTree.Enumerate(true,t)));
      },
      Partition:function(f,a)
      {
       var patternInput,y,x,t,t1;
       patternInput=Arrays.partition(f,Seq.toArray(a));
       y=patternInput[1];
       x=patternInput[0];
       return[(t=BalancedTree.OfSeq(x),_FSharpSet_1.New1(t)),(t1=BalancedTree.OfSeq(y),_FSharpSet_1.New1(t1))];
      }
     },
     SetUtil:{
      ofSeq:function(s)
      {
       var a;
       a=Seq.toArray(s);
       Arrays.sortInPlace(a);
       return BalancedTree.Build(a,0,a.length-1);
      }
     }
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  WebSharper=Runtime.Safe(Global.IntelliFactory.WebSharper);
  Collections=Runtime.Safe(WebSharper.Collections);
  BalancedTree=Runtime.Safe(Collections.BalancedTree);
  Operators=Runtime.Safe(WebSharper.Operators);
  List=Runtime.Safe(WebSharper.List);
  T=Runtime.Safe(List.T);
  Seq=Runtime.Safe(WebSharper.Seq);
  Arrays=Runtime.Safe(WebSharper.Arrays);
  JavaScript=Runtime.Safe(WebSharper.JavaScript);
  Enumerator=Runtime.Safe(WebSharper.Enumerator);
  DictionaryUtil=Runtime.Safe(Collections.DictionaryUtil);
  Dictionary=Runtime.Safe(Collections.Dictionary);
  Unchecked=Runtime.Safe(WebSharper.Unchecked);
  _FSharpMap_2=Runtime.Safe(Collections["FSharpMap`2"]);
  _Pair_2=Runtime.Safe(Collections["Pair`2"]);
  Option=Runtime.Safe(WebSharper.Option);
  MapUtil=Runtime.Safe(Collections.MapUtil);
  _FSharpSet_1=Runtime.Safe(Collections["FSharpSet`1"]);
  return SetUtil=Runtime.Safe(Collections.SetUtil);
 });
 Runtime.OnLoad(function()
 {
 });
}());
