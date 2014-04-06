(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,WebSharper,Piglets,Choose,Stream,Reader,Collections,Dictionary,List,T,Enumerator,Seq,Operators,Stream1,Result,ConcreteReader,Id,ConcreteWriter,Html,Operators1,Default,EventsPervasives,Controls,Unchecked,jQuery,HtmlContainer,Arrays,ErrorMessage,Many,Stream2,Submitter,Operations,ResizeArray,ResizeArrayProxy,UnitStream,Piglet,Stream11,Piglet1,Pervasives,Validation,Concurrency,RegExp,Util,Reactive,HotStream;
 Runtime.Define(Global,{
  IntelliFactory:{
   WebSharper:{
    Piglets:{
     Choose:{
      Stream:Runtime.Class({
       Choice:function(c,f)
       {
        var renders,hasChild,_this=this;
        renders=Dictionary.New21();
        hasChild={
         contents:false
        };
        this.subscriptions.contents=Runtime.New(T,{
         $:1,
         $0:this.pStream.SubscribeImmediate(function(res)
         {
          var p,i,render;
          if(res.$==0)
           {
            p=res.$0[1];
            i=res.$0[0];
            render=renders.ContainsKey(i)?renders.get_Item(i):p.view.call(null,f);
            _this.out.Trigger(p.stream.get_Latest());
            if(hasChild.contents)
             {
              c.Remove(0);
             }
            hasChild.contents=true;
            return c.Add(render);
           }
          else
           {
            return null;
           }
         }),
         $1:_this.subscriptions.contents
        });
        return c.get_Container();
       },
       Chooser:function(f)
       {
        return this.chooser.view.call(null,f);
       },
       Dispose:function()
       {
        var enumerator;
        enumerator=Enumerator.Get(this.subscriptions.contents);
        while(enumerator.MoveNext())
         {
          enumerator.get_Current().Dispose();
         }
        return Seq.iter(function(_arg3)
        {
         return(Operators.KeyValue(_arg3))[1][1].Dispose();
        },this.choiceSubscriptions);
       },
       Subscribe:function(f)
       {
        return this.out.Subscribe(f);
       },
       get_ChooserStream:function()
       {
        return this.chooser.stream;
       },
       get_Latest:function()
       {
        return this.out.get_Latest();
       }
      },{
       New:function(chooser,choice,out)
       {
        var r;
        r=Runtime.New(this,Reader.New(out.get_Id()));
        r.chooser=chooser;
        r.out=out;
        r.pStream=Stream1.New(Runtime.New(Result,{
         $:1,
         $0:Runtime.New(T,{
          $:0
         })
        }),{
         $:0
        });
        r.choiceSubscriptions=Dictionary.New21();
        r.subscriptions={
         contents:List.ofArray([r.chooser.stream.SubscribeImmediate(function(res)
         {
          return r.pStream.Trigger(Result.Map(function(i)
          {
           var _,p,objectArg;
           if(r.choiceSubscriptions.ContainsKey(i))
            {
             _=(r.choiceSubscriptions.get_Item(i))[0];
            }
           else
            {
             p=choice(i);
             objectArg=r.out;
             r.choiceSubscriptions.set_Item(i,[p,p.stream.Subscribe(function(arg00)
             {
              return objectArg.Trigger(arg00);
             })]);
             _=p;
            }
           return[i,_];
          },res));
         })])
        };
        return r;
       }
      })
     },
     ConcreteReader:Runtime.Class({
      Subscribe:function(f)
      {
       return this.subscribe.call(null,f);
      },
      get_Latest:function()
      {
       return this.latest.call(null,null);
      }
     },{
      New:function(latest,subscribe)
      {
       var r;
       r=Runtime.New(this,Reader.New((Id.next())(null)));
       r.latest=latest;
       r.subscribe=subscribe;
       return r;
      }
     }),
     ConcreteWriter:Runtime.Class({
      Trigger:function(x)
      {
       return this.trigger.call(null,x);
      }
     },{
      New:function(trigger)
      {
       return ConcreteWriter.New1(function(_arg1)
       {
        return _arg1.$==1?null:trigger(_arg1.$0);
       });
      },
      New1:function(trigger)
      {
       var r;
       r=Runtime.New(this,{});
       r.trigger=trigger;
       return r;
      }
     }),
     Controls:{
      Attr:function(reader,attrName,render,element)
      {
       Operators1.OnAfterRender(function(element1)
       {
        var set;
        set=function(x)
        {
         return x.$==0?element1["HtmlProvider@32"].SetAttribute(element1.Body,attrName,render(x.$0)):null;
        };
        set(reader.get_Latest());
        reader.Subscribe(set);
        return;
       },element);
       return element;
      },
      AttrResult:function(reader,attrName,render,element)
      {
       Operators1.OnAfterRender(function(element1)
       {
        var set;
        set=function(x)
        {
         return element1["HtmlProvider@32"].SetAttribute(element1.Body,attrName,render(x));
        };
        set(reader.get_Latest());
        reader.Subscribe(set);
        return;
       },element);
       return element;
      },
      Button:function(submit)
      {
       var x,arg00;
       x=Default.Button(Runtime.New(T,{
        $:0
       }));
       arg00=function()
       {
        return function()
        {
         return submit.Trigger(Runtime.New(Result,{
          $:0,
          $0:null
         }));
        };
       };
       EventsPervasives.Events().OnClick(arg00,x);
       return x;
      },
      ButtonValidate:function(submit)
      {
       var _arg10_;
       _arg10_=Controls.Button(submit);
       return Controls.EnableOnSuccess(submit.get_Input(),_arg10_);
      },
      CheckBox:function(stream)
      {
       var id,i,matchValue;
       id=(Controls.nextId())(null);
       i=Default.Input(List.ofArray([Default.Attr().NewAttr("type","checkbox"),Default.Attr().NewAttr("id",id)]));
       matchValue=stream.get_Latest();
       if(matchValue.$==0)
        {
         i.Body.checked=matchValue.$0;
        }
       stream.Subscribe(function(_arg1)
       {
        var x;
        if(_arg1.$==1)
         {
          return null;
         }
        else
         {
          x=_arg1.$0;
          return!Unchecked.Equals(i.Body.checked,x)?void(i.Body.checked=x):null;
         }
       });
       i.Body.addEventListener("change",function()
       {
        return stream.Trigger(Runtime.New(Result,{
         $:0,
         $0:i.Body.checked
        }));
       },true);
       return i;
      },
      Css:function(reader,attrName,render,element)
      {
       Operators1.OnAfterRender(function(element1)
       {
        var set;
        set=function(x)
        {
         return x.$==0?element1["HtmlProvider@32"].SetCss(element1.Body,attrName,render(x.$0)):null;
        };
        set(reader.get_Latest());
        reader.Subscribe(set);
        return;
       },element);
       return element;
      },
      CssResult:function(reader,attrName,render,element)
      {
       Operators1.OnAfterRender(function(element1)
       {
        var set;
        set=function(x)
        {
         return element1["HtmlProvider@32"].SetCss(element1.Body,attrName,render(x));
        };
        set(reader.get_Latest());
        reader.Subscribe(set);
        return;
       },element);
       return element;
      },
      EnableOnSuccess:function(reader,element)
      {
       Operators1.OnAfterRender(function(el)
       {
        el.Body.disabled=!reader.get_Latest().get_isSuccess();
        reader.Subscribe(function(x)
        {
         el.Body.disabled=!x.get_isSuccess();
        });
        return;
       },element);
       return element;
      },
      HtmlContainer:Runtime.Class({
       Add:function(elt)
       {
        return this.container.AppendI(elt);
       },
       MoveUp:function(i)
       {
        var elt_i,elt_i_1;
        elt_i=this.container.Body.childNodes[i];
        elt_i_1=this.container.Body.childNodes[i-1];
        this.container.Body.removeChild(elt_i);
        this.container.Body.insertBefore(elt_i,elt_i_1);
        return;
       },
       Remove:function(i)
       {
        this.container.Body.removeChild(this.container.Body.childNodes[i]);
       },
       get_Container:function()
       {
        return this.container;
       }
      },{
       New:function(container)
       {
        var r;
        r=Runtime.New(this,{});
        r.container=container;
        return r;
       }
      }),
      IntInput:function(stream)
      {
       return Controls.input("number",function(value)
       {
        return value<<0;
       },function(value)
       {
        return Global.String(value);
       },stream);
      },
      Link:function(submit)
      {
       var x;
       x=Default.A(List.ofArray([Default.Attr().NewAttr("href","#")]));
       Operators1.OnAfterRender(function(e)
       {
        return jQuery(e.Body).on("click",function()
        {
         submit.Trigger(Runtime.New(Result,{
          $:0,
          $0:null
         }));
         return false;
        });
       },x);
       return x;
      },
      Radio:function(stream,values)
      {
       var name,values1,mapping,elts,x2;
       name=(Controls.nextId())(null);
       values1=List.ofSeq(values);
       mapping=Runtime.Tupled(function(tupledArg)
       {
        var x,label,id,x1,arg00,input,arg10;
        x=tupledArg[0];
        label=tupledArg[1];
        id=(Controls.nextId())(null);
        x1=Default.Input(List.ofArray([Default.Attr().NewAttr("type","radio"),Default.Attr().NewAttr("name",name),Default.Attr().NewAttr("id",id)]));
        arg00=function(div)
        {
         return div.Body.checked?stream.Trigger(Runtime.New(Result,{
          $:0,
          $0:x
         })):null;
        };
        EventsPervasives.Events().OnChange(arg00,x1);
        input=x1;
        arg10=List.ofArray([Default.Attr().NewAttr("for",id),Default.Text(label)]);
        return[input,Default.Span(List.ofArray([input,Default.Tags().NewTag("label",arg10)]))];
       });
       elts=List.map(mapping,values1);
       x2=Default.Div(Seq.map(Runtime.Tupled(function(tuple)
       {
        return tuple[1];
       }),elts));
       Operators1.OnAfterRender(function()
       {
        var set;
        set=function(_arg1)
        {
         var v;
         if(_arg1.$==1)
          {
           return null;
          }
         else
          {
           v=_arg1.$0;
           return List.iter2(Runtime.Tupled(function(tupledArg)
           {
            var x;
            x=tupledArg[0];
            return Runtime.Tupled(function(tupledArg1)
            {
             tupledArg1[0].Body.checked=Unchecked.Equals(x,v);
            });
           }),values1,elts);
          }
        };
        set(stream.get_Latest());
        stream.Subscribe(set);
        return;
       },x2);
       return x2;
      },
      RenderChoice:function(choice,renderIt,container)
      {
       return choice.Choice(HtmlContainer.New(container),renderIt);
      },
      RenderMany:function(many,renderOne,container)
      {
       return many.Render(HtmlContainer.New(container),renderOne);
      },
      Select:function(stream,values)
      {
       var name,values1,mapping,elts,x,arg00,x1;
       name=(Controls.nextId())(null);
       values1=Arrays.ofSeq(values);
       mapping=Runtime.Tupled(function(tupledArg)
       {
        var label,id;
        label=tupledArg[1];
        id=(Controls.nextId())(null);
        return Operators1.add(Default.Tags().NewTag("option",List.ofArray([Default.Attr().NewAttr("value",id)])),List.ofArray([Default.Text(label)]));
       });
       elts=Arrays.map(mapping,values1);
       x=Default.Select(elts);
       arg00=function(e)
       {
        return e.Body.selectedIndex>=0?stream.Trigger(Runtime.New(Result,{
         $:0,
         $0:values1[e.Body.selectedIndex][0]
        })):null;
       };
       EventsPervasives.Events().OnChange(arg00,x);
       x1=x;
       Operators1.OnAfterRender(function()
       {
        stream.SubscribeImmediate(function(_arg1)
        {
         var v,matchValue,_this;
         if(_arg1.$==1)
          {
           return null;
          }
         else
          {
           v=_arg1.$0;
           matchValue=Arrays.tryFindIndex(Runtime.Tupled(function(tupledArg)
           {
            return Unchecked.Equals(v,tupledArg[0]);
           }),values1);
           if(matchValue.$==0)
            {
             return null;
            }
           else
            {
             _this=elts[matchValue.$0];
             return _this["HtmlProvider@32"].SetAttribute(_this.Body,"selected","");
            }
          }
        });
       },x1);
       return x1;
      },
      Show:function(reader,render,container)
      {
       return Controls.ShowResult(reader,function(_arg1)
       {
        return _arg1.$==1?Seq.empty():render(_arg1.$0);
       },container);
      },
      ShowErrors:function(reader,render,container)
      {
       return Controls.ShowResult(reader,function(_arg1)
       {
        return _arg1.$==1?render(List.map(function(m)
        {
         return m.get_Message();
        },_arg1.$0)):Seq.empty();
       },container);
      },
      ShowResult:function(reader,render,container)
      {
       var enumerator;
       enumerator=Enumerator.Get(render(reader.get_Latest()));
       while(enumerator.MoveNext())
        {
         container.AppendI(enumerator.get_Current());
        }
       reader.Subscribe(function(x)
       {
        var enumerator1;
        container["HtmlProvider@32"].Clear(container.Body);
        enumerator1=Enumerator.Get(render(x));
        while(enumerator1.MoveNext())
         {
          container.AppendI(enumerator1.get_Current());
         }
        return;
       });
       return container;
      },
      ShowString:function(reader,render,container)
      {
       return Controls.Show(reader,function(x)
       {
        return List.ofArray([Default.Text(render(x))]);
       },container);
      },
      Submit:function(submit)
      {
       var x,arg00;
       x=Default.Input(List.ofArray([Default.Attr().NewAttr("type","submit")]));
       arg00=function()
       {
        return function()
        {
         return submit.Trigger(Runtime.New(Result,{
          $:0,
          $0:null
         }));
        };
       };
       EventsPervasives.Events().OnClick(arg00,x);
       return x;
      },
      SubmitValidate:function(submit)
      {
       var _arg10_;
       _arg10_=Controls.Submit(submit);
       return Controls.EnableOnSuccess(submit.get_Input(),_arg10_);
      },
      TextArea:function(stream)
      {
       var i,matchValue,ev;
       i=Default.TextArea(Runtime.New(T,{
        $:0
       }));
       matchValue=stream.get_Latest();
       if(matchValue.$==0)
        {
         i.set_Value(matchValue.$0);
        }
       stream.Subscribe(function(_arg1)
       {
        var x;
        if(_arg1.$==1)
         {
          return null;
         }
        else
         {
          x=_arg1.$0;
          return i.get_Value()!==x?i.set_Value(x):null;
         }
       });
       ev=function()
       {
        return stream.Trigger(Runtime.New(Result,{
         $:0,
         $0:i.get_Value()
        }));
       };
       i.Body.addEventListener("keyup",ev,true);
       i.Body.addEventListener("change",ev,true);
       return i;
      },
      WithLabel:function(label,element)
      {
       var id,arg10;
       id=(Controls.nextId())(null);
       arg10=List.ofArray([Default.Attr().NewAttr("for",id),Default.Text(label)]);
       return Default.Span(List.ofArray([Default.Tags().NewTag("label",arg10),Operators1.add(element,List.ofArray([Default.Attr().NewAttr("id",id)]))]));
      },
      WithLabelAfter:function(label,element)
      {
       var id,arg10;
       id=(Controls.nextId())(null);
       arg10=List.ofArray([Default.Attr().NewAttr("for",id),Default.Text(label)]);
       return Default.Span(List.ofArray([Operators1.add(element,List.ofArray([Default.Attr().NewAttr("id",id)])),Default.Tags().NewTag("label",arg10)]));
      },
      input:function(type,ofString,toString,stream)
      {
       var i,matchValue,ev;
       i=Default.Input(List.ofArray([Default.Attr().NewAttr("type",type)]));
       matchValue=stream.get_Latest();
       if(matchValue.$==0)
        {
         i.set_Value(toString(matchValue.$0));
        }
       stream.Subscribe(function(_arg1)
       {
        var s;
        if(_arg1.$==1)
         {
          return null;
         }
        else
         {
          s=toString(_arg1.$0);
          return i.get_Value()!==s?i.set_Value(s):null;
         }
       });
       ev=function()
       {
        var v;
        v=Runtime.New(Result,{
         $:0,
         $0:ofString(i.get_Value())
        });
        return!Unchecked.Equals(v,stream.get_Latest())?stream.Trigger(v):null;
       };
       i.Body.addEventListener("keyup",ev,true);
       i.Body.addEventListener("change",ev,true);
       return i;
      },
      nextId:Runtime.Field(function()
      {
       var _current_25_2;
       _current_25_2={
        contents:0
       };
       return function()
       {
        Operators.Increment(_current_25_2);
        return"pl__"+Global.String(_current_25_2.contents);
       };
      })
     },
     ErrorMessage:Runtime.Class({
      get_Message:function()
      {
       return this.message;
      },
      get_Source:function()
      {
       return this.source;
      }
     },{
      Create:function(msg,reader)
      {
       return ErrorMessage.New(msg,reader.get_Id());
      },
      New:function(message,source)
      {
       var r;
       r=Runtime.New(this,{});
       r.message=message;
       r.source=source;
       return r;
      }
     }),
     Id:{
      next:Runtime.Field(function()
      {
       var _current_27_3;
       _current_27_3={
        contents:0
       };
       return function()
       {
        Operators.Increment(_current_27_3);
        return _current_27_3.contents;
       };
      })
     },
     Many:{
      Operations:Runtime.Class({
       get_Delete:function()
       {
        return ConcreteWriter.New(this["delete"]);
       },
       get_MoveDown:function()
       {
        return this.moveDown;
       },
       get_MoveUp:function()
       {
        return this.moveUp;
       }
      },{
       New:function(_delete,moveUp,moveDown)
       {
        var r;
        r=Runtime.New(this,{});
        r["delete"]=_delete;
        r.moveUp=moveUp;
        r.moveDown=moveDown;
        return r;
       }
      }),
      Stream:Runtime.Class({
       AddRender:function(f)
       {
        return this.adder.view.call(null,f);
       },
       Render:function(c,f)
       {
        var add,_this=this,matchValue;
        add=function(x)
        {
         var piglet,getThisIndex,moveUp,moveDown,moveUp1,canMoveUp,canMoveDown,inMoveUp,inMoveDown,outSubscription,subMoveUp,subMoveDown,subUpSubscription,subDownSubscription;
         piglet=_this.p.call(null,x);
         _this.streams.Add(piglet.stream);
         piglet.stream.SubscribeImmediate(function()
         {
          return _this.update();
         });
         getThisIndex=function()
         {
          return Seq.findIndex(function(x1)
          {
           return x1.get_Id()===piglet.stream.get_Id();
          },_this.streams);
         };
         moveUp=function(i)
         {
          var s;
          if(i>0?i<_this.streams.get_Count():false)
           {
            s=_this.streams.get_Item(i);
            _this.streams.set_Item(i,_this.streams.get_Item(i-1));
            _this.streams.set_Item(i-1,s);
            c.MoveUp(i);
            return _this.update();
           }
          else
           {
            return null;
           }
         };
         moveDown=function()
         {
          return moveUp(getThisIndex(null)+1);
         };
         moveUp1=function()
         {
          return moveUp(getThisIndex(null));
         };
         canMoveUp=function()
         {
          return getThisIndex(null)>0?Runtime.New(Result,{
           $:0,
           $0:null
          }):Runtime.New(Result,{
           $:1,
           $0:Runtime.New(T,{
            $:0
           })
          });
         };
         canMoveDown=function()
         {
          return getThisIndex(null)<_this.streams.get_Count()-1?Runtime.New(Result,{
           $:0,
           $0:null
          }):Runtime.New(Result,{
           $:1,
           $0:Runtime.New(T,{
            $:0
           })
          });
         };
         inMoveUp=Stream1.New(canMoveUp(null),{
          $:0
         });
         inMoveDown=Stream1.New(canMoveDown(null),{
          $:0
         });
         outSubscription=_this.out.Subscribe(function()
         {
          inMoveUp.Trigger(canMoveUp(null));
          return inMoveDown.Trigger(canMoveDown(null));
         });
         subMoveUp=Submitter.New(inMoveUp,false);
         subMoveDown=Submitter.New(inMoveDown,false);
         subUpSubscription=subMoveUp.Subscribe(Result.Iter(moveUp1));
         subDownSubscription=subMoveDown.Subscribe(Result.Iter(moveDown));
         return c.Add(piglet.view.call(null,f(Operations.New(function()
         {
          var i;
          i=getThisIndex(null);
          _this.streams.RemoveAt(i);
          c.Remove(i);
          outSubscription.Dispose();
          subUpSubscription.Dispose();
          subDownSubscription.Dispose();
          return _this.update();
         },subMoveUp,subMoveDown))));
        };
        matchValue=_this.out.get_Latest();
        if(matchValue.$==0)
         {
          Arrays.iter(add,matchValue.$0);
         }
        _this.adder.stream.Subscribe(function(_arg1)
        {
         return _arg1.$==0?add(_arg1.$0):null;
        });
        return c.get_Container();
       },
       Subscribe:function(f)
       {
        return this.out.Subscribe(f);
       },
       get_Add:function()
       {
        return this.adder.stream;
       },
       get_Latest:function()
       {
        return this.out.get_Latest();
       },
       update:function()
       {
        var objectArg;
        objectArg=this.out;
        return objectArg.Trigger(Result.Map(function(x)
        {
         return Arrays.ofSeq(List.rev(x));
        },Seq.fold(function(acc)
        {
         return function(cur)
         {
          var matchValue;
          matchValue=[acc,cur.get_Latest()];
          return matchValue[0].$==1?matchValue[1].$==1?Runtime.New(Result,{
           $:1,
           $0:List.append(matchValue[1].$0,matchValue[0].$0)
          }):Runtime.New(Result,{
           $:1,
           $0:matchValue[0].$0
          }):matchValue[1].$==1?Runtime.New(Result,{
           $:1,
           $0:matchValue[1].$0
          }):Runtime.New(Result,{
           $:0,
           $0:Runtime.New(T,{
            $:1,
            $0:matchValue[1].$0,
            $1:matchValue[0].$0
           })
          });
         };
        },Runtime.New(Result,{
         $:0,
         $0:Runtime.New(T,{
          $:0
         })
        }),this.streams)));
       }
      },{
       New:function(p,out,adder)
       {
        var r;
        r=Runtime.New(this,Reader.New(out.get_Id()));
        r.p=p;
        r.out=out;
        r.adder=adder;
        r.streams=ResizeArrayProxy.New2();
        return r;
       }
      }),
      UnitStream:Runtime.Class({
       get_Add:function()
       {
        return this.submitStream;
       }
      },{
       New:function(p,out,init,_default)
       {
        var r,submitter,objectArg,trigger;
        r=Runtime.New(this,Stream2.New(p,out,init));
        submitter=Stream1.New(Runtime.New(Result,{
         $:1,
         $0:Runtime.New(T,{
          $:0
         })
        }),{
         $:0
        });
        objectArg=init.get_Stream();
        trigger=function(arg00)
        {
         return objectArg.Trigger(arg00);
        };
        submitter.Subscribe(function(_arg1)
        {
         return _arg1.$==0?trigger(Runtime.New(Result,{
          $:0,
          $0:_default
         })):trigger(Runtime.New(Result,{
          $:1,
          $0:_arg1.$0
         }));
        });
        r.submitStream=submitter;
        return r;
       }
      })
     },
     Pervasives:{
      op_LessMultiplyGreater:function(f,x)
      {
       var f1,g;
       f1=f.view;
       g=x.view;
       return Runtime.New(Piglet,{
        stream:Stream11.Ap(f.stream,x.stream),
        view:function(x1)
        {
         return g(f1(x1));
        }
       });
      },
      op_LessMultiplyQmarkGreater:function(f,x)
      {
       var f1,g;
       f1=f.view;
       g=x.view;
       return Runtime.New(Piglet,{
        stream:Stream11.ApJoin(f.stream,x.stream),
        view:function(x1)
        {
         return g(f1(x1));
        }
       });
      }
     },
     Piglet:Runtime.Class({
      get_Stream:function()
      {
       return this.stream;
      }
     }),
     Piglet1:{
      Builder:Runtime.Class({
       Bind:function(p,f)
       {
        return Piglet1.Choose(p,f);
       },
       Return:function(x)
       {
        return Piglet1.Return(x);
       },
       ReturnFrom:function(p)
       {
        return p;
       },
       Yield:function(x)
       {
        return Piglet1.Yield(x);
       },
       YieldFrom:function(p)
       {
        return p;
       },
       Zero:function()
       {
        return Piglet1.ReturnFailure();
       }
      }),
      Choose:function(chooser,choices)
      {
       var s,c;
       s=Stream1.New(Runtime.New(Result,{
        $:1,
        $0:Runtime.New(T,{
         $:0
        })
       }),{
        $:0
       });
       c=Stream.New(chooser,choices,s);
       return Runtime.New(Piglet,{
        stream:s,
        view:function(f)
        {
         return f(c);
        }
       });
      },
      Confirm:function(init,validate,nomatch)
      {
       var second,_arg20_,x;
       second=Piglet1.Yield(init);
       _arg20_=Pervasives.op_LessMultiplyGreater(Pervasives.op_LessMultiplyGreater(Piglet1.Return(function(a)
       {
        return function(b)
        {
         return[a,b];
        };
       }),validate(Piglet1.Yield(init))),second);
       x=Validation["Is'"](Runtime.Tupled(function(tupledArg)
       {
        return Unchecked.Equals(tupledArg[0],tupledArg[1]);
       }),ErrorMessage.Create(nomatch,second.get_Stream()),_arg20_);
       return Piglet1.MapViewArgs(function(a)
       {
        return function(b)
        {
         return[a,b];
        };
       },Piglet1.Map(Runtime.Tupled(function(tuple)
       {
        return tuple[0];
       }),x));
      },
      FlushErrors:function(p)
      {
       return Piglet1.MapResult(function(_arg1)
       {
        return _arg1.$==1?Runtime.New(Result,{
         $:1,
         $0:Runtime.New(T,{
          $:0
         })
        }):_arg1;
       },p);
      },
      Many:function(init,p)
      {
       return Piglet1.ManyInit([init],init,p);
      },
      ManyInit:function(inits,init,p)
      {
       var s,m;
       s=Stream1.New(Runtime.New(Result,{
        $:0,
        $0:inits
       }),{
        $:0
       });
       m=UnitStream.New(p,s,p(init),init);
       return Runtime.New(Piglet,{
        stream:s,
        view:function(f)
        {
         return f(m);
        }
       });
      },
      ManyPiglet:function(inits,create,p)
      {
       var s,m;
       s=Stream1.New(Runtime.New(Result,{
        $:0,
        $0:inits
       }),{
        $:0
       });
       m=Stream2.New(p,s,create);
       return Runtime.New(Piglet,{
        stream:s,
        view:function(f)
        {
         return f(m);
        }
       });
      },
      Map:function(m,p)
      {
       return Piglet1.MapResult(function(_arg1)
       {
        return _arg1.$==0?Runtime.New(Result,{
         $:0,
         $0:m(_arg1.$0)
        }):Runtime.New(Result,{
         $:1,
         $0:_arg1.$0
        });
       },p);
      },
      MapAsync:function(m,p)
      {
       return Piglet1.MapAsyncResult(function(_arg1)
       {
        var x;
        if(_arg1.$==0)
         {
          x=_arg1.$0;
          return Concurrency.Delay(function()
          {
           return Concurrency.Bind(m(x),function(_arg2)
           {
            return Concurrency.Return(Runtime.New(Result,{
             $:0,
             $0:_arg2
            }));
           });
          });
         }
        else
         {
          return Concurrency.Return(Runtime.New(Result,{
           $:1,
           $0:_arg1.$0
          }));
         }
       },p);
      },
      MapAsyncResult:function(m,p)
      {
       var out;
       out=Stream1.New(Runtime.New(Result,{
        $:1,
        $0:Runtime.New(T,{
         $:0
        })
       }),{
        $:0
       });
       p.stream.Subscribe(function(v)
       {
        return Concurrency.Start(Concurrency.Delay(function()
        {
         return Concurrency.Bind(m(v),function(_arg1)
         {
          return Concurrency.Return(out.Trigger(_arg1));
         });
        }));
       });
       Concurrency.Start(Concurrency.Delay(function()
       {
        return Concurrency.Bind(m(p.stream.get_Latest()),function(_arg2)
        {
         return Concurrency.Return(out.Trigger(_arg2));
        });
       }));
       return Runtime.New(Piglet,{
        stream:out,
        view:p.view
       });
      },
      MapResult:function(m,p)
      {
       var out;
       out=Stream1.New(m(p.stream.get_Latest()),{
        $:0
       });
       p.stream.Subscribe(function(x)
       {
        return out.Trigger(m(x));
       });
       return Runtime.New(Piglet,{
        stream:out,
        view:p.view
       });
      },
      MapResultWithWriter:function(f,p)
      {
       var stream;
       stream=Stream1.New(Runtime.New(Result,{
        $:1,
        $0:Runtime.New(T,{
         $:0
        })
       }),{
        $:0
       });
       p.stream.SubscribeImmediate(f(stream));
       return Runtime.New(Piglet,{
        stream:stream,
        view:p.view
       });
      },
      MapToAsyncResult:function(m,p)
      {
       return Piglet1.MapAsyncResult(function(_arg1)
       {
        return _arg1.$==0?m(_arg1.$0):Concurrency.Return(Runtime.New(Result,{
         $:1,
         $0:_arg1.$0
        }));
       },p);
      },
      MapToResult:function(m,p)
      {
       return Piglet1.MapResult(function(_arg1)
       {
        return _arg1.$==0?m(_arg1.$0):Runtime.New(Result,{
         $:1,
         $0:_arg1.$0
        });
       },p);
      },
      MapViewArgs:function(view,p)
      {
       var _arg00_;
       _arg00_=p.view;
       return Runtime.New(Piglet,{
        stream:p.stream,
        view:function(_arg20_)
        {
         return _arg20_(_arg00_(view));
        }
       });
      },
      MapWithWriter:function(f,p)
      {
       return Piglet1.MapResultWithWriter(function(out)
       {
        return function(r)
        {
         var x;
         if(r.$==0)
          {
           x=r.$0;
           return(f(out))(x);
          }
         else
          {
           return out.Trigger(Runtime.New(Result,{
            $:1,
            $0:r.$0
           }));
          }
        };
       },p);
      },
      Render:function(view,p)
      {
       return p.view.call(null,view);
      },
      Return:function(x)
      {
       return Runtime.New(Piglet,{
        stream:Stream1.New(Runtime.New(Result,{
         $:0,
         $0:x
        }),{
         $:0
        }),
        view:function(x1)
        {
         return x1;
        }
       });
      },
      ReturnFailure:function()
      {
       return Runtime.New(Piglet,{
        stream:Stream1.New(Runtime.New(Result,{
         $:1,
         $0:Runtime.New(T,{
          $:0
         })
        }),{
         $:0
        }),
        view:function(x)
        {
         return x;
        }
       });
      },
      Run:function(action,p)
      {
       return Piglet1.RunResult(Result.Iter(action),p);
      },
      RunResult:function(action,p)
      {
       p.stream.Subscribe(action);
       return p;
      },
      TransmitReader:function(p)
      {
       var v,a;
       v=p.view;
       a=p.stream;
       return Runtime.New(Piglet,{
        stream:p.stream,
        view:function(x)
        {
         return(v(x))(a);
        }
       });
      },
      TransmitReaderMap:function(f,p)
      {
       var v,a;
       v=p.view;
       a=Reader.Map(f,p.stream);
       return Runtime.New(Piglet,{
        stream:p.stream,
        view:function(x)
        {
         return(v(x))(a);
        }
       });
      },
      TransmitReaderMapResult:function(f,p)
      {
       var v,a;
       v=p.view;
       a=Reader.MapResult(f,p.stream);
       return Runtime.New(Piglet,{
        stream:p.stream,
        view:function(x)
        {
         return(v(x))(a);
        }
       });
      },
      TransmitReaderMapToResult:function(f,p)
      {
       var v,a;
       v=p.view;
       a=Reader.MapToResult(f,p.stream);
       return Runtime.New(Piglet,{
        stream:p.stream,
        view:function(x)
        {
         return(v(x))(a);
        }
       });
      },
      TransmitStream:function(p)
      {
       var v,a;
       v=p.view;
       a=p.stream;
       return Runtime.New(Piglet,{
        stream:p.stream,
        view:function(x)
        {
         return(v(x))(a);
        }
       });
      },
      TransmitWriter:function(p)
      {
       var v,a;
       v=p.view;
       a=p.stream;
       return Runtime.New(Piglet,{
        stream:p.stream,
        view:function(x)
        {
         return(v(x))(a);
        }
       });
      },
      Validation:{
       Is:function(pred,msg,p)
       {
        var _s_;
        _s_=Stream1.New(p.stream.get_Latest(),{
         $:1,
         $0:p.stream.get_Id()
        });
        p.stream.Subscribe(function(_arg1)
        {
         return _arg1.$==0?pred(_arg1.$0)?_s_.Trigger(Runtime.New(Result,{
          $:0,
          $0:_arg1.$0
         })):_s_.Trigger(Runtime.New(Result,{
          $:1,
          $0:List.ofArray([ErrorMessage.New(msg,_s_.get_Id())])
         })):_s_.Trigger(Runtime.New(Result,{
          $:1,
          $0:_arg1.$0
         }));
        });
        return Runtime.New(Piglet,{
         stream:_s_,
         view:p.view
        });
       },
       "Is'":function(pred,msg,p)
       {
        var _s_;
        _s_=Stream1.New(p.stream.get_Latest(),{
         $:1,
         $0:p.stream.get_Id()
        });
        p.stream.Subscribe(function(_arg1)
        {
         return _arg1.$==0?pred(_arg1.$0)?_s_.Trigger(Runtime.New(Result,{
          $:0,
          $0:_arg1.$0
         })):_s_.Trigger(Runtime.New(Result,{
          $:1,
          $0:List.ofArray([msg])
         })):_s_.Trigger(Runtime.New(Result,{
          $:1,
          $0:_arg1.$0
         }));
        });
        return Runtime.New(Piglet,{
         stream:_s_,
         view:p.view
        });
       },
       Match:function(re)
       {
        var objectArg;
        objectArg=new RegExp(re);
        return function(arg00)
        {
         return objectArg.test(arg00);
        };
       },
       NotEmpty:function(x)
       {
        return x!=="";
       }
      },
      WithSubmit:function(pin)
      {
       var submitter,v;
       submitter=Submitter.New(pin.stream,false);
       v=pin.view;
       return Runtime.New(Piglet,{
        stream:submitter.get_Output(),
        view:function(x)
        {
         return(v(x))(submitter);
        }
       });
      },
      WithSubmitClearError:function(pin)
      {
       var submitter,v;
       submitter=Submitter.New(pin.stream,true);
       v=pin.view;
       return Runtime.New(Piglet,{
        stream:submitter.get_Output(),
        view:function(x)
        {
         return(v(x))(submitter);
        }
       });
      },
      Yield:function(x)
      {
       var s;
       s=Stream1.New(Runtime.New(Result,{
        $:0,
        $0:x
       }),{
        $:0
       });
       return Runtime.New(Piglet,{
        stream:s,
        view:function(f)
        {
         return f(s);
        }
       });
      },
      YieldFailure:function()
      {
       var s;
       s=Stream1.New(Runtime.New(Result,{
        $:1,
        $0:Runtime.New(T,{
         $:0
        })
       }),{
        $:0
       });
       return Runtime.New(Piglet,{
        stream:s,
        view:function(f)
        {
         return f(s);
        }
       });
      },
      YieldOption:function(x,none)
      {
       var _arg00_,_arg10_;
       _arg00_=function(_arg1)
       {
        return _arg1.$==1?_arg1.$0:none;
       };
       _arg10_=function(x1)
       {
        return Unchecked.Equals(x1,none)?{
         $:0
        }:{
         $:1,
         $0:x1
        };
       };
       return Piglet1.MapViewArgs(function(_arg20_)
       {
        return Stream11.Map(_arg00_,_arg10_,_arg20_);
       },Piglet1.Yield(x));
      }
     },
     Reader:Runtime.Class({
      SubscribeImmediate:function(f)
      {
       f(this.get_Latest());
       return this.Subscribe(f);
      },
      Through:function(r)
      {
       var out,_this=this;
       out=Stream1.New(this.get_Latest(),{
        $:0
       });
       r.Subscribe(function(_arg1)
       {
        var msgs,matchValue;
        if(_arg1.$==1)
         {
          msgs=_arg1.$0;
          matchValue=[_this.get_Latest(),List.filter(function(m)
          {
           return m.get_Source()===_this.get_Id();
          },msgs)];
          return matchValue[1].$==0?out.Trigger(_this.get_Latest()):matchValue[0].$==1?out.Trigger(Runtime.New(Result,{
           $:1,
           $0:List.append(matchValue[0].$0,matchValue[1])
          })):out.Trigger(Runtime.New(Result,{
           $:1,
           $0:matchValue[1]
          }));
         }
        else
         {
          return out.Trigger(_this.get_Latest());
         }
       });
       return out;
      },
      get_Id:function()
      {
       return this.id;
      }
     },{
      Map:function(f,r)
      {
       return Reader.MapResult(function(arg10)
       {
        return Result.Map(f,arg10);
       },r);
      },
      Map2:function(f,rb,rc)
      {
       return Reader.MapResult2(function(b)
       {
        return function(c)
        {
         return Result.Map2(f,b,c);
        };
       },rb,rc);
      },
      MapResult:function(f,r)
      {
       var out;
       out=Stream1.New(f(r.get_Latest()),{
        $:0
       });
       r.Subscribe(function(x)
       {
        return out.Trigger(f(x));
       });
       return out;
      },
      MapResult2:function(f,rb,rc)
      {
       var out;
       out=Stream1.New((f(rb.get_Latest()))(rc.get_Latest()),{
        $:0
       });
       rb.Subscribe(function(b)
       {
        return out.Trigger((f(b))(rc.get_Latest()));
       });
       rc.Subscribe(function(c)
       {
        return out.Trigger((f(rb.get_Latest()))(c));
       });
       return out;
      },
      MapToResult:function(f,r)
      {
       return Reader.MapResult(Result.Bind(f),r);
      },
      New:function(id)
      {
       var r;
       r=Runtime.New(this,{});
       r.id=id;
       return r;
      }
     }),
     Result:Runtime.Class({
      get_isSuccess:function()
      {
       return this.$==1?false:true;
      }
     },{
      Ap:function(r1,r2)
      {
       var matchValue;
       matchValue=[r1,r2];
       return matchValue[0].$==1?matchValue[1].$==1?Runtime.New(Result,{
        $:1,
        $0:List.append(matchValue[0].$0,matchValue[1].$0)
       }):Runtime.New(Result,{
        $:1,
        $0:matchValue[0].$0
       }):matchValue[1].$==1?Runtime.New(Result,{
        $:1,
        $0:matchValue[1].$0
       }):Runtime.New(Result,{
        $:0,
        $0:matchValue[0].$0.call(null,matchValue[1].$0)
       });
      },
      Bind:function(f)
      {
       return function(_arg2)
       {
        return _arg2.$==1?Runtime.New(Result,{
         $:1,
         $0:_arg2.$0
        }):f(_arg2.$0);
       };
      },
      Failwith:function(msg)
      {
       return Runtime.New(Result,{
        $:1,
        $0:List.ofArray([ErrorMessage.New(msg,0)])
       });
      },
      Iter:function(f)
      {
       return function(_arg1)
       {
        return _arg1.$==1?null:f(_arg1.$0);
       };
      },
      Join:function(r)
      {
       return r.$==0?r.$0.$==0?Runtime.New(Result,{
        $:0,
        $0:r.$0.$0
       }):Runtime.New(Result,{
        $:1,
        $0:r.$0.$0
       }):Runtime.New(Result,{
        $:1,
        $0:r.$0
       });
      },
      Map:function(f,ra)
      {
       return ra.$==1?Runtime.New(Result,{
        $:1,
        $0:ra.$0
       }):Runtime.New(Result,{
        $:0,
        $0:f(ra.$0)
       });
      },
      Map2:function(f,ra,rb)
      {
       var matchValue,b;
       matchValue=[ra,rb];
       if(matchValue[0].$==1)
        {
         return matchValue[1].$==1?Runtime.New(Result,{
          $:1,
          $0:List.append(matchValue[0].$0,matchValue[1].$0)
         }):Runtime.New(Result,{
          $:1,
          $0:matchValue[0].$0
         });
        }
       else
        {
         if(matchValue[1].$==1)
          {
           return Runtime.New(Result,{
            $:1,
            $0:matchValue[1].$0
           });
          }
         else
          {
           b=matchValue[1].$0;
           return Runtime.New(Result,{
            $:0,
            $0:(f(matchValue[0].$0))(b)
           });
          }
        }
      }
     }),
     Stream:Runtime.Class({
      Subscribe:function(f)
      {
       return Util.subscribeTo(this.s,f);
      },
      Trigger:function(x)
      {
       return this.s.Trigger(x);
      },
      Trigger1:function(x)
      {
       return this.Trigger(x);
      },
      Write:function(x)
      {
       var _this=this;
       return ConcreteWriter.New1(function(_arg1)
       {
        return _arg1.$==0?_this.Trigger(Runtime.New(Result,{
         $:0,
         $0:x
        })):_this.Trigger(Runtime.New(Result,{
         $:1,
         $0:_arg1.$0
        }));
       });
      },
      get_Latest:function()
      {
       return this.s.Latest.contents.$0;
      }
     },{
      New:function(init,id)
      {
       var r;
       r=Runtime.New(this,Reader.New(id.$==0?(Id.next())(null):id.$0));
       r.s=HotStream.New(init);
       return r;
      }
     }),
     Stream1:{
      Ap:function(sf,sx)
      {
       var out;
       out=Stream1.New(Result.Ap(sf.get_Latest(),sx.get_Latest()),{
        $:0
       });
       sf.Subscribe(function(f)
       {
        return out.Trigger(Result.Ap(f,sx.get_Latest()));
       });
       sx.Subscribe(function(x)
       {
        return out.Trigger(Result.Ap(sf.get_Latest(),x));
       });
       return out;
      },
      ApJoin:function(sf,sx)
      {
       var out;
       out=Stream1.New(Result.Ap(sf.get_Latest(),Result.Join(sx.get_Latest())),{
        $:0
       });
       sf.Subscribe(function(f)
       {
        return out.Trigger(Result.Ap(f,Result.Join(sx.get_Latest())));
       });
       sx.Subscribe(function(x)
       {
        return out.Trigger(Result.Ap(sf.get_Latest(),Result.Join(x)));
       });
       return out;
      },
      Map:function(a2b,b2a,s)
      {
       var _s_,pa,pb;
       _s_=Stream1.New(Result.Map(a2b,s.get_Latest()),{
        $:1,
        $0:s.get_Id()
       });
       pa={
        contents:s.get_Latest()
       };
       pb={
        contents:_s_.get_Latest()
       };
       s.Subscribe(function(a)
       {
        if(pa.contents!==a)
         {
          pb.contents=Result.Map(a2b,a);
          return _s_.Trigger(pb.contents);
         }
        else
         {
          return null;
         }
       });
       _s_.Subscribe(function(b)
       {
        if(pb.contents!==b)
         {
          pa.contents=Result.Map(b2a,b);
          return s.Trigger(pa.contents);
         }
        else
         {
          return null;
         }
       });
       return _s_;
      }
     },
     Submitter:Runtime.Class({
      Subscribe:function(f)
      {
       return this.output.Subscribe(f);
      },
      Trigger:function()
      {
       return this.writer.Trigger(Runtime.New(Result,{
        $:0,
        $0:null
       }));
      },
      Trigger1:function(x)
      {
       return this.writer.Trigger(x);
      },
      get_Input:function()
      {
       return this.input;
      },
      get_Latest:function()
      {
       return this.output.get_Latest();
      },
      get_Output:function()
      {
       return this.output;
      }
     },{
      New:function(input,clearError)
      {
       var r;
       r=Runtime.New(this,Reader.New((Id.next())(null)));
       r.input=input;
       r.output=Stream1.New(Runtime.New(Result,{
        $:1,
        $0:Runtime.New(T,{
         $:0
        })
       }),{
        $:0
       });
       r.writer=ConcreteWriter.New1(function(unitIn)
       {
        var matchValue;
        matchValue=[unitIn,r.input.get_Latest()];
        return matchValue[0].$==0?matchValue[1].$==0?r.output.Trigger(Runtime.New(Result,{
         $:0,
         $0:matchValue[1].$0
        })):r.output.Trigger(Runtime.New(Result,{
         $:1,
         $0:matchValue[1].$0
        })):matchValue[1].$==0?r.output.Trigger(Runtime.New(Result,{
         $:1,
         $0:matchValue[0].$0
        })):r.output.Trigger(Runtime.New(Result,{
         $:1,
         $0:List.append(matchValue[0].$0,matchValue[1].$0)
        }));
       });
       if(clearError)
        {
         r.input.Subscribe(function()
         {
          return r.output.Trigger(Runtime.New(Result,{
           $:1,
           $0:Runtime.New(T,{
            $:0
           })
          }));
         });
        }
       return r;
      }
     })
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  WebSharper=Runtime.Safe(Global.IntelliFactory.WebSharper);
  Piglets=Runtime.Safe(WebSharper.Piglets);
  Choose=Runtime.Safe(Piglets.Choose);
  Stream=Runtime.Safe(Choose.Stream);
  Reader=Runtime.Safe(Piglets.Reader);
  Collections=Runtime.Safe(WebSharper.Collections);
  Dictionary=Runtime.Safe(Collections.Dictionary);
  List=Runtime.Safe(WebSharper.List);
  T=Runtime.Safe(List.T);
  Enumerator=Runtime.Safe(WebSharper.Enumerator);
  Seq=Runtime.Safe(WebSharper.Seq);
  Operators=Runtime.Safe(WebSharper.Operators);
  Stream1=Runtime.Safe(Piglets.Stream);
  Result=Runtime.Safe(Piglets.Result);
  ConcreteReader=Runtime.Safe(Piglets.ConcreteReader);
  Id=Runtime.Safe(Piglets.Id);
  ConcreteWriter=Runtime.Safe(Piglets.ConcreteWriter);
  Html=Runtime.Safe(WebSharper.Html);
  Operators1=Runtime.Safe(Html.Operators);
  Default=Runtime.Safe(Html.Default);
  EventsPervasives=Runtime.Safe(Html.EventsPervasives);
  Controls=Runtime.Safe(Piglets.Controls);
  Unchecked=Runtime.Safe(WebSharper.Unchecked);
  jQuery=Runtime.Safe(Global.jQuery);
  HtmlContainer=Runtime.Safe(Controls.HtmlContainer);
  Arrays=Runtime.Safe(WebSharper.Arrays);
  ErrorMessage=Runtime.Safe(Piglets.ErrorMessage);
  Many=Runtime.Safe(Piglets.Many);
  Stream2=Runtime.Safe(Many.Stream);
  Submitter=Runtime.Safe(Piglets.Submitter);
  Operations=Runtime.Safe(Many.Operations);
  ResizeArray=Runtime.Safe(Collections.ResizeArray);
  ResizeArrayProxy=Runtime.Safe(ResizeArray.ResizeArrayProxy);
  UnitStream=Runtime.Safe(Many.UnitStream);
  Piglet=Runtime.Safe(Piglets.Piglet);
  Stream11=Runtime.Safe(Piglets.Stream1);
  Piglet1=Runtime.Safe(Piglets.Piglet1);
  Pervasives=Runtime.Safe(Piglets.Pervasives);
  Validation=Runtime.Safe(Piglet1.Validation);
  Concurrency=Runtime.Safe(WebSharper.Concurrency);
  RegExp=Runtime.Safe(Global.RegExp);
  Util=Runtime.Safe(WebSharper.Util);
  Reactive=Runtime.Safe(Global.IntelliFactory.Reactive);
  return HotStream=Runtime.Safe(Reactive.HotStream);
 });
 Runtime.OnLoad(function()
 {
  Runtime.Inherit(Stream,Reader);
  Runtime.Inherit(ConcreteReader,Reader);
  Runtime.Inherit(Stream2,Reader);
  Runtime.Inherit(Stream2,Reader);
  Runtime.Inherit(UnitStream,Stream2);
  Runtime.Inherit(Stream1,Reader);
  Runtime.Inherit(Submitter,Reader);
  Id.next();
  Controls.nextId();
  return;
 });
}());
