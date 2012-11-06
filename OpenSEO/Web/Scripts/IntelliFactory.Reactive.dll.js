(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Reactive,Disposable,_HotStream_1,WebSharper,Control,_FSharpEvent_1,_Observer_1,_Observable_1,Util,Collections,Dictionary,Operators,Seq,Reactive1,Reactive2,List,T;
 Runtime.Define(Global,{
  IntelliFactory:{
   Reactive:{
    Disposable:Runtime.Class({
     Dispose:function()
     {
      return this.Dispose1.call(null,null);
     }
    },{
     New:function(d)
     {
      return Runtime.New(Disposable,{
       Dispose1:d
      });
     }
    }),
    "HotStream`1":Runtime.Class({
     Subscribe:function(o)
     {
      var _this;
      if(this.Latest.contents.$==1)
       {
        o.OnNext(this.Latest.contents.$0);
       }
      return(_this=this.Event,_this.event).Subscribe(o);
     },
     Trigger:function(v)
     {
      var _this;
      this.Latest.contents={
       $:1,
       $0:v
      };
      _this=this.Event;
      return _this.event.Trigger(v);
     }
    },{
     New:function(x)
     {
      var value;
      return Runtime.New(_HotStream_1,{
       Latest:(value={
        $:1,
        $0:x
       },{
        contents:value
       }),
       Event:_FSharpEvent_1.New()
      });
     },
     New1:function()
     {
      return Runtime.New(_HotStream_1,{
       Latest:{
        contents:{
         $:0
        }
       },
       Event:_FSharpEvent_1.New()
      });
     }
    }),
    "Observable`1":Runtime.Class({
     Subscribe:function(o)
     {
      return this.OnSubscribe.call(null,o);
     },
     SubscribeWith:function(onNext,onComplete)
     {
      var x,f;
      x=_Observer_1.New(onNext,onComplete);
      f=this.OnSubscribe;
      return f(x);
     }
    },{
     New:function(f)
     {
      return Runtime.New(_Observable_1,{
       OnSubscribe:f
      });
     }
    }),
    "Observer`1":Runtime.Class({
     OnCompleted:function()
     {
      return this.OnCompleted1.call(null,null);
     },
     OnError:function()
     {
      return null;
     },
     OnNext:function(t)
     {
      return this.OnNext1.call(null,t);
     }
    },{
     New:function(onNext,onComplete)
     {
      return Runtime.New(_Observer_1,{
       OnNext1:onNext,
       OnCompleted1:onComplete
      });
     }
    }),
    Reactive:{
     Aggregate:function(io,seed,acc)
     {
      return _Observable_1.New(function(o)
      {
       var state;
       state={
        contents:seed
       };
       return Util.subscribeTo(io,function(value)
       {
        state.contents=(acc(state.contents))(value);
        return o.OnNext(state.contents);
       });
      });
     },
     Choose:function(io,f)
     {
      var arg00;
      arg00=function(o1)
      {
       return Util.subscribeTo(io,function(v)
       {
        var matchValue,v1;
        matchValue=f(v);
        if(matchValue.$==0)
         {
          return null;
         }
        else
         {
          v1=matchValue.$0;
          return o1.OnNext(v1);
         }
       });
      };
      return _Observable_1.New(arg00);
     },
     CollectLatest:function(outer)
     {
      return _Observable_1.New(function(o)
      {
       var dict,index;
       dict=Dictionary.New2();
       index={
        contents:0
       };
       return Util.subscribeTo(outer,function(inner)
       {
        var currentIndex,x,f1;
        Operators.Increment(index);
        currentIndex=index.contents;
        x=Util.subscribeTo(inner,function(value)
        {
         var x1,f;
         dict.set_Item(currentIndex,value);
         x1=Seq.delay(function()
         {
          return Seq.map(function(pair)
          {
           return pair.V;
          },dict);
         });
         f=function(arg00)
         {
          return o.OnNext(arg00);
         };
         return f(x1);
        });
        f1=function(value)
        {
         value;
        };
        return f1(x);
       });
      });
     },
     CombineLatest:function(io1,io2,f)
     {
      var arg00;
      arg00=function(o)
      {
       var lv1,lv2,update,o1,onNext,arg10,o2,onNext1,arg101,d1,d2;
       lv1={
        contents:{
         $:0
        }
       };
       lv2={
        contents:{
         $:0
        }
       };
       update=function()
       {
        var matchValue,v1,v2;
        matchValue=[lv1.contents,lv2.contents];
        if(matchValue[0].$==1)
         {
          if(matchValue[1].$==1)
           {
            v1=matchValue[0].$0;
            v2=matchValue[1].$0;
            return o.OnNext((f(v1))(v2));
           }
          else
           {
            return null;
           }
         }
        else
         {
          return null;
         }
       };
       o1=(onNext=function(x)
       {
        lv1.contents={
         $:1,
         $0:x
        };
        return update(null);
       },(arg10=function(value)
       {
        value;
       },_Observer_1.New(onNext,arg10)));
       o2=(onNext1=function(y)
       {
        lv2.contents={
         $:1,
         $0:y
        };
        return update(null);
       },(arg101=function(value)
       {
        value;
       },_Observer_1.New(onNext1,arg101)));
       d1=io1.Subscribe(o1);
       d2=io2.Subscribe(o2);
       return Disposable.New(function()
       {
        d1.Dispose();
        return d2.Dispose();
       });
      };
      return _Observable_1.New(arg00);
     },
     Concat:function(io1,io2)
     {
      var arg00;
      arg00=function(o)
      {
       var innerDisp,outerDisp,x,arg001,arg10,f;
       innerDisp={
        contents:{
         $:0
        }
       };
       outerDisp=(x=(arg001=function(arg002)
       {
        return o.OnNext(arg002);
       },(arg10=function()
       {
        innerDisp.contents={
         $:1,
         $0:io2.Subscribe(o)
        };
       },_Observer_1.New(arg001,arg10))),(f=function(arg002)
       {
        return io1.Subscribe(arg002);
       },f(x)));
       return Disposable.New(function()
       {
        if(innerDisp.contents.$==1)
         {
          innerDisp.contents.$0.Dispose();
         }
        return outerDisp.Dispose();
       });
      };
      return _Observable_1.New(arg00);
     },
     Default:Runtime.Field(function()
     {
      return Reactive2.New();
     }),
     Drop:function(io,count)
     {
      var arg00;
      arg00=function(o1)
      {
       var index;
       index={
        contents:0
       };
       return Util.subscribeTo(io,function(v)
       {
        Operators.Increment(index);
        if(index.contents>count)
         {
          return o1.OnNext(v);
         }
        else
         {
          return null;
         }
       });
      };
      return _Observable_1.New(arg00);
     },
     Heat:function(io)
     {
      var s,disp;
      s=_HotStream_1.New1();
      disp=Util.subscribeTo(io,function(arg00)
      {
       return s.Trigger(arg00);
      });
      return s;
     },
     Merge:function(io1,io2)
     {
      var arg00;
      arg00=function(o)
      {
       var completed1,completed2,disp1,x,arg001,arg10,f,disp2,x1,arg003,arg101,f1;
       completed1={
        contents:false
       };
       completed2={
        contents:false
       };
       disp1=(x=(arg001=function(arg002)
       {
        return o.OnNext(arg002);
       },(arg10=function()
       {
        completed1.contents=true;
        if(completed1.contents?completed2.contents:false)
         {
          return o.OnCompleted();
         }
        else
         {
          return null;
         }
       },_Observer_1.New(arg001,arg10))),(f=function(arg002)
       {
        return io1.Subscribe(arg002);
       },f(x)));
       disp2=(x1=(arg003=function(arg002)
       {
        return o.OnNext(arg002);
       },(arg101=function()
       {
        completed2.contents=true;
        if(completed1.contents?completed2.contents:false)
         {
          return o.OnCompleted();
         }
        else
         {
          return null;
         }
       },_Observer_1.New(arg003,arg101))),(f1=function(arg002)
       {
        return io2.Subscribe(arg002);
       },f1(x1)));
       return Disposable.New(function()
       {
        disp1.Dispose();
        return disp2.Dispose();
       });
      };
      return _Observable_1.New(arg00);
     },
     Never:function()
     {
      return _Observable_1.New(function()
      {
       return Disposable.New(function(value)
       {
        value;
       });
      });
     },
     Range:function(start,count)
     {
      var arg00;
      arg00=function(o)
      {
       var i;
       for(i=start;i<=start+count;i++){
        o.OnNext(i);
       }
       return Disposable.New(function(value)
       {
        value;
       });
      };
      return _Observable_1.New(arg00);
     },
     Reactive:Runtime.Class({
      Aggregate:function(io,s,a)
      {
       return Reactive1.Aggregate(io,s,a);
      },
      Choose:function(io,f)
      {
       return Reactive1.Choose(io,f);
      },
      CollectLatest:function(io)
      {
       return Reactive1.CollectLatest(io);
      },
      CombineLatest:function(io1,io2,f)
      {
       return Reactive1.CombineLatest(io1,io2,f);
      },
      Concat:function(io1,io2)
      {
       return Reactive1.Concat(io1,io2);
      },
      Drop:function(io,count)
      {
       return Reactive1.Drop(io,count);
      },
      Heat:function(io)
      {
       return Reactive1.Heat(io);
      },
      Merge:function(io1,io2)
      {
       return Reactive1.Merge(io1,io2);
      },
      Never:function()
      {
       return Reactive1.Never();
      },
      Return:function(x)
      {
       return Reactive1.Return(x);
      },
      Select:function(io,f)
      {
       return Reactive1.Select(io,f);
      },
      SelectMany:function(io)
      {
       return Reactive1.SelectMany(io);
      },
      Sequence:function(ios)
      {
       return Reactive1.Sequence(ios);
      },
      Switch:function(io)
      {
       return Reactive1.Switch(io);
      },
      Where:function(io,f)
      {
       return Reactive1.Where(io,f);
      }
     },{
      New:function()
      {
       var r;
       r={};
       return Runtime.New(this,r);
      }
     }),
     Return:function(x)
     {
      var f;
      f=function(o)
      {
       o.OnNext(x);
       o.OnCompleted();
       return Disposable.New(function(value)
       {
        value;
       });
      };
      return _Observable_1.New(f);
     },
     Select:function(io,f)
     {
      return _Observable_1.New(function(o1)
      {
       return Util.subscribeTo(io,function(v)
       {
        return o1.OnNext(f(v));
       });
      });
     },
     SelectMany:function(io)
     {
      return _Observable_1.New(function(o)
      {
       var disp,d;
       disp={
        contents:function(value)
        {
         value;
        }
       };
       d=Util.subscribeTo(io,function(o1)
       {
        var d1;
        d1=Util.subscribeTo(o1,function(arg00)
        {
         return o.OnNext(arg00);
        });
        disp.contents=function()
        {
         disp.contents.call(null,null);
         return d1.Dispose();
        };
       });
       return Disposable.New(function()
       {
        disp.contents.call(null,null);
        return d.Dispose();
       });
      });
     },
     Sequence:function(ios)
     {
      var sequence;
      sequence=function(ios1)
      {
       var xs,x,rest;
       if(ios1.$==1)
        {
         xs=ios1.$1;
         x=ios1.$0;
         rest=sequence(xs);
         return Reactive1.CombineLatest(x,rest,function(x1)
         {
          return function(y)
          {
           return Runtime.New(T,{
            $:1,
            $0:x1,
            $1:y
           });
          };
         });
        }
       else
        {
         return Reactive1.Return(Runtime.New(T,{
          $:0
         }));
        }
      };
      return Reactive1.Select(sequence(List.ofSeq(ios)),function(source)
      {
       return source;
      });
     },
     Switch:function(io)
     {
      return _Observable_1.New(function(o)
      {
       var disp,index,disp1;
       disp=(index={
        contents:0
       },(disp1={
        contents:{
         $:0
        }
       },Util.subscribeTo(io,function(o1)
       {
        var currentIndex,d,x,f;
        Operators.Increment(index);
        if(disp1.contents.$==1)
         {
          disp1.contents.$0.Dispose();
         }
        currentIndex=index.contents;
        d=(x=Util.subscribeTo(o1,function(v)
        {
         if(currentIndex===index.contents)
          {
           return o.OnNext(v);
          }
         else
          {
           return null;
          }
        }),(f=function(arg0)
        {
         return{
          $:1,
          $0:arg0
         };
        },f(x)));
        disp1.contents=d;
       })));
       return disp;
      });
     },
     Where:function(io,f)
     {
      var arg00;
      arg00=function(o1)
      {
       return Util.subscribeTo(io,function(v)
       {
        if(f(v))
         {
          return o1.OnNext(v);
         }
        else
         {
          return null;
         }
       });
      };
      return _Observable_1.New(arg00);
     }
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Reactive=Runtime.Safe(Global.IntelliFactory.Reactive);
  Disposable=Runtime.Safe(Reactive.Disposable);
  _HotStream_1=Runtime.Safe(Reactive["HotStream`1"]);
  WebSharper=Runtime.Safe(Global.IntelliFactory.WebSharper);
  Control=Runtime.Safe(WebSharper.Control);
  _FSharpEvent_1=Runtime.Safe(Control["FSharpEvent`1"]);
  _Observer_1=Runtime.Safe(Reactive["Observer`1"]);
  _Observable_1=Runtime.Safe(Reactive["Observable`1"]);
  Util=Runtime.Safe(WebSharper.Util);
  Collections=Runtime.Safe(WebSharper.Collections);
  Dictionary=Runtime.Safe(Collections.Dictionary);
  Operators=Runtime.Safe(WebSharper.Operators);
  Seq=Runtime.Safe(WebSharper.Seq);
  Reactive1=Runtime.Safe(Reactive.Reactive);
  Reactive2=Runtime.Safe(Reactive1.Reactive);
  List=Runtime.Safe(WebSharper.List);
  return T=Runtime.Safe(List.T);
 });
 Runtime.OnLoad(function()
 {
  Reactive1.Default();
 });
}());
