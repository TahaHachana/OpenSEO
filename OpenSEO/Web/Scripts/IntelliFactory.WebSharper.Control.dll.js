(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,WebSharper,Pervasives,List,Unchecked,Arrays,Control,Disposable,_FSharpEvent_1,Util,Event,_Event_1,EventModule,HotStream,_HotStream_1,Observable,Observer,Operators,_Observable_1,T,ObservableModule;
 Runtime.Define(Global,{
  IntelliFactory:{
   WebSharper:{
    Control:{
     Disposable:{
      Of:function(dispose)
      {
       return Pervasives.New(List.ofArray([["Dispose",dispose]]));
      }
     },
     Event:{
      "Event`1":Runtime.Class({
       AddHandler:function(h)
       {
        return this.Handlers.push(h);
       },
       RemoveHandler:function(h)
       {
        var x,x1,x2,x3,f,mapping,f1,chooser,f2,n;
        x=(x1=(x2=(x3=this.Handlers,(f=(mapping=function(i)
        {
         return function(x4)
         {
          if(Unchecked.Equals(x4,h))
           {
            return{
             $:1,
             $0:i
            };
           }
          else
           {
            return{
             $:0
            };
           }
         };
        },function(array)
        {
         return Arrays.mapi(mapping,array);
        }),f(x3))),(f1=(chooser=function(x4)
        {
         return x4;
        },function(array)
        {
         return Arrays.choose(chooser,array);
        }),f1(x2))),(f2=function(array)
        {
         return List.ofArray(array);
        },f2(x1)));
        if(x.$==1)
         {
          n=x.$0;
          return this.Handlers.splice(n,1);
         }
        else
         {
          return null;
         }
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
        for(i=0;i<=this.Handlers.length-1;i++){
         this.Handlers[i].call(null,x);
        }
       }
      })
     },
     EventModule:{
      Choose:function(c,e)
      {
       var r;
       r=_FSharpEvent_1.New();
       Util.addListener(e,function(x)
       {
        var matchValue,y;
        matchValue=c(x);
        if(matchValue.$==0)
         {
          return null;
         }
        else
         {
          y=matchValue.$0;
          return r.event.Trigger(y);
         }
       });
       return r.event;
      },
      Filter:function(ok,e)
      {
       var r;
       r=Runtime.New(_Event_1,{
        Handlers:[]
       });
       Util.addListener(e,function(x)
       {
        if(ok(x))
         {
          return r.Trigger(x);
         }
        else
         {
          return null;
         }
       });
       return r;
      },
      Map:function(f,e)
      {
       var r;
       r=Runtime.New(_Event_1,{
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
       r=Runtime.New(_Event_1,{
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
       ev=Runtime.New(_Event_1,{
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
         }
       });
       return ev;
      },
      Partition:function(f,e)
      {
       var g;
       return[EventModule.Filter(f,e),EventModule.Filter((g=function(value)
       {
        return!value;
       },function(x)
       {
        return g(f(x));
       }),e)];
      },
      Scan:function(fold,seed,e)
      {
       var state,f;
       state={
        contents:seed
       };
       f=function(value)
       {
        state.contents=(fold(state.contents))(value);
        return state.contents;
       };
       return EventModule.Map(f,e);
      },
      Split:function(f,e)
      {
       var f1,chooser,f2,chooser1;
       return[(f1=(chooser=function(x)
       {
        var matchValue,x1;
        matchValue=f(x);
        if(matchValue.$==0)
         {
          x1=matchValue.$0;
          return{
           $:1,
           $0:x1
          };
         }
        else
         {
          return{
           $:0
          };
         }
       },function(sourceEvent)
       {
        return EventModule.Choose(chooser,sourceEvent);
       }),f1(e)),(f2=(chooser1=function(x)
       {
        var matchValue,x1;
        matchValue=f(x);
        if(matchValue.$==1)
         {
          x1=matchValue.$0;
          return{
           $:1,
           $0:x1
          };
         }
        else
         {
          return{
           $:0
          };
         }
       },function(sourceEvent)
       {
        return EventModule.Choose(chooser1,sourceEvent);
       }),f2(e))];
      }
     },
     "FSharpEvent`1":Runtime.Class({},{
      New:function()
      {
       var r;
       r={};
       r.event=Runtime.New(_Event_1,{
        Handlers:[]
       });
       return Runtime.New(this,r);
      }
     }),
     HotStream:{
      "HotStream`1":Runtime.Class({
       Subscribe:function(o)
       {
        var disp,_this;
        if(this.Latest.contents.$==1)
         {
          o.OnNext(this.Latest.contents.$0);
         }
        disp=Util.subscribeTo((_this=this.Event,_this.event),function(v)
        {
         return o.OnNext(v);
        });
        return disp;
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
       New:function()
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
       var f1;
       f1=function(o1)
       {
        var on,arg00;
        on=function(v)
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
        };
        arg00=Observer.New(on,function(arg001)
        {
         return o1.OnError(arg001);
        },function()
        {
         return o1.OnCompleted();
        });
        return io.Subscribe(arg00);
       };
       return Observable.New(f1);
      },
      CombineLatest:function(io1,io2,f)
      {
       var f1;
       f1=function(o)
       {
        var lv1,lv2,update,o1,onNext,o2,onNext1,d1,d2;
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
        },Observer.New(onNext,function(value)
        {
         value;
        },function(value)
        {
         value;
        }));
        o2=(onNext1=function(y)
        {
         lv2.contents={
          $:1,
          $0:y
         };
         return update(null);
        },Observer.New(onNext1,function(value)
        {
         value;
        },function(value)
        {
         value;
        }));
        d1=io1.Subscribe(o1);
        d2=io2.Subscribe(o2);
        return Disposable.Of(function()
        {
         d1.Dispose();
         return d2.Dispose();
        });
       };
       return Observable.New(f1);
      },
      Concat:function(io1,io2)
      {
       var f;
       f=function(o)
       {
        var innerDisp,outerDisp,dispose;
        innerDisp={
         contents:{
          $:0
         }
        };
        outerDisp=io1.Subscribe(Observer.New(function(arg00)
        {
         return o.OnNext(arg00);
        },function(value)
        {
         value;
        },function()
        {
         var arg0;
         innerDisp.contents=(arg0=io2.Subscribe(o),{
          $:1,
          $0:arg0
         });
        }));
        dispose=function()
        {
         if(innerDisp.contents.$==1)
          {
           innerDisp.contents.$0.Dispose();
          }
         return outerDisp.Dispose();
        };
        return Disposable.Of(dispose);
       };
       return Observable.New(f);
      },
      Drop:function(count,io)
      {
       var f;
       f=function(o1)
       {
        var index,on,arg00;
        index={
         contents:0
        };
        on=function(v)
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
        };
        arg00=Observer.New(on,function(arg001)
        {
         return o1.OnError(arg001);
        },function()
        {
         return o1.OnCompleted();
        });
        return io.Subscribe(arg00);
       };
       return Observable.New(f);
      },
      Filter:function(f,io)
      {
       var f1;
       f1=function(o1)
       {
        var on,arg00;
        on=function(v)
        {
         if(f(v))
          {
           return o1.OnNext(v);
          }
         else
          {
           return null;
          }
        };
        arg00=Observer.New(on,function(arg001)
        {
         return o1.OnError(arg001);
        },function()
        {
         return o1.OnCompleted();
        });
        return io.Subscribe(arg00);
       };
       return Observable.New(f1);
      },
      Map:function(f,io)
      {
       var f1;
       f1=function(o1)
       {
        var on,arg00;
        on=function(v)
        {
         return o1.OnNext(f(v));
        };
        arg00=Observer.New(on,function(arg001)
        {
         return o1.OnError(arg001);
        },function()
        {
         return o1.OnCompleted();
        });
        return io.Subscribe(arg00);
       };
       return Observable.New(f1);
      },
      Merge:function(io1,io2)
      {
       var f;
       f=function(o)
       {
        var completed1,completed2,disp1,x,f1,disp2,x1,f2;
        completed1={
         contents:false
        };
        completed2={
         contents:false
        };
        disp1=(x=Observer.New(function(arg00)
        {
         return o.OnNext(arg00);
        },function(value)
        {
         value;
        },function()
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
        }),(f1=function(arg00)
        {
         return io1.Subscribe(arg00);
        },f1(x)));
        disp2=(x1=Observer.New(function(arg00)
        {
         return o.OnNext(arg00);
        },function(value)
        {
         value;
        },function()
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
        }),(f2=function(arg00)
        {
         return io2.Subscribe(arg00);
        },f2(x1)));
        return Disposable.Of(function()
        {
         disp1.Dispose();
         return disp2.Dispose();
        });
       };
       return Observable.New(f);
      },
      Never:function()
      {
       return Observable.New(function()
       {
        return Disposable.Of(function(value)
        {
         value;
        });
       });
      },
      New:function(f)
      {
       return Runtime.New(_Observable_1,{
        Subscribe1:f
       });
      },
      "Observable`1":Runtime.Class({
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
       var f;
       f=function(o)
       {
        var i;
        for(i=start;i<=start+count;i++){
         o.OnNext(i);
        }
        return Disposable.Of(function(value)
        {
         value;
        });
       };
       return Observable.New(f);
      },
      Return:function(x)
      {
       var f;
       f=function(o)
       {
        o.OnNext(x);
        o.OnCompleted();
        return Disposable.Of(function(value)
        {
         value;
        });
       };
       return Observable.New(f);
      },
      SelectMany:function(io)
      {
       return Observable.New(function(o)
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
         d1=Util.subscribeTo(o1,function(v)
         {
          return o.OnNext(v);
         });
         disp.contents=function()
         {
          disp.contents.call(null,null);
          return d1.Dispose();
         };
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
        var xs,x,rest;
        if(ios1.$==1)
         {
          xs=ios1.$1;
          x=ios1.$0;
          rest=sequence(xs);
          return Observable.CombineLatest(x,rest,function(x1)
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
          return Observable.Return(Runtime.New(T,{
           $:0
          }));
         }
       };
       return sequence(List.ofSeq(ios));
      },
      Switch:function(io)
      {
       return Observable.New(function(o)
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
      }
     },
     ObservableModule:{
      Pairwise:function(e)
      {
       var x,x1,f,collector,f1,chooser;
       x=(x1=[{
        $:0
       },{
        $:0
       }],(f=(collector=Runtime.Tupled(function(tupledArg)
       {
        var _arg1,o;
        _arg1=tupledArg[0];
        o=tupledArg[1];
        return function(n)
        {
         return[o,{
          $:1,
          $0:n
         }];
        };
       }),Runtime.Tupled(function(state)
       {
        return function(source)
        {
         return ObservableModule.Scan(collector,state,source);
        };
       })),(f(x1))(e)));
       f1=(chooser=Runtime.Tupled(function(_arg2)
       {
        var x2,y;
        if(_arg2[0].$==1)
         {
          if(_arg2[1].$==1)
           {
            x2=_arg2[0].$0;
            y=_arg2[1].$0;
            return{
             $:1,
             $0:[x2,y]
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
          return{
           $:0
          };
         }
       }),function(source)
       {
        return Observable.Choose(chooser,source);
       });
       return f1(x);
      },
      Partition:function(f,e)
      {
       var ok,g;
       return[Observable.Filter(f,e),(ok=(g=function(value)
       {
        return!value;
       },function(x)
       {
        return g(f(x));
       }),Observable.Filter(ok,e))];
      },
      Scan:function(fold,seed,e)
      {
       var state,f;
       state={
        contents:seed
       };
       f=function(value)
       {
        state.contents=(fold(state.contents))(value);
        return state.contents;
       };
       return Observable.Map(f,e);
      },
      Split:function(f,e)
      {
       var left,f1,chooser,right,f2,chooser1;
       left=(f1=(chooser=function(x)
       {
        var matchValue,x1;
        matchValue=f(x);
        if(matchValue.$==0)
         {
          x1=matchValue.$0;
          return{
           $:1,
           $0:x1
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
        return Observable.Choose(chooser,source);
       }),f1(e));
       right=(f2=(chooser1=function(x)
       {
        var matchValue,x1;
        matchValue=f(x);
        if(matchValue.$==1)
         {
          x1=matchValue.$0;
          return{
           $:1,
           $0:x1
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
        return Observable.Choose(chooser1,source);
       }),f2(e));
       return[left,right];
      }
     },
     Observer:{
      New:function(f,e,c)
      {
       return{
        OnNext1:f,
        OnError1:e,
        OnCompleted1:c
       };
      },
      Of:function(f)
      {
       return{
        OnNext1:f,
        OnError1:function(x)
        {
         return Operators.Raise(x);
        },
        OnCompleted1:function()
        {
         return null;
        }
       };
      }
     }
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  WebSharper=Runtime.Safe(Global.IntelliFactory.WebSharper);
  Pervasives=Runtime.Safe(WebSharper.Pervasives);
  List=Runtime.Safe(WebSharper.List);
  Unchecked=Runtime.Safe(WebSharper.Unchecked);
  Arrays=Runtime.Safe(WebSharper.Arrays);
  Control=Runtime.Safe(WebSharper.Control);
  Disposable=Runtime.Safe(Control.Disposable);
  _FSharpEvent_1=Runtime.Safe(Control["FSharpEvent`1"]);
  Util=Runtime.Safe(WebSharper.Util);
  Event=Runtime.Safe(Control.Event);
  _Event_1=Runtime.Safe(Event["Event`1"]);
  EventModule=Runtime.Safe(Control.EventModule);
  HotStream=Runtime.Safe(Control.HotStream);
  _HotStream_1=Runtime.Safe(HotStream["HotStream`1"]);
  Observable=Runtime.Safe(Control.Observable);
  Observer=Runtime.Safe(Control.Observer);
  Operators=Runtime.Safe(WebSharper.Operators);
  _Observable_1=Runtime.Safe(Observable["Observable`1"]);
  T=Runtime.Safe(List.T);
  return ObservableModule=Runtime.Safe(Control.ObservableModule);
 });
 Runtime.OnLoad(function()
 {
 });
}());
