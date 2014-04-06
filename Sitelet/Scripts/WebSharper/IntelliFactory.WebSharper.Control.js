(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,WebSharper,List,Arrays,Unchecked,Control,Disposable,IntrinsicFunctionProxy,FSharpEvent,Util,Event,Event1,EventModule,HotStream,HotStream1,Observable,Observer,Operators,Observable1,T,ObservableModule,Observer1;
 Runtime.Define(Global,{
  IntelliFactory:{
   WebSharper:{
    Control:{
     Disposable:{
      Of:function(dispose)
      {
       return{
        Dispose:dispose
       };
      }
     },
     Event:{
      Event:Runtime.Class({
       AddHandler:function(h)
       {
        return this.Handlers.push(h);
       },
       RemoveHandler:function(h)
       {
        var x;
        x=List.ofArray(Arrays.choose(function(x1)
        {
         return x1;
        },Arrays.mapi(function(i)
        {
         return function(x1)
         {
          return Unchecked.Equals(x1,h)?{
           $:1,
           $0:i
          }:{
           $:0
          };
         };
        },this.Handlers)));
        return x.$==1?this.Handlers.splice(x.$0,1):null;
       },
       Subscribe:function(observer)
       {
        var h,_this=this;
        h=function(x)
        {
         return observer.OnNext(x);
        };
        this.AddHandler(h);
        return Disposable.Of(function()
        {
         return _this.RemoveHandler(h);
        });
       },
       Trigger:function(x)
       {
        var i;
        for(i=0;i<=IntrinsicFunctionProxy.GetLength(this.Handlers)-1;i++){
         this.Handlers[i].call(null,x);
        }
        return;
       }
      })
     },
     EventModule:{
      Choose:function(c,e)
      {
       var r;
       r=FSharpEvent.New();
       Util.addListener(e,function(x)
       {
        var matchValue;
        matchValue=c(x);
        return matchValue.$==0?null:r.event.Trigger(matchValue.$0);
       });
       return r.event;
      },
      Filter:function(ok,e)
      {
       var r;
       r=Runtime.New(Event1,{
        Handlers:[]
       });
       Util.addListener(e,function(x)
       {
        return ok(x)?r.Trigger(x):null;
       });
       return r;
      },
      Map:function(f,e)
      {
       var r;
       r=Runtime.New(Event1,{
        Handlers:[]
       });
       Util.addListener(e,function(x)
       {
        return r.Trigger(f(x));
       });
       return r;
      },
      Merge:function(e1,e2)
      {
       var r;
       r=Runtime.New(Event1,{
        Handlers:[]
       });
       Util.addListener(e1,function(arg00)
       {
        return r.Trigger(arg00);
       });
       Util.addListener(e2,function(arg00)
       {
        return r.Trigger(arg00);
       });
       return r;
      },
      Pairwise:function(e)
      {
       var buf,ev;
       buf={
        contents:{
         $:0
        }
       };
       ev=Runtime.New(Event1,{
        Handlers:[]
       });
       Util.addListener(e,function(x)
       {
        var matchValue,old;
        matchValue=buf.contents;
        if(matchValue.$==1)
         {
          old=matchValue.$0;
          buf.contents={
           $:1,
           $0:x
          };
          return ev.Trigger([old,x]);
         }
        else
         {
          buf.contents={
           $:1,
           $0:x
          };
          return;
         }
       });
       return ev;
      },
      Partition:function(f,e)
      {
       return[EventModule.Filter(f,e),EventModule.Filter(function(x)
       {
        return!f(x);
       },e)];
      },
      Scan:function(fold,seed,e)
      {
       var state;
       state={
        contents:seed
       };
       return EventModule.Map(function(value)
       {
        state.contents=(fold(state.contents))(value);
        return state.contents;
       },e);
      },
      Split:function(f,e)
      {
       return[EventModule.Choose(function(x)
       {
        var matchValue;
        matchValue=f(x);
        return matchValue.$==0?{
         $:1,
         $0:matchValue.$0
        }:{
         $:0
        };
       },e),EventModule.Choose(function(x)
       {
        var matchValue;
        matchValue=f(x);
        return matchValue.$==1?{
         $:1,
         $0:matchValue.$0
        }:{
         $:0
        };
       },e)];
      }
     },
     FSharpEvent:Runtime.Class({},{
      New:function()
      {
       var r;
       r=Runtime.New(this,{});
       r.event=Runtime.New(Event1,{
        Handlers:[]
       });
       return r;
      }
     }),
     HotStream:{
      HotStream:Runtime.Class({
       Subscribe:function(o)
       {
        if(this.Latest.contents.$==1)
         {
          o.OnNext(this.Latest.contents.$0);
         }
        return Util.subscribeTo(this.Event.event,function(v)
        {
         return o.OnNext(v);
        });
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
       New:function()
       {
        return Runtime.New(HotStream1,{
         Latest:{
          contents:{
           $:0
          }
         },
         Event:FSharpEvent.New()
        });
       }
      })
     },
     Observable:{
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
      Choose:function(f,io)
      {
       return Observable.New(function(o1)
       {
        return io.Subscribe(Observer.New(function(v)
        {
         var matchValue;
         matchValue=f(v);
         return matchValue.$==0?null:o1.OnNext(matchValue.$0);
        },function(arg00)
        {
         return o1.OnError(arg00);
        },function()
        {
         return o1.OnCompleted();
        }));
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
        },function()
        {
        });
        d1=io1.Subscribe(o1);
        d2=io2.Subscribe(o2);
        return Disposable.Of(function()
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
        },function()
        {
         innerDisp.contents={
          $:1,
          $0:io2.Subscribe(o)
         };
        }));
        return Disposable.Of(function()
        {
         if(innerDisp.contents.$==1)
          {
           innerDisp.contents.$0.Dispose();
          }
         return outerDisp.Dispose();
        });
       });
      },
      Drop:function(count,io)
      {
       return Observable.New(function(o1)
       {
        var index;
        index={
         contents:0
        };
        return io.Subscribe(Observer.New(function(v)
        {
         Operators.Increment(index);
         return index.contents>count?o1.OnNext(v):null;
        },function(arg00)
        {
         return o1.OnError(arg00);
        },function()
        {
         return o1.OnCompleted();
        }));
       });
      },
      Filter:function(f,io)
      {
       return Observable.New(function(o1)
       {
        return io.Subscribe(Observer.New(function(v)
        {
         return f(v)?o1.OnNext(v):null;
        },function(arg00)
        {
         return o1.OnError(arg00);
        },function()
        {
         return o1.OnCompleted();
        }));
       });
      },
      Map:function(f,io)
      {
       return Observable.New(function(o1)
       {
        return io.Subscribe(Observer.New(function(v)
        {
         return o1.OnNext(f(v));
        },function(arg00)
        {
         return o1.OnError(arg00);
        },function()
        {
         return o1.OnCompleted();
        }));
       });
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
        },function()
        {
         completed2.contents=true;
         return(completed1.contents?completed2.contents:false)?o.OnCompleted():null;
        }));
        return Disposable.Of(function()
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
        return Disposable.Of(function()
        {
        });
       });
      },
      New:function(f)
      {
       return Runtime.New(Observable1,{
        Subscribe1:f
       });
      },
      Observable:Runtime.Class({
       Subscribe:function(observer)
       {
        return this.Subscribe1.call(null,observer);
       }
      }),
      Of:function(f)
      {
       return Observable.New(function(o)
       {
        return Disposable.Of(f(function(x)
        {
         return o.OnNext(x);
        }));
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
        return Disposable.Of(function()
        {
        });
       });
      },
      Return:function(x)
      {
       return Observable.New(function(o)
       {
        o.OnNext(x);
        o.OnCompleted();
        return Disposable.Of(function()
        {
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
         d1=Util.subscribeTo(o1,function(v)
         {
          return o.OnNext(v);
         });
         disp.contents=function()
         {
          disp.contents.call(null,null);
          return d1.Dispose();
         };
         return;
        });
        return Disposable.Of(function()
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
        return ios1.$==1?Observable.CombineLatest(ios1.$0,sequence(ios1.$1),function(x)
        {
         return function(y)
         {
          return Runtime.New(T,{
           $:1,
           $0:x,
           $1:y
          });
         };
        }):Observable.Return(Runtime.New(T,{
         $:0
        }));
       };
       return sequence(List.ofSeq(ios));
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
      }
     },
     ObservableModule:{
      Pairwise:function(e)
      {
       var x,collector,source;
       x=[{
        $:0
       },{
        $:0
       }];
       collector=Runtime.Tupled(function(tupledArg)
       {
        var o;
        o=tupledArg[1];
        return function(n)
        {
         return[o,{
          $:1,
          $0:n
         }];
        };
       });
       source=((Runtime.Tupled(function(state)
       {
        return function(source1)
        {
         return ObservableModule.Scan(collector,state,source1);
        };
       }))(x))(e);
       return Observable.Choose(Runtime.Tupled(function(_arg1)
       {
        return _arg1[0].$==1?_arg1[1].$==1?{
         $:1,
         $0:[_arg1[0].$0,_arg1[1].$0]
        }:{
         $:0
        }:{
         $:0
        };
       }),source);
      },
      Partition:function(f,e)
      {
       return[Observable.Filter(f,e),Observable.Filter(function(x)
       {
        return!f(x);
       },e)];
      },
      Scan:function(fold,seed,e)
      {
       var state;
       state={
        contents:seed
       };
       return Observable.Map(function(value)
       {
        state.contents=(fold(state.contents))(value);
        return state.contents;
       },e);
      },
      Split:function(f,e)
      {
       var chooser;
       chooser=function(x)
       {
        var matchValue;
        matchValue=f(x);
        return matchValue.$==1?{
         $:1,
         $0:matchValue.$0
        }:{
         $:0
        };
       };
       return[Observable.Choose(function(x)
       {
        var matchValue;
        matchValue=f(x);
        return matchValue.$==0?{
         $:1,
         $0:matchValue.$0
        }:{
         $:0
        };
       },e),Observable.Choose(chooser,e)];
      }
     },
     Observer:{
      New:function(f,e,c)
      {
       return Runtime.New(Observer1,{
        onNext:f,
        onError:e,
        onCompleted:c
       });
      },
      Observer:Runtime.Class({
       OnCompleted:function()
       {
        return this.onCompleted.call(null,null);
       },
       OnError:function(e)
       {
        return this.onError.call(null,e);
       },
       OnNext:function(x)
       {
        return this.onNext.call(null,x);
       }
      }),
      Of:function(f)
      {
       return Runtime.New(Observer1,{
        onNext:f,
        onError:function(x)
        {
         return Operators.Raise(x);
        },
        onCompleted:function()
        {
         return null;
        }
       });
      }
     }
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  WebSharper=Runtime.Safe(Global.IntelliFactory.WebSharper);
  List=Runtime.Safe(WebSharper.List);
  Arrays=Runtime.Safe(WebSharper.Arrays);
  Unchecked=Runtime.Safe(WebSharper.Unchecked);
  Control=Runtime.Safe(WebSharper.Control);
  Disposable=Runtime.Safe(Control.Disposable);
  IntrinsicFunctionProxy=Runtime.Safe(WebSharper.IntrinsicFunctionProxy);
  FSharpEvent=Runtime.Safe(Control.FSharpEvent);
  Util=Runtime.Safe(WebSharper.Util);
  Event=Runtime.Safe(Control.Event);
  Event1=Runtime.Safe(Event.Event);
  EventModule=Runtime.Safe(Control.EventModule);
  HotStream=Runtime.Safe(Control.HotStream);
  HotStream1=Runtime.Safe(HotStream.HotStream);
  Observable=Runtime.Safe(Control.Observable);
  Observer=Runtime.Safe(Control.Observer);
  Operators=Runtime.Safe(WebSharper.Operators);
  Observable1=Runtime.Safe(Observable.Observable);
  T=Runtime.Safe(List.T);
  ObservableModule=Runtime.Safe(Control.ObservableModule);
  return Observer1=Runtime.Safe(Observer.Observer);
 });
 Runtime.OnLoad(function()
 {
  return;
 });
}());
