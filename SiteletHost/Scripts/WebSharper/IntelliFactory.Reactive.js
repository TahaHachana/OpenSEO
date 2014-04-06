(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Reactive,Disposable,HotStream,WebSharper,Control,FSharpEvent,Observer,Observable,Util,Collections,Dictionary,Operators,Seq,Reactive1,Reactive2,List,T;
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
    HotStream:Runtime.Class({
     Subscribe:function(o)
     {
      if(this.Latest.contents.$==1)
       {
        o.OnNext(this.Latest.contents.$0);
       }
      return this.Event.event.Subscribe(o);
     },
     Trigger:function(v)
     {
      this.Latest.contents={
       $:1,
       $0:v
      };
      return this.Event.event.Trigger(v);
     }
    },{
     New:function(x)
     {
      return Runtime.New(HotStream,{
       Latest:{
        contents:{
         $:1,
         $0:x
        }
       },
       Event:FSharpEvent.New()
      });
     },
     New1:function()
     {
      return Runtime.New(HotStream,{
       Latest:{
        contents:{
         $:0
        }
       },
       Event:FSharpEvent.New()
      });
     }
    }),
    Observable:Runtime.Class({
     Subscribe:function(o)
     {
      return this.OnSubscribe.call(null,o);
     },
     SubscribeWith:function(onNext,onComplete)
     {
      return this.OnSubscribe.call(null,Observer.New(onNext,onComplete));
     }
    },{
     New:function(f)
     {
      return Runtime.New(Observable,{
       OnSubscribe:f
      });
     }
    }),
    Observer:Runtime.Class({
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
      return Runtime.New(Observer,{
       OnNext1:onNext,
       OnCompleted1:onComplete
      });
     }
    }),
    Reactive:{
     Aggregate:function(io,seed,acc)
     {
      return Observable.New(function(o)
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
      return Observable.New(function(o1)
      {
       return Util.subscribeTo(io,function(v)
       {
        var matchValue;
        matchValue=f(v);
        return matchValue.$==0?null:o1.OnNext(matchValue.$0);
       });
      });
     },
     CollectLatest:function(outer)
     {
      return Observable.New(function(o)
      {
       var dict,index;
       dict=Dictionary.New21();
       index={
        contents:0
       };
       return Util.subscribeTo(outer,function(inner)
       {
        var currentIndex;
        Operators.Increment(index);
        currentIndex=index.contents;
        Util.subscribeTo(inner,function(value)
        {
         dict.set_Item(currentIndex,value);
         return o.OnNext(Seq.delay(function()
         {
          return Seq.map(function(pair)
          {
           return pair.V;
          },dict);
         }));
        });
        return;
       });
      });
     },
     CombineLatest:function(io1,io2,f)
     {
      return Observable.New(function(o)
      {
       var lv1,lv2,update,o1,o2,d1,d2;
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
        var matchValue,v2;
        matchValue=[lv1.contents,lv2.contents];
        if(matchValue[0].$==1)
         {
          if(matchValue[1].$==1)
           {
            v2=matchValue[1].$0;
            return o.OnNext((f(matchValue[0].$0))(v2));
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
       o1=Observer.New(function(x)
       {
        lv1.contents={
         $:1,
         $0:x
        };
        return update(null);
       },function()
       {
       });
       o2=Observer.New(function(y)
       {
        lv2.contents={
         $:1,
         $0:y
        };
        return update(null);
       },function()
       {
       });
       d1=io1.Subscribe(o1);
       d2=io2.Subscribe(o2);
       return Disposable.New(function()
       {
        d1.Dispose();
        return d2.Dispose();
       });
      });
     },
     Concat:function(io1,io2)
     {
      return Observable.New(function(o)
      {
       var innerDisp,outerDisp;
       innerDisp={
        contents:{
         $:0
        }
       };
       outerDisp=io1.Subscribe(Observer.New(function(arg00)
       {
        return o.OnNext(arg00);
       },function()
       {
        innerDisp.contents={
         $:1,
         $0:io2.Subscribe(o)
        };
       }));
       return Disposable.New(function()
       {
        if(innerDisp.contents.$==1)
         {
          innerDisp.contents.$0.Dispose();
         }
        return outerDisp.Dispose();
       });
      });
     },
     Default:Runtime.Field(function()
     {
      return Reactive2.New();
     }),
     Drop:function(io,count)
     {
      return Observable.New(function(o1)
      {
       var index;
       index={
        contents:0
       };
       return Util.subscribeTo(io,function(v)
       {
        Operators.Increment(index);
        return index.contents>count?o1.OnNext(v):null;
       });
      });
     },
     Heat:function(io)
     {
      var s;
      s=HotStream.New1();
      Util.subscribeTo(io,function(arg00)
      {
       return s.Trigger(arg00);
      });
      return s;
     },
     Merge:function(io1,io2)
     {
      return Observable.New(function(o)
      {
       var completed1,completed2,disp1,disp2;
       completed1={
        contents:false
       };
       completed2={
        contents:false
       };
       disp1=io1.Subscribe(Observer.New(function(arg00)
       {
        return o.OnNext(arg00);
       },function()
       {
        completed1.contents=true;
        return(completed1.contents?completed2.contents:false)?o.OnCompleted():null;
       }));
       disp2=io2.Subscribe(Observer.New(function(arg00)
       {
        return o.OnNext(arg00);
       },function()
       {
        completed2.contents=true;
        return(completed1.contents?completed2.contents:false)?o.OnCompleted():null;
       }));
       return Disposable.New(function()
       {
        disp1.Dispose();
        return disp2.Dispose();
       });
      });
     },
     Never:function()
     {
      return Observable.New(function()
      {
       return Disposable.New(function()
       {
       });
      });
     },
     Range:function(start,count)
     {
      return Observable.New(function(o)
      {
       var i;
       for(i=start;i<=start+count;i++){
        o.OnNext(i);
       }
       return Disposable.New(function()
       {
       });
      });
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
       return Runtime.New(this,{});
      }
     }),
     Return:function(x)
     {
      return Observable.New(function(o)
      {
       o.OnNext(x);
       o.OnCompleted();
       return Disposable.New(function()
       {
       });
      });
     },
     Select:function(io,f)
     {
      return Observable.New(function(o1)
      {
       return Util.subscribeTo(io,function(v)
       {
        return o1.OnNext(f(v));
       });
      });
     },
     SelectMany:function(io)
     {
      return Observable.New(function(o)
      {
       var disp,d;
       disp={
        contents:function()
        {
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
        return;
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
       return ios1.$==1?Reactive1.CombineLatest(ios1.$0,sequence(ios1.$1),function(x)
       {
        return function(y)
        {
         return Runtime.New(T,{
          $:1,
          $0:x,
          $1:y
         });
        };
       }):Reactive1.Return(Runtime.New(T,{
        $:0
       }));
      };
      return Reactive1.Select(sequence(List.ofSeq(ios)),function(source)
      {
       return source;
      });
     },
     Switch:function(io)
     {
      return Observable.New(function(o)
      {
       var index,disp;
       index={
        contents:0
       };
       disp={
        contents:{
         $:0
        }
       };
       return Util.subscribeTo(io,function(o1)
       {
        var currentIndex;
        Operators.Increment(index);
        if(disp.contents.$==1)
         {
          disp.contents.$0.Dispose();
         }
        currentIndex=index.contents;
        disp.contents={
         $:1,
         $0:Util.subscribeTo(o1,function(v)
         {
          return currentIndex===index.contents?o.OnNext(v):null;
         })
        };
        return;
       });
      });
     },
     Where:function(io,f)
     {
      return Observable.New(function(o1)
      {
       return Util.subscribeTo(io,function(v)
       {
        return f(v)?o1.OnNext(v):null;
       });
      });
     }
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Reactive=Runtime.Safe(Global.IntelliFactory.Reactive);
  Disposable=Runtime.Safe(Reactive.Disposable);
  HotStream=Runtime.Safe(Reactive.HotStream);
  WebSharper=Runtime.Safe(Global.IntelliFactory.WebSharper);
  Control=Runtime.Safe(WebSharper.Control);
  FSharpEvent=Runtime.Safe(Control.FSharpEvent);
  Observer=Runtime.Safe(Reactive.Observer);
  Observable=Runtime.Safe(Reactive.Observable);
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
  return;
 });
}());
