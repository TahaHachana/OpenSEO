(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,WebSharper,Collections,BalancedTree,Operators,Seq,List,T,Arrays,IntrinsicFunctionProxy,Enumerator,JavaScript,DictionaryUtil,Dictionary,Unchecked,FSharpMap,Pair,Option,MapUtil,FSharpSet,SetModule,SetUtil,LinkedList,EnumeratorProxy,ListProxy,ResizeArray,ResizeArrayProxy;
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
       var center;
       if(max-min+1<=0)
        {
         return null;
        }
       else
        {
         center=(min+max)/2>>0;
         return BalancedTree.Branch(data[center],BalancedTree.Build(data,min,center-1),BalancedTree.Build(data,center+1,max));
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
        var t1,spine;
        t1=tupledArg[0];
        spine=tupledArg[1];
        return t1==null?spine.$==1?{
         $:1,
         $0:[spine.$0[0],[spine.$0[1],spine.$1]]
        }:{
         $:0
        }:flip?gen([t1.Right,Runtime.New(T,{
         $:1,
         $0:[t1.Node,t1.Left],
         $1:spine
        })]):gen([t1.Left,Runtime.New(T,{
         $:1,
         $0:[t1.Node,t1.Right],
         $1:spine
        })]);
       });
       return Seq.unfold(gen,[t,Runtime.New(T,{
        $:0
       })]);
      },
      Lookup:function(k,t)
      {
       var spine,t1,loop,matchValue;
       spine=[];
       t1=t;
       loop=true;
       while(loop)
        {
         if(t1==null)
          {
           loop=false;
          }
         else
          {
           matchValue=Operators.Compare(k,t1.Node);
           if(matchValue===0)
            {
             loop=false;
            }
           else
            {
             if(matchValue===1)
              {
               spine.unshift([true,t1.Node,t1.Left]);
               t1=t1.Right;
              }
             else
              {
               spine.unshift([false,t1.Node,t1.Right]);
               t1=t1.Left;
              }
            }
          }
        }
       return[t1,spine];
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
       return t1==null?BalancedTree.Rebuild(spine,BalancedTree.Branch(k,null,null)):BalancedTree.Rebuild(spine,BalancedTree.Branch((combine(t1.Node))(k),t1.Left,t1.Right));
      },
      Rebuild:function(spine,t)
      {
       var h,t1,i,matchValue,_,x1,l,m,x2,r,m1;
       h=function(x)
       {
        return x==null?0:x.Height;
       };
       t1=t;
       for(i=0;i<=IntrinsicFunctionProxy.GetLength(spine)-1;i++){
        matchValue=spine[i];
        if(matchValue[0])
         {
          x1=matchValue[1];
          l=matchValue[2];
          if(h(t1)>h(l)+1)
           {
            if(h(t1.Left)===h(t1.Right)+1)
             {
              m=t1.Left;
              _=BalancedTree.Branch(m.Node,BalancedTree.Branch(x1,l,m.Left),BalancedTree.Branch(t1.Node,m.Right,t1.Right));
             }
            else
             {
              _=BalancedTree.Branch(t1.Node,BalancedTree.Branch(x1,l,t1.Left),t1.Right);
             }
           }
          else
           {
            _=BalancedTree.Branch(x1,l,t1);
           }
         }
        else
         {
          x2=matchValue[1];
          r=matchValue[2];
          if(h(t1)>h(r)+1)
           {
            if(h(t1.Right)===h(t1.Left)+1)
             {
              m1=t1.Right;
              _=BalancedTree.Branch(m1.Node,BalancedTree.Branch(t1.Node,t1.Left,m1.Left),BalancedTree.Branch(x2,m1.Right,r));
             }
            else
             {
              _=BalancedTree.Branch(t1.Node,t1.Left,BalancedTree.Branch(x2,t1.Right,r));
             }
           }
          else
           {
            _=BalancedTree.Branch(x2,t1,r);
           }
         }
        t1=_;
       }
       return t1;
      },
      Remove:function(k,src)
      {
       var patternInput,t,spine,data;
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
             data=Seq.toArray(Seq.append(BalancedTree.Enumerate(false,t.Left),BalancedTree.Enumerate(false,t.Right)));
             return BalancedTree.Rebuild(spine,BalancedTree.Build(data,0,data.length-1));
            }
          }
        }
      },
      TryFind:function(v,t)
      {
       var x;
       x=(BalancedTree.Lookup(v,t))[0];
       return x==null?{
        $:0
       }:{
        $:1,
        $0:x.Node
       };
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
         return;
        }
      },
      Clear:function()
      {
       this.data={};
       this.count=0;
       return;
      },
      ContainsKey:function(k)
      {
       return this.data.hasOwnProperty(this.hash.call(null,k));
      },
      GetEnumerator:function()
      {
       return Enumerator.Get(Arrays.map(Runtime.Tupled(function(tuple)
       {
        return tuple[1];
       }),JavaScript.GetFields(this.data)));
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
       var k1;
       k1=this.hash.call(null,k);
       return this.data.hasOwnProperty(k1)?this.data[k1].V:DictionaryUtil.notPresent();
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
       return;
      }
     },{
      New:function(dictionary,comparer)
      {
       return Runtime.New(this,Dictionary.New11(dictionary,function(x)
       {
        return function(y)
        {
         return comparer.Equals(x,y);
        };
       },function(x)
       {
        return comparer.GetHashCode(x);
       }));
      },
      New1:function(capacity,comparer)
      {
       return Runtime.New(this,Dictionary.New3(comparer));
      },
      New11:function(init,equals,hash)
      {
       var r,enumerator,x;
       r=Runtime.New(this,{});
       r.hash=hash;
       r.count=0;
       r.data={};
       enumerator=Enumerator.Get(init);
       while(enumerator.MoveNext())
        {
         x=enumerator.get_Current();
         r.data[r.hash.call(null,x.K)]=x.V;
        }
       return r;
      },
      New12:function()
      {
       return Runtime.New(this,Dictionary.New21());
      },
      New2:function(dictionary)
      {
       return Runtime.New(this,Dictionary.New11(dictionary,function(x)
       {
        return function(y)
        {
         return Unchecked.Equals(x,y);
        };
       },function(obj)
       {
        return Unchecked.Hash(obj);
       }));
      },
      New21:function()
      {
       return Runtime.New(this,Dictionary.New11([],function(x)
       {
        return function(y)
        {
         return Unchecked.Equals(x,y);
        };
       },function(obj)
       {
        return Unchecked.Hash(obj);
       }));
      },
      New3:function(comparer)
      {
       return Runtime.New(this,Dictionary.New11([],function(x)
       {
        return function(y)
        {
         return comparer.Equals(x,y);
        };
       },function(x)
       {
        return comparer.GetHashCode(x);
       }));
      }
     }),
     DictionaryUtil:{
      notPresent:function()
      {
       return Operators.FailWith("The given key was not present in the dictionary.");
      }
     },
     FSharpMap:Runtime.Class({
      Add:function(k,v)
      {
       var t;
       t=this.tree;
       return FSharpMap.New1(BalancedTree.Add(Runtime.New(Pair,{
        Key:k,
        Value:v
       }),t));
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
       var t;
       t=this.tree;
       return BalancedTree.Contains(Runtime.New(Pair,{
        Key:k,
        Value:undefined
       }),t);
      },
      Equals:function(other)
      {
       return this.get_Count()===other.get_Count()?Seq.forall2(function(x)
       {
        return function(y)
        {
         return Unchecked.Equals(x,y);
        };
       },this,other):false;
      },
      GetEnumerator:function()
      {
       return Enumerator.Get(Seq.map(function(kv)
       {
        return{
         K:kv.Key,
         V:kv.Value
        };
       },BalancedTree.Enumerate(false,this.tree)));
      },
      GetHashCode:function()
      {
       return Unchecked.Hash(Seq.toArray(this));
      },
      Remove:function(k)
      {
       var src;
       src=this.tree;
       return FSharpMap.New1(BalancedTree.Remove(Runtime.New(Pair,{
        Key:k,
        Value:undefined
       }),src));
      },
      TryFind:function(k)
      {
       var t;
       t=this.tree;
       return Option.map(function(kv)
       {
        return kv.Value;
       },BalancedTree.TryFind(Runtime.New(Pair,{
        Key:k,
        Value:undefined
       }),t));
      },
      get_Count:function()
      {
       var tree;
       tree=this.tree;
       return tree==null?0:tree.Count;
      },
      get_IsEmpty:function()
      {
       return this.tree==null;
      },
      get_Item:function(k)
      {
       var matchValue;
       matchValue=this.TryFind(k);
       return matchValue.$==0?Operators.FailWith("The given key was not present in the dictionary."):matchValue.$0;
      },
      get_Tree:function()
      {
       return this.tree;
      }
     },{
      New:function(s)
      {
       return Runtime.New(this,FSharpMap.New1(MapUtil.fromSeq(s)));
      },
      New1:function(tree)
      {
       var r;
       r=Runtime.New(this,{});
       r.tree=tree;
       return r;
      }
     }),
     FSharpSet:Runtime.Class({
      Add:function(x)
      {
       return FSharpSet.New1(BalancedTree.Add(x,this.tree));
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
       return this.get_Count()===other.get_Count()?Seq.forall2(function(x)
       {
        return function(y)
        {
         return Unchecked.Equals(x,y);
        };
       },this,other):false;
      },
      GetEnumerator:function()
      {
       return Enumerator.Get(BalancedTree.Enumerate(false,this.tree));
      },
      GetHashCode:function()
      {
       return-1741749453+Unchecked.Hash(Seq.toArray(this));
      },
      IsProperSubsetOf:function(s)
      {
       return this.IsSubsetOf(s)?this.get_Count()<s.get_Count():false;
      },
      IsProperSupersetOf:function(s)
      {
       return this.IsSupersetOf(s)?this.get_Count()>s.get_Count():false;
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
       return FSharpSet.New1(BalancedTree.Remove(v,this.tree));
      },
      add:function(x)
      {
       return FSharpSet.New1(BalancedTree.OfSeq(Seq.append(this,x)));
      },
      get_Count:function()
      {
       var tree;
       tree=this.tree;
       return tree==null?0:tree.Count;
      },
      get_IsEmpty:function()
      {
       return this.tree==null;
      },
      get_MaximumElement:function()
      {
       return Seq.head(BalancedTree.Enumerate(true,this.tree));
      },
      get_MinimumElement:function()
      {
       return Seq.head(BalancedTree.Enumerate(false,this.tree));
      },
      get_Tree:function()
      {
       return this.tree;
      },
      sub:function(x)
      {
       return SetModule.Filter(function(x1)
       {
        return!x.Contains(x1);
       },this);
      }
     },{
      New:function(s)
      {
       return Runtime.New(this,FSharpSet.New1(SetUtil.ofSeq(s)));
      },
      New1:function(tree)
      {
       var r;
       r=Runtime.New(this,{});
       r.tree=tree;
       return r;
      }
     }),
     LinkedList:{
      EnumeratorProxy:Runtime.Class({
       Dispose:function()
       {
        return null;
       },
       MoveNext:function()
       {
        this.c=this.c.n;
        return!Unchecked.Equals(this.c,null);
       },
       get_Current:function()
       {
        return this.c.v;
       }
      },{
       New:function(l)
       {
        var r;
        r=Runtime.New(this,{});
        r.c=l;
        return r;
       }
      }),
      ListProxy:Runtime.Class({
       AddAfter:function(after,value)
       {
        var before,node;
        before=after.n;
        node={
         p:after,
         n:before,
         v:value
        };
        if(Unchecked.Equals(after.n,null))
         {
          this.p=node;
         }
        after.n=node;
        if(!Unchecked.Equals(before,null))
         {
          before.p=node;
         }
        this.c=this.c+1;
        return node;
       },
       AddBefore:function(before,value)
       {
        var after,node;
        after=before.p;
        node={
         p:after,
         n:before,
         v:value
        };
        if(Unchecked.Equals(before.p,null))
         {
          this.n=node;
         }
        before.p=node;
        if(!Unchecked.Equals(after,null))
         {
          after.n=node;
         }
        this.c=this.c+1;
        return node;
       },
       AddFirst:function(value)
       {
        var node;
        if(this.c===0)
         {
          node={
           p:null,
           n:null,
           v:value
          };
          this.n=node;
          this.p=this.n;
          this.c=1;
          return node;
         }
        else
         {
          return this.AddBefore(this.n,value);
         }
       },
       AddLast:function(value)
       {
        var node;
        if(this.c===0)
         {
          node={
           p:null,
           n:null,
           v:value
          };
          this.n=node;
          this.p=this.n;
          this.c=1;
          return node;
         }
        else
         {
          return this.AddAfter(this.p,value);
         }
       },
       Clear:function()
       {
        this.c=0;
        this.n=null;
        this.p=null;
        return;
       },
       Contains:function(value)
       {
        var found,node;
        found=false;
        node=this.n;
        while(!Unchecked.Equals(node,null)?!found:false)
         {
          if(node.v==value)
           {
            found=true;
           }
          else
           {
            node=node.n;
           }
         }
        return found;
       },
       Find:function(value)
       {
        var node;
        node=this.n;
        while(!Unchecked.Equals(node,null)?node.v!=value:false)
         {
          node=node.n;
         }
        return node==value?node:null;
       },
       FindLast:function(value)
       {
        var node;
        node=this.p;
        while(!Unchecked.Equals(node,null)?node.v!=value:false)
         {
          node=node.p;
         }
        return node==value?node:null;
       },
       GetEnumerator:function()
       {
        return EnumeratorProxy.New(this);
       },
       Remove:function(node)
       {
        var before,after;
        before=node.p;
        after=node.n;
        if(Unchecked.Equals(before,null))
         {
          this.n=after;
         }
        else
         {
          before.n=after;
         }
        if(Unchecked.Equals(after,null))
         {
          this.p=before;
         }
        else
         {
          after.p=before;
         }
        this.c=this.c-1;
        return;
       },
       Remove1:function(value)
       {
        var node;
        node=this.Find(value);
        if(Unchecked.Equals(node,null))
         {
          return false;
         }
        else
         {
          this.Remove(node);
          return true;
         }
       },
       RemoveFirst:function()
       {
        return this.Remove(this.n);
       },
       RemoveLast:function()
       {
        return this.Remove(this.p);
       },
       get_Count:function()
       {
        return this.c;
       },
       get_First:function()
       {
        return this.n;
       },
       get_Last:function()
       {
        return this.p;
       }
      },{
       New:function()
       {
        return Runtime.New(this,ListProxy.New1(Seq.empty()));
       },
       New1:function(coll)
       {
        var r,ie,node;
        r=Runtime.New(this,{});
        r.c=0;
        r.n=null;
        r.p=null;
        ie=Enumerator.Get(coll);
        if(ie.MoveNext())
         {
          r.n={
           p:null,
           n:null,
           v:ie.get_Current()
          };
          r.p=r.n;
          r.c=1;
         }
        while(ie.MoveNext())
         {
          node={
           p:r.p,
           n:null,
           v:ie.get_Current()
          };
          r.p.n=node;
          r.p=node;
          r.c=r.c+1;
         }
        return r;
       }
      })
     },
     MapModule:{
      Exists:function(f,m)
      {
       return Seq.exists(function(kv)
       {
        return(f(kv.K))(kv.V);
       },m);
      },
      Filter:function(f,m)
      {
       var x;
       x=Seq.toArray(Seq.filter(function(kv)
       {
        return(f(kv.Key))(kv.Value);
       },BalancedTree.Enumerate(false,m.get_Tree())));
       return FSharpMap.New1(BalancedTree.Build(x,0,x.length-1));
      },
      FindKey:function(f,m)
      {
       return Seq.pick(function(kv)
       {
        return(f(kv.K))(kv.V)?{
         $:1,
         $0:kv.K
        }:{
         $:0
        };
       },m);
      },
      Fold:function(f,s,m)
      {
       return Seq.fold(function(s1)
       {
        return function(kv)
        {
         return((f(s1))(kv.Key))(kv.Value);
        };
       },s,BalancedTree.Enumerate(false,m.get_Tree()));
      },
      FoldBack:function(f,m,s)
      {
       return Seq.fold(function(s1)
       {
        return function(kv)
        {
         return((f(kv.Key))(kv.Value))(s1);
        };
       },s,BalancedTree.Enumerate(true,m.get_Tree()));
      },
      ForAll:function(f,m)
      {
       return Seq.forall(function(kv)
       {
        return(f(kv.K))(kv.V);
       },m);
      },
      Iterate:function(f,m)
      {
       return Seq.iter(function(kv)
       {
        return(f(kv.K))(kv.V);
       },m);
      },
      Map:function(f,m)
      {
       return FSharpMap.New1(BalancedTree.OfSeq(Seq.map(function(kv)
       {
        return Runtime.New(Pair,{
         Key:kv.Key,
         Value:(f(kv.Key))(kv.Value)
        });
       },BalancedTree.Enumerate(false,m.get_Tree()))));
      },
      OfArray:function(a)
      {
       return FSharpMap.New1(BalancedTree.OfSeq(Seq.map(Runtime.Tupled(function(tupledArg)
       {
        return Runtime.New(Pair,{
         Key:tupledArg[0],
         Value:tupledArg[1]
        });
       }),a)));
      },
      Partition:function(f,m)
      {
       var patternInput,y,x;
       patternInput=Arrays.partition(function(kv)
       {
        return(f(kv.Key))(kv.Value);
       },Seq.toArray(BalancedTree.Enumerate(false,m.get_Tree())));
       y=patternInput[1];
       x=patternInput[0];
       return[FSharpMap.New1(BalancedTree.Build(x,0,x.length-1)),FSharpMap.New1(BalancedTree.Build(y,0,y.length-1))];
      },
      Pick:function(f,m)
      {
       return Seq.pick(function(kv)
       {
        return(f(kv.K))(kv.V);
       },m);
      },
      ToSeq:function(m)
      {
       return Seq.map(function(kv)
       {
        return[kv.Key,kv.Value];
       },BalancedTree.Enumerate(false,m.get_Tree()));
      },
      TryFind:function(k,m)
      {
       return m.TryFind(k);
      },
      TryFindKey:function(f,m)
      {
       return Seq.tryPick(function(kv)
       {
        return(f(kv.K))(kv.V)?{
         $:1,
         $0:kv.K
        }:{
         $:0
        };
       },m);
      },
      TryPick:function(f,m)
      {
       return Seq.tryPick(function(kv)
       {
        return(f(kv.K))(kv.V);
       },m);
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
         return[Runtime.New(Pair,{
          Key:matchValue[0],
          Value:matchValue[1]
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
     Pair:Runtime.Class({
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
       return Unchecked.Hash(this.Key);
      }
     }),
     ResizeArray:{
      ResizeArrayProxy:Runtime.Class({
       Add:function(x)
       {
        return this.arr.push(x);
       },
       AddRange:function(x)
       {
        var _this=this;
        return Seq.iter(function(arg00)
        {
         return _this.Add(arg00);
        },x);
       },
       Clear:function()
       {
        ResizeArray.splice(this.arr,0,IntrinsicFunctionProxy.GetLength(this.arr),[]);
       },
       CopyTo:function(arr)
       {
        return this.CopyTo1(arr,0);
       },
       CopyTo1:function(arr,offset)
       {
        return this.CopyTo2(0,arr,offset,this.get_Count());
       },
       CopyTo2:function(index,target,offset,count)
       {
        return Arrays.blit(this.arr,index,target,offset,count);
       },
       GetEnumerator:function()
       {
        return Enumerator.Get(this.arr);
       },
       GetRange:function(index,count)
       {
        return ResizeArrayProxy.New3(Arrays.sub(this.arr,index,count));
       },
       Insert:function(index,items)
       {
        ResizeArray.splice(this.arr,index,0,[items]);
       },
       InsertRange:function(index,items)
       {
        ResizeArray.splice(this.arr,index,0,Seq.toArray(items));
       },
       RemoveAt:function(x)
       {
        ResizeArray.splice(this.arr,x,1,[]);
       },
       RemoveRange:function(index,count)
       {
        ResizeArray.splice(this.arr,index,count,[]);
       },
       Reverse:function()
       {
        return this.arr.reverse();
       },
       Reverse1:function(index,count)
       {
        return Arrays.reverse(this.arr,index,count);
       },
       ToArray:function()
       {
        return this.arr.slice();
       },
       get_Count:function()
       {
        return IntrinsicFunctionProxy.GetLength(this.arr);
       },
       get_Item:function(x)
       {
        return this.arr[x];
       },
       set_Item:function(x,v)
       {
        this.arr[x]=v;
       }
      },{
       New:function(el)
       {
        return Runtime.New(this,ResizeArrayProxy.New3(Seq.toArray(el)));
       },
       New1:function()
       {
        return Runtime.New(this,ResizeArrayProxy.New3([]));
       },
       New2:function()
       {
        return Runtime.New(this,ResizeArrayProxy.New3([]));
       },
       New3:function(arr)
       {
        var r;
        r=Runtime.New(this,{});
        r.arr=arr;
        return r;
       }
      }),
      splice:function($arr,$index,$howMany,$items)
      {
       var $0=this,$this=this;
       return Global.Array.prototype.splice.apply($arr,[$index,$howMany].concat($items));
      }
     },
     SetModule:{
      Filter:function(f,s)
      {
       var data;
       data=Seq.toArray(Seq.filter(f,s));
       return FSharpSet.New1(BalancedTree.Build(data,0,data.length-1));
      },
      FoldBack:function(f,a,s)
      {
       return Seq.fold(function(s1)
       {
        return function(x)
        {
         return(f(x))(s1);
        };
       },s,BalancedTree.Enumerate(true,a.get_Tree()));
      },
      Partition:function(f,a)
      {
       var patternInput,y;
       patternInput=Arrays.partition(f,Seq.toArray(a));
       y=patternInput[1];
       return[FSharpSet.New1(BalancedTree.OfSeq(patternInput[0])),FSharpSet.New1(BalancedTree.OfSeq(y))];
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
  Seq=Runtime.Safe(WebSharper.Seq);
  List=Runtime.Safe(WebSharper.List);
  T=Runtime.Safe(List.T);
  Arrays=Runtime.Safe(WebSharper.Arrays);
  IntrinsicFunctionProxy=Runtime.Safe(WebSharper.IntrinsicFunctionProxy);
  Enumerator=Runtime.Safe(WebSharper.Enumerator);
  JavaScript=Runtime.Safe(WebSharper.JavaScript);
  DictionaryUtil=Runtime.Safe(Collections.DictionaryUtil);
  Dictionary=Runtime.Safe(Collections.Dictionary);
  Unchecked=Runtime.Safe(WebSharper.Unchecked);
  FSharpMap=Runtime.Safe(Collections.FSharpMap);
  Pair=Runtime.Safe(Collections.Pair);
  Option=Runtime.Safe(WebSharper.Option);
  MapUtil=Runtime.Safe(Collections.MapUtil);
  FSharpSet=Runtime.Safe(Collections.FSharpSet);
  SetModule=Runtime.Safe(Collections.SetModule);
  SetUtil=Runtime.Safe(Collections.SetUtil);
  LinkedList=Runtime.Safe(Collections.LinkedList);
  EnumeratorProxy=Runtime.Safe(LinkedList.EnumeratorProxy);
  ListProxy=Runtime.Safe(LinkedList.ListProxy);
  ResizeArray=Runtime.Safe(Collections.ResizeArray);
  return ResizeArrayProxy=Runtime.Safe(ResizeArray.ResizeArrayProxy);
 });
 Runtime.OnLoad(function()
 {
  return;
 });
}());
