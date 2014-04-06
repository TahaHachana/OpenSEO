(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,WebSharper,Formlet,Body,Controls,Html,Default,List,Data,Reactive,HotStream,Formlet1,Base,Result,T,Operators,jQuery,EventsPervasives,Formlet2,Operators1,CssConstants,Math,Seq,Utils,Tree,Edit,Form,Arrays,FormletProvider,Formlet3,Util,LayoutProvider,LayoutUtils,Reactive1,Validator,ValidatorProvidor,RegExp,Collections,Dictionary,ElementStore,Enhance,FormButtonConfiguration,FormContainerConfiguration,Padding,ManyConfiguration,ValidationFrameConfiguration,ValidationIconConfiguration,JSON,FormletBuilder,Layout,FormRowConfiguration,LabelConfiguration,Padding1,Enumerator;
 Runtime.Define(Global,{
  IntelliFactory:{
   WebSharper:{
    Formlet:{
     Body:Runtime.Class({},{
      New:function(el,l)
      {
       return Runtime.New(Body,{
        Element:el,
        Label:l
       });
      }
     }),
     Controls:{
      Button:function(label)
      {
       return Controls.ElementButton(function()
       {
        return Default.Button(List.ofArray([Default.Text(label)]));
       });
      },
      Checkbox:function(def)
      {
       return Controls.CheckboxControl(false,def);
      },
      CheckboxControl:function(readOnly,def)
      {
       return Data.MkFormlet(function()
       {
        var state,readOnlyAtts,x,arg00,body,reset;
        state=HotStream.New(Runtime.New(Result,{
         $:0,
         $0:def
        }));
        readOnlyAtts=readOnly?List.ofArray([Default.Attr().NewAttr("disabled","disabled")]):Runtime.New(T,{
         $:0
        });
        x=Operators.add(Default.Input(List.ofArray([Default.Attr().NewAttr("type","checkbox"),Default.Attr().Class("inputCheckbox")])),readOnlyAtts);
        arg00=function(cb)
        {
         return function()
         {
          return!readOnly?state.Trigger(Runtime.New(Result,{
           $:0,
           $0:jQuery(cb.Body).prop("checked")
          })):null;
         };
        };
        EventsPervasives.Events().OnClick(arg00,x);
        body=x;
        if(def)
         {
          body["HtmlProvider@32"].SetAttribute(body.Body,"defaultChecked","true");
         }
        else
         {
          body["HtmlProvider@32"].RemoveAttribute(body.Body,"checked");
         }
        reset=function()
        {
         if(def)
          {
           body["HtmlProvider@32"].SetProperty(body.Body,"checked",true);
          }
         else
          {
           body["HtmlProvider@32"].RemoveAttribute(body.Body,"checked");
           body["HtmlProvider@32"].SetProperty(body.Body,"checked",false);
          }
         return state.Trigger(Runtime.New(Result,{
          $:0,
          $0:def
         }));
        };
        reset(null);
        return[body,reset,state];
       });
      },
      CheckboxGroup:function(values)
      {
       return Controls.CheckboxGroupControl(false,values);
      },
      CheckboxGroupControl:function(readOnly,values)
      {
       var x,chooser;
       x=Formlet2.Sequence(List.map(Runtime.Tupled(function(tupledArg)
       {
        var l,v,formlet;
        l=tupledArg[0];
        v=tupledArg[1];
        formlet=Controls.CheckboxControl(readOnly,tupledArg[2]);
        return Formlet2.Map(function(b)
        {
         return[b,v];
        },Formlet2.WithLabel({
         $:1,
         $0:function()
         {
          var arg10;
          arg10=List.ofArray([Default.Text(l)]);
          return Default.Tags().NewTag("label",arg10);
         }
        },formlet));
       }),values));
       chooser=Runtime.Tupled(function(tupledArg)
       {
        var v;
        v=tupledArg[1];
        return tupledArg[0]?{
         $:1,
         $0:v
        }:{
         $:0
        };
       });
       return Formlet2.Map(function(list)
       {
        return List.choose(chooser,list);
       },x);
      },
      ElementButton:function(genElem)
      {
       return Data.MkFormlet(function()
       {
        var state,count,x,arg00;
        state=HotStream.New(Runtime.New(Result,{
         $:1,
         $0:Runtime.New(T,{
          $:0
         })
        }));
        count={
         contents:0
        };
        x=genElem(null);
        arg00=function()
        {
         return function()
         {
          state.Trigger(Runtime.New(Result,{
           $:0,
           $0:count.contents
          }));
          return Operators1.Increment(count);
         };
        };
        EventsPervasives.Events().OnClick(arg00,x);
        return[x,function()
        {
         count.contents=0;
         return state.Trigger(Runtime.New(Result,{
          $:1,
          $0:Runtime.New(T,{
           $:0
          })
         }));
        },state];
       });
      },
      Input:function(value)
      {
       return Controls.InputField(false,"text",CssConstants.InputTextClass(),value);
      },
      InputControl:function(value,f)
      {
       return Data.MkFormlet(function()
       {
        var state,body;
        state=HotStream.New(Runtime.New(Result,{
         $:0,
         $0:value
        }));
        body=f(state);
        body.set_Value(value);
        return[body,function()
        {
         body.set_Value(value);
         return state.Trigger(Runtime.New(Result,{
          $:0,
          $0:value
         }));
        },state];
       });
      },
      InputField:function(readOnly,typ,cls,value)
      {
       return Controls.InputControl(value,function(state)
       {
        var ro,input;
        ro=readOnly?List.ofArray([Default.Attr().NewAttr("readonly","readonly")]):Runtime.New(T,{
         $:0
        });
        input=Default.Input(List.append(List.ofArray([Default.Attr().NewAttr("type",typ),Default.Attr().Class(cls)]),ro));
        Controls.OnTextChange(function()
        {
         return!readOnly?state.Trigger(Runtime.New(Result,{
          $:0,
          $0:input.get_Value()
         })):null;
        },input);
        return input;
       });
      },
      OnTextChange:function(f,control)
      {
       var value,up,arg00,arg001;
       value={
        contents:control.get_Value()
       };
       up=function()
       {
        if(control.get_Value()!==value.contents)
         {
          value.contents=control.get_Value();
          return f(null);
         }
        else
         {
          return null;
         }
       };
       arg00=function()
       {
        return up(null);
       };
       EventsPervasives.Events().OnChange(arg00,control);
       arg001=function()
       {
        return function()
        {
         return up(null);
        };
       };
       EventsPervasives.Events().OnKeyUp(arg001,control);
       control.Body.oninput=up;
       return;
      },
      Password:function(value)
      {
       return Controls.InputField(false,"password","inputPassword",value);
      },
      RadioButtonGroup:function(def,values)
      {
       return Controls.RadioButtonGroupControl(false,def,values);
      },
      RadioButtonGroupControl:function(readOnly,def,values)
      {
       return Formlet2.New(function()
       {
        var groupId,x,x1,d,state,mapping,rbLbVls,resetRB,x2;
        groupId="id"+Math.round(Math.random()*100000000);
        if(def.$==0)
         {
          x={
           $:0
          };
         }
        else
         {
          x1=List.mapi(function(ix)
          {
           return Runtime.Tupled(function(tupledArg)
           {
            return[ix,tupledArg[1]];
           });
          },values);
          x=Seq.tryPick(Runtime.Tupled(function(tupledArg)
          {
           var ix,value;
           ix=tupledArg[0];
           value=tupledArg[1];
           return def.$==0?{
            $:0
           }:def.$0===ix?{
            $:1,
            $0:Runtime.New(Result,{
             $:0,
             $0:value
            })
           }:{
            $:0
           };
          }),x1);
         }
        d=HotStream.New(Runtime.New(Result,{
         $:1,
         $0:Runtime.New(T,{
          $:0
         })
        }));
        state=Utils.Maybe(d,function(arg00)
        {
         return HotStream.New(arg00);
        },x);
        mapping=Runtime.Tupled(function(tupledArg)
        {
         var label,value;
         label=tupledArg[0];
         value=tupledArg[1];
         return[Operators.add(Default.Input(List.ofArray([Default.Attr().Class("inputRadio"),Default.Attr().NewAttr("type","radio"),Default.Attr().NewAttr("name",groupId)])),readOnly?List.ofArray([Default.Attr().NewAttr("disabled","disabled")]):Runtime.New(T,{
          $:0
         })),label,value];
        });
        rbLbVls=List.map(mapping,values);
        resetRB=function(rb,value,ix)
        {
         if(def.$==0)
          {
           rb["HtmlProvider@32"].RemoveAttribute(rb.Body,"checked");
           return state.Trigger(Runtime.New(Result,{
            $:1,
            $0:Runtime.New(T,{
             $:0
            })
           }));
          }
         else
          {
           if(def.$0===ix)
            {
             rb["HtmlProvider@32"].SetProperty(rb.Body,"checked",true);
             return state.Trigger(Runtime.New(Result,{
              $:0,
              $0:value
             }));
            }
           else
            {
             return rb["HtmlProvider@32"].SetProperty(rb.Body,"checked",false);
            }
          }
        };
        x2=Runtime.New(Edit,{
         $:0,
         $0:Tree.FromSequence(List.mapi(function(ix)
         {
          return Runtime.Tupled(function(tupledArg)
          {
           var rb,label,value,arg00;
           rb=tupledArg[0];
           label=tupledArg[1];
           value=tupledArg[2];
           resetRB(rb,value,ix);
           arg00=function()
           {
            return function()
            {
             return!readOnly?state.Trigger(Runtime.New(Result,{
              $:0,
              $0:value
             })):null;
            };
           };
           EventsPervasives.Events().OnClick(arg00,rb);
           return Runtime.New(Body,{
            Element:rb,
            Label:{
             $:1,
             $0:function()
             {
              var arg10;
              arg10=List.ofArray([Default.Text(label)]);
              return Default.Tags().NewTag("label",arg10);
             }
            }
           });
          });
         },rbLbVls))
        });
        return Runtime.New(Form,{
         Body:Data.RX().Return(x2),
         Dispose1:function()
         {
         },
         Notify:function()
         {
          return Seq.iteri(function(ix)
          {
           return Runtime.Tupled(function(tupledArg)
           {
            return resetRB(tupledArg[0],tupledArg[2],ix);
           });
          },rbLbVls);
         },
         State:state
        });
       });
      },
      ReadOnlyCheckbox:function(def)
      {
       return Controls.CheckboxControl(true,def);
      },
      ReadOnlyInput:function(value)
      {
       return Controls.InputField(true,"text",CssConstants.InputTextClass(),value);
      },
      ReadOnlyRadioButtonGroup:function(def,values)
      {
       return Controls.RadioButtonGroupControl(true,def,values);
      },
      ReadOnlySelect:function(def,vls)
      {
       return Controls.SelectControl(true,def,vls);
      },
      ReadOnlyTextArea:function(value)
      {
       return Controls.TextAreaControl(true,value);
      },
      Select:function(def,vls)
      {
       return Controls.SelectControl(false,def,vls);
      },
      SelectControl:function(readOnly,def,vls)
      {
       return Data.MkFormlet(function()
       {
        var mapping,x,aVls,sIx,x1,select,body,sValue,state,reset,arg00;
        mapping=Runtime.Tupled(function(tuple)
        {
         return tuple[1];
        });
        x=List.map(mapping,vls);
        aVls=Arrays.ofSeq(x);
        sIx=(def>=0?def<vls.get_Length():false)?def:0;
        x1=List.mapi(function(i)
        {
         return Runtime.Tupled(function(tupledArg)
         {
          var nm;
          nm=tupledArg[0];
          return Default.Tags().NewTag("option",List.ofArray([Default.Text(nm),Default.Attr().NewAttr("value",Global.String(i))]));
         });
        },vls);
        select=Default.Select(x1);
        body=readOnly?Operators.add(select,List.ofArray([Default.Attr().NewAttr("disabled","disabled")])):select;
        sValue=Runtime.New(Result,{
         $:0,
         $0:aVls[sIx]
        });
        state=HotStream.New(sValue);
        reset=function()
        {
         body["HtmlProvider@32"].SetProperty(body.Body,"value",Global.String(sIx));
         return state.Trigger(sValue);
        };
        reset(null);
        arg00=function()
        {
         return!readOnly?state.Trigger(Runtime.New(Result,{
          $:0,
          $0:aVls[body.get_Value()<<0]
         })):null;
        };
        EventsPervasives.Events().OnChange(arg00,body);
        reset(null);
        return[body,reset,state];
       });
      },
      TextArea:function(value)
      {
       return Controls.TextAreaControl(false,value);
      },
      TextAreaControl:function(readOnly,value)
      {
       return Controls.InputControl(value,function(state)
       {
        var input;
        input=Default.TextArea(readOnly?List.ofArray([Default.Attr().NewAttr("readonly","readonly")]):Runtime.New(T,{
         $:0
        }));
        Controls.OnTextChange(function()
        {
         return!readOnly?state.Trigger(Runtime.New(Result,{
          $:0,
          $0:input.get_Value()
         })):null;
        },input);
        return input;
       });
      }
     },
     CssConstants:{
      InputTextClass:Runtime.Field(function()
      {
       return"inputText";
      })
     },
     Data:{
      $:function(f,x)
      {
       return Data.OfIFormlet(Data.BaseFormlet().Apply(f,x));
      },
      BaseFormlet:function()
      {
       return FormletProvider.New(Data.UtilsProvider());
      },
      DefaultLayout:Runtime.Field(function()
      {
       return Data.Layout().get_Vertical();
      }),
      Formlet:Runtime.Class({
       Build:function()
       {
        return this.BuildInternal.call(null,null);
       },
       MapResult:function(f)
       {
        var _this=this;
        return Runtime.New(Formlet3,{
         BuildInternal:function()
         {
          var form;
          form=_this.BuildInternal.call(null,null);
          return Runtime.New(Form,{
           Body:form.Body,
           Dispose1:form.Dispose1,
           Notify:form.Notify,
           State:_this.Utils.Reactive.Select(form.State,f)
          });
         },
         LayoutInternal:_this.LayoutInternal,
         ElementInternal:{
          $:0
         },
         FormletBase:_this.FormletBase,
         Utils:_this.Utils
        });
       },
       Render:function()
       {
        return this.Run(function()
        {
        }).Render();
       },
       Run:function(f)
       {
        var matchValue,formlet,form,matchValue1,el;
        matchValue=this.ElementInternal;
        if(matchValue.$==0)
         {
          formlet=this.FormletBase.ApplyLayout(this);
          form=formlet.Build();
          Util.subscribeTo(form.State,function(res)
          {
           Result.Map(f,res);
          });
          matchValue1=formlet.get_Layout().Apply.call(null,form.Body);
          el=matchValue1.$==0?Data.DefaultLayout().Apply.call(null,form.Body).$0[0].Element:matchValue1.$0[0].Element;
          this.ElementInternal={
           $:1,
           $0:el
          };
          return el;
         }
        else
         {
          return matchValue.$0;
         }
       },
       get_Body:function()
       {
        return this.Run(function()
        {
        }).get_Body();
       },
       get_Layout:function()
       {
        return this.LayoutInternal;
       }
      }),
      Layout:Runtime.Field(function()
      {
       return LayoutProvider.New(LayoutUtils.New({
        Reactive:Reactive1.Default()
       }));
      }),
      MkFormlet:function(f)
      {
       var arg00;
       arg00=function()
       {
        var patternInput,state,reset,Notify,arg001;
        patternInput=f(null);
        state=patternInput[2];
        reset=patternInput[1];
        Notify=function()
        {
         return reset(null);
        };
        arg001=Tree.Set(Data.NewBody(patternInput[0],{
         $:0
        }));
        return Runtime.New(Form,{
         Body:Data.RX().Return(arg001),
         Dispose1:function()
         {
          return null;
         },
         Notify:Notify,
         State:state
        });
       };
       return Data.OfIFormlet(Data.BaseFormlet().New(arg00));
      },
      NewBody:function(arg00,arg10)
      {
       return Body.New(arg00,arg10);
      },
      OfIFormlet:function(formlet)
      {
       return Data.PropagateRenderFrom(formlet,Runtime.New(Formlet3,{
        BuildInternal:function()
        {
         return formlet.Build();
        },
        LayoutInternal:formlet.get_Layout(),
        ElementInternal:{
         $:0
        },
        FormletBase:Data.BaseFormlet(),
        Utils:Data.UtilsProvider()
       }));
      },
      PropagateRenderFrom:function(f1,f2)
      {
       if(f1.hasOwnProperty("Render"))
        {
         f2.Render=f1.Render;
        }
       return f2;
      },
      RX:Runtime.Field(function()
      {
       return Reactive1.Default();
      }),
      UtilsProvider:function()
      {
       return{
        Reactive:Data.RX(),
        DefaultLayout:Data.DefaultLayout()
       };
      },
      Validator:Runtime.Field(function()
      {
       return Validator.New(ValidatorProvidor.New());
      }),
      ValidatorProvidor:Runtime.Class({
       Matches:function(regex,text)
       {
        return text.match(new RegExp(regex));
       }
      },{
       New:function()
       {
        return Runtime.New(this,{});
       }
      })
     },
     ElementStore:Runtime.Class({
      Init:function()
      {
       this.store=Dictionary.New21();
       return;
      },
      RegisterElement:function(key,f)
      {
       return!this.store.ContainsKey(key)?this.store.set_Item(key,f):null;
      },
      Remove:function(key)
      {
       if(this.store.ContainsKey(key))
        {
         (this.store.get_Item(key))(null);
         this.store.Remove(key);
         return;
        }
       else
        {
         return null;
        }
      }
     },{
      New:function()
      {
       return Runtime.New(this,{});
      },
      NewElementStore:function()
      {
       var store;
       store=ElementStore.New();
       store.Init();
       return store;
      }
     }),
     Enhance:{
      Cancel:function(formlet,isCancel)
      {
       return Formlet2.Replace(formlet,function(value)
       {
        return isCancel(value)?Formlet2.Empty():Formlet2.Return(value);
       });
      },
      CustomMany:function(config,formlet)
      {
       var x,addButton,f,formlet1,c,formlet2,x1,delF,resetS,resetF,reset,_builder_;
       x=Controls.ElementButton(function()
       {
        return Operators.add(Default.Div(List.ofArray([Default.Attr().Class(config.AddIconClass)])),List.ofArray([Default.Div(Runtime.New(T,{
         $:0
        }))]));
       });
       addButton=Formlet2.InitWith(1,x);
       f=function()
       {
       };
       formlet1=Controls.ElementButton(function()
       {
        return Operators.add(Default.Div(List.ofArray([Default.Attr().Class(config.RemoveIconClass)])),List.ofArray([Default.Div(Runtime.New(T,{
         $:0
        }))]));
       });
       c=Formlet2.Map(f,formlet1);
       formlet2=Formlet2.WithCancelation(formlet,c);
       x1=Formlet2.WithLayout(Data.Layout().get_Horizontal(),formlet2);
       delF=Enhance.Deletable(x1);
       resetS=HotStream.New(Runtime.New(Result,{
        $:0,
        $0:null
       }));
       resetF=Data.OfIFormlet(Data.BaseFormlet().FromState(resetS));
       reset=function()
       {
        return resetS.Trigger(Runtime.New(Result,{
         $:0,
         $0:null
        }));
       };
       _builder_=Formlet2.Do();
       return Formlet2.WithNotification(reset,_builder_.Delay(function()
       {
        return _builder_.Bind(resetF,function()
        {
         return _builder_.ReturnFrom(Formlet2.ApplyLayout(Formlet2.WithLayoutOrDefault(Formlet2.Map(function(source)
         {
          return List.ofSeq(source);
         },Enhance.Many_(addButton,function()
         {
          return delF;
         })))));
        });
       }));
      },
      Deletable:function(formlet)
      {
       return Enhance.Replace(formlet,function(value)
       {
        return value.$==1?Formlet2.Return({
         $:1,
         $0:value.$0
        }):Formlet2.ReturnEmpty({
         $:0
        });
       });
      },
      FormButtonConfiguration:Runtime.Class({},{
       get_Default:function()
       {
        return Runtime.New(FormButtonConfiguration,{
         Label:{
          $:0
         },
         Style:{
          $:0
         },
         Class:{
          $:0
         }
        });
       }
      }),
      FormContainerConfiguration:Runtime.Class({},{
       get_Default:function()
       {
        var Description;
        Description={
         $:0
        };
        return Runtime.New(FormContainerConfiguration,{
         Header:{
          $:0
         },
         Padding:Padding.get_Default(),
         Description:Description,
         BackgroundColor:{
          $:0
         },
         BorderColor:{
          $:0
         },
         CssClass:{
          $:0
         },
         Style:{
          $:0
         }
        });
       }
      }),
      InputButton:function(conf,enabled)
      {
       return Data.MkFormlet(function()
       {
        var state,count,label,x1,arg00,submit,submit1,matchValue,matchValue1,reset;
        state=HotStream.New(Runtime.New(Result,{
         $:1,
         $0:Runtime.New(T,{
          $:0
         })
        }));
        count={
         contents:0
        };
        label=Utils.Maybe("Submit",function(x)
        {
         return x;
        },conf.Label);
        x1=Operators.add(Default.Input(List.ofArray([Default.Attr().NewAttr("type","button")])),List.ofArray([Default.Attr().Class("submitButton"),Default.Attr().NewAttr("value",label)]));
        arg00=function()
        {
         return function()
         {
          Operators1.Increment(count);
          return state.Trigger(Runtime.New(Result,{
           $:0,
           $0:count.contents
          }));
         };
        };
        EventsPervasives.Events().OnClick(arg00,x1);
        submit=x1;
        if(!enabled)
         {
          submit["HtmlProvider@32"].AddClass(submit.Body,"disabledButton");
         }
        matchValue=conf.Style;
        if(matchValue.$==1)
         {
          submit["HtmlProvider@32"].SetStyle(submit.Body,matchValue.$0);
         }
        matchValue1=conf.Class;
        if(matchValue1.$==1)
         {
          submit["HtmlProvider@32"].AddClass(submit.Body,matchValue1.$0);
         }
        submit1=submit;
        reset=function()
        {
         count.contents=0;
         return state.Trigger(Runtime.New(Result,{
          $:1,
          $0:Runtime.New(T,{
           $:0
          })
         }));
        };
        state.Trigger(Runtime.New(Result,{
         $:1,
         $0:Runtime.New(T,{
          $:0
         })
        }));
        return[submit1,reset,state];
       });
      },
      Many:function(formlet)
      {
       return Enhance.CustomMany(ManyConfiguration.get_Default(),formlet);
      },
      ManyConfiguration:Runtime.Class({},{
       get_Default:function()
       {
        return Runtime.New(ManyConfiguration,{
         AddIconClass:"addIcon",
         RemoveIconClass:"removeIcon"
        });
       }
      }),
      Many_:function(add,f)
      {
       var chooser;
       chooser=function(x)
       {
        return x;
       };
       return Formlet2.Map(function(source)
       {
        return Seq.choose(chooser,source);
       },Formlet2.FlipBody(Formlet2.SelectMany(Formlet2.Map(f,add))));
      },
      Padding:Runtime.Class({},{
       get_Default:function()
       {
        return Runtime.New(Padding,{
         Left:{
          $:0
         },
         Right:{
          $:0
         },
         Top:{
          $:0
         },
         Bottom:{
          $:0
         }
        });
       }
      }),
      Replace:function(formlet,f)
      {
       return Formlet2.Switch(Formlet2.MapResult(function(res)
       {
        return res.$==1?Runtime.New(Result,{
         $:0,
         $0:Formlet2.FailWith(res.$0)
        }):Runtime.New(Result,{
         $:0,
         $0:f(res.$0)
        });
       },formlet));
      },
      ValidationFrameConfiguration:Runtime.Class({},{
       get_Default:function()
       {
        return Runtime.New(ValidationFrameConfiguration,{
         ValidClass:{
          $:1,
          $0:"successFormlet"
         },
         ValidStyle:{
          $:0
         },
         ErrorClass:{
          $:1,
          $0:"errorFormlet"
         },
         ErrorStyle:{
          $:0
         }
        });
       }
      }),
      ValidationIconConfiguration:Runtime.Class({},{
       get_Default:function()
       {
        return Runtime.New(ValidationIconConfiguration,{
         ValidIconClass:"validIcon",
         ErrorIconClass:"errorIcon"
        });
       }
      }),
      WithCssClass:function(css,formlet)
      {
       return Formlet2.MapElement(function(el)
       {
        el["HtmlProvider@32"].AddClass(el.Body,css);
        return el;
       },formlet);
      },
      WithCustomFormContainer:function(fc,formlet)
      {
       var x;
       x=Formlet2.ApplyLayout(formlet);
       return Formlet2.MapElement(function(formEl)
       {
        var x1,d,description,x2,d1,tb,cell,list,matchValue,matchValue1;
        x1=fc.Description;
        d=Runtime.New(T,{
         $:0
        });
        description=Utils.Maybe(d,function(descr)
        {
         var text;
         if(descr.$==1)
          {
           return List.ofArray([descr.$0.call(null,null)]);
          }
         else
          {
           text=descr.$0;
           return List.ofArray([Default.P(List.ofArray([Default.Tags().text(text)]))]);
          }
        },x1);
        x2=fc.Header;
        d1=Utils.InTable(List.ofArray([List.ofArray([Operators.add(Default.Div(List.ofArray([Default.Attr().Class("headerPanel")])),description)]),List.ofArray([formEl])]));
        tb=Utils.Maybe(d1,function(formElem)
        {
         var hdr,text;
         if(formElem.$==1)
          {
           hdr=formElem.$0.call(null,null);
          }
         else
          {
           text=formElem.$0;
           hdr=Default.H1(List.ofArray([Default.Tags().text(text)]));
          }
         return Utils.InTable(List.ofArray([List.ofArray([Operators.add(Default.Div(List.ofArray([Default.Attr().Class("headerPanel")])),Runtime.New(T,{
          $:1,
          $0:hdr,
          $1:description
         }))]),List.ofArray([formEl])]));
        },x2);
        cell=Operators.add(Default.TD(List.ofArray([Default.Attr().Class("formlet")])),List.ofArray([tb]));
        Utils.Maybe(null,function(color)
        {
         return cell["HtmlProvider@32"].SetStyle(cell.Body,"border-color: "+color);
        },fc.BorderColor);
        list=List.ofArray([["background-color",Utils.MapOption(function(color)
        {
         return color;
        },fc.BackgroundColor)],["padding-left",Utils.MapOption(function(v)
        {
         return Global.String(v)+"px";
        },fc.Padding.Left)],["padding-right",Utils.MapOption(function(v)
        {
         return Global.String(v)+"px";
        },fc.Padding.Right)],["padding-top",Utils.MapOption(function(v)
        {
         return Global.String(v)+"px";
        },fc.Padding.Top)],["padding-bottom",Utils.MapOption(function(v)
        {
         return Global.String(v)+"px";
        },fc.Padding.Bottom)]]);
        Seq.iter(Runtime.Tupled(function(tupledArg)
        {
         var name,value;
         name=tupledArg[0];
         value=tupledArg[1];
         return value.$==0?null:cell["HtmlProvider@32"].SetCss(cell.Body,name,value.$0);
        }),list);
        matchValue=fc.Style;
        if(matchValue.$==0)
         {
         }
        else
         {
          cell["HtmlProvider@32"].SetStyle(cell.Body,matchValue.$0);
         }
        matchValue1=fc.CssClass;
        if(matchValue1.$==0)
         {
         }
        else
         {
          cell["HtmlProvider@32"].AddClass(cell.Body,matchValue1.$0);
         }
        return Default.Table(List.ofArray([Default.TBody(List.ofArray([Default.TR(List.ofArray([cell]))]))]));
       },x);
      },
      WithCustomResetButton:function(buttonConf,formlet)
      {
       return Enhance.WithResetFormlet(formlet,Enhance.InputButton(buttonConf.Label.$==0?Runtime.New(FormButtonConfiguration,{
        Label:{
         $:1,
         $0:"Reset"
        },
        Style:buttonConf.Style,
        Class:buttonConf.Class
       }):buttonConf,true));
      },
      WithCustomSubmitAndResetButtons:function(submitConf,resetConf,formlet)
      {
       return Enhance.WithSubmitAndReset(formlet,function(reset)
       {
        return function(result)
        {
         var submit,fs,value,_builder_,reset1,formlet1;
         if(result.$==1)
          {
           fs=result.$0;
           submit=Formlet2.MapResult(function()
           {
            return Runtime.New(Result,{
             $:1,
             $0:fs
            });
           },Enhance.InputButton(submitConf,false));
          }
         else
          {
           value=result.$0;
           submit=Formlet2.Map(function()
           {
            return value;
           },Enhance.InputButton(submitConf,true));
          }
         _builder_=Formlet2.Do();
         reset1=_builder_.Delay(function()
         {
          return _builder_.Bind(Formlet2.LiftResult(Enhance.InputButton(resetConf,true)),function(_arg1)
          {
           if(_arg1.$==0)
            {
             reset(null);
            }
           return _builder_.Return(null);
          });
         });
         formlet1=Data.$(Data.$(Formlet2.Return(function(v)
         {
          return function()
          {
           return v;
          };
         }),submit),reset1);
         return Formlet2.WithLayout(Data.Layout().get_Horizontal(),formlet1);
        };
       });
      },
      WithCustomSubmitButton:function(buttonConf,formlet)
      {
       var buttonConf1;
       buttonConf1=buttonConf.Label.$==0?Runtime.New(FormButtonConfiguration,{
        Label:{
         $:1,
         $0:"Submit"
        },
        Style:buttonConf.Style,
        Class:buttonConf.Class
       }):buttonConf;
       return Enhance.WithSubmitFormlet(formlet,function(res)
       {
        return Formlet2.Map(function()
        {
        },Enhance.InputButton(buttonConf1,res.$==0?true:false));
       });
      },
      WithCustomValidationFrame:function(vc,formlet)
      {
       return Enhance.WrapFormlet(function(state)
       {
        return function(body)
        {
         var x;
         x=Default.Div(List.ofArray([body.Element]));
         Operators.OnAfterRender(function(panel)
         {
          Util.subscribeTo(state,function(res)
          {
           var msgs,matchValue,matchValue1,matchValue2,matchValue3,matchValue4,matchValue5;
           if(res.$==1)
            {
             msgs=res.$0;
             matchValue=vc.ValidClass;
             if(matchValue.$==1)
              {
               panel["HtmlProvider@32"].RemoveClass(panel.Body,matchValue.$0);
              }
             matchValue1=vc.ErrorClass;
             if(matchValue1.$==1)
              {
               panel["HtmlProvider@32"].AddClass(panel.Body,matchValue1.$0);
              }
             matchValue2=vc.ErrorStyle;
             return matchValue2.$==1?panel["HtmlProvider@32"].SetStyle(panel.Body,matchValue2.$0):panel["HtmlProvider@32"].SetStyle(panel.Body,"");
            }
           else
            {
             matchValue3=vc.ErrorClass;
             if(matchValue3.$==1)
              {
               panel["HtmlProvider@32"].RemoveClass(panel.Body,matchValue3.$0);
              }
             matchValue4=vc.ValidClass;
             if(matchValue4.$==1)
              {
               panel["HtmlProvider@32"].AddClass(panel.Body,matchValue4.$0);
              }
             matchValue5=vc.ValidStyle;
             return matchValue5.$==1?panel["HtmlProvider@32"].SetStyle(panel.Body,matchValue5.$0):panel["HtmlProvider@32"].SetStyle(panel.Body,"");
            }
          });
         },x);
         return x;
        };
       },formlet);
      },
      WithCustomValidationIcon:function(vic,formlet)
      {
       var formlet1,_builder_,x;
       formlet1=Formlet2.WithLayoutOrDefault(formlet);
       _builder_=Formlet2.Do();
       x=Formlet2.MapResult(function(arg00)
       {
        return Result.Join(arg00);
       },_builder_.Delay(function()
       {
        return _builder_.Bind(Formlet2.LiftResult(formlet1),function(_arg1)
        {
         return _builder_.Bind(Formlet2.OfElement(function()
         {
          var title;
          if(_arg1.$==1)
           {
            title=Seq.fold(function(x1)
            {
             return function(y)
             {
              return x1+" "+y;
             };
            },"",_arg1.$0);
            return Operators.add(Default.Div(List.ofArray([Default.Attr().Class(vic.ErrorIconClass),Default.Attr().NewAttr("title",title)])),List.ofArray([Default.Div(Runtime.New(T,{
             $:0
            }))]));
           }
          else
           {
            return Operators.add(Default.Div(List.ofArray([Default.Attr().Class(vic.ValidIconClass),Default.Attr().NewAttr("title","")])),List.ofArray([Default.Div(Runtime.New(T,{
             $:0
            }))]));
           }
         }),function()
         {
          return _builder_.Return(_arg1);
         });
        });
       }));
       return Formlet2.WithLayout(Data.Layout().get_Horizontal(),x);
      },
      WithErrorFormlet:function(f,formlet)
      {
       var _builder_;
       _builder_=Formlet2.Do();
       return Formlet2.MapResult(function(arg00)
       {
        return Result.Join(arg00);
       },_builder_.Delay(function()
       {
        return _builder_.Bind(Formlet2.LiftResult(formlet),function(_arg1)
        {
         var _,msgs,_builder_1;
         if(_arg1.$==1)
          {
           msgs=_arg1.$0;
           _builder_1=Formlet2.Do();
           _=_builder_1.Delay(function()
           {
            return _builder_1.Bind(f(msgs),function()
            {
             return _builder_1.Return(_arg1);
            });
           });
          }
         else
          {
           _=Formlet2.Return(_arg1);
          }
         return _builder_.ReturnFrom(_);
        });
       }));
      },
      WithErrorSummary:function(label,formlet)
      {
       var _builder_;
       _builder_=Formlet2.Do();
       return Formlet2.MapResult(function(arg00)
       {
        return Result.Join(arg00);
       },_builder_.Delay(function()
       {
        return _builder_.Bind(Formlet2.LiftResult(formlet),function(_arg1)
        {
         var _,fs;
         if(_arg1.$==1)
          {
           fs=_arg1.$0;
           _=Formlet2.Map(function()
           {
            return _arg1;
           },Formlet2.OfElement(function()
           {
            var arg10,arg101;
            arg101=List.ofArray([Default.Text(label)]);
            arg10=List.ofArray([Default.Tags().NewTag("legend",arg101),Default.UL(List.map(function(f)
            {
             return Default.LI(List.ofArray([Default.Text(f)]));
            },fs))]);
            return Default.Tags().NewTag("fieldset",arg10);
           }));
          }
         else
          {
           _=Formlet2.Return(_arg1);
          }
         return _builder_.ReturnFrom(_);
        });
       }));
      },
      WithFormContainer:function(formlet)
      {
       return Enhance.WithCustomFormContainer(FormContainerConfiguration.get_Default(),formlet);
      },
      WithJsonPost:function(conf,formlet)
      {
       var matchValue,postUrl,arg10,matchValue1,enc,arg101,_this,arg102,arg103,hiddenField,_this1,arg104,submitButton,x,f;
       matchValue=conf.PostUrl;
       if(matchValue.$==0)
        {
         postUrl=Runtime.New(T,{
          $:0
         });
        }
       else
        {
         arg10=matchValue.$0;
         postUrl=List.ofArray([Default.Attr().NewAttr("action",arg10)]);
        }
       matchValue1=conf.EncodingType;
       if(matchValue1.$==0)
        {
         enc=Runtime.New(T,{
          $:0
         });
        }
       else
        {
         arg101=matchValue1.$0;
         enc=List.ofArray([Default.Attr().NewAttr("enctype",arg101)]);
        }
       _this=Default.Tags();
       arg103=conf.ParameterName;
       arg102=List.ofArray([Default.Attr().NewAttr("type","hidden"),Default.Attr().NewAttr("name",arg103)]);
       hiddenField=_this.NewTag("input",arg102);
       _this1=Default.Tags();
       arg104=List.ofArray([Default.Attr().NewAttr("type","submit"),Default.Attr().NewAttr("value","Submit")]);
       submitButton=_this1.NewTag("input",arg104);
       x=Operators.add(Default.Form(List.append(Runtime.New(T,{
        $:1,
        $0:Default.Attr().NewAttr("method","POST"),
        $1:Runtime.New(T,{
         $:1,
         $0:Default.Attr().NewAttr("style","display:none"),
         $1:postUrl
        })
       }),enc)),List.ofArray([hiddenField,submitButton]));
       f=function(value)
       {
        var data;
        data=JSON.stringify(value);
        jQuery(hiddenField.Body).val(data);
        return jQuery(submitButton.Body).click();
       };
       Operators.OnAfterRender(function(form)
       {
        var matchValue2;
        matchValue2=conf.EncodingType;
        return matchValue2.$==0?null:matchValue2.$0==="multipart/form-data"?void jQuery(form.Body).attr("encoding","multipart/form-data"):null;
       },x);
       return Default.Div(List.ofArray([x,Formlet2.Map(f,formlet)]));
      },
      WithLabel:function(labelGen,formlet)
      {
       return Formlet2.WithLabel({
        $:1,
        $0:labelGen
       },formlet);
      },
      WithLabelAbove:function(formlet)
      {
       return Formlet2.MapBody(function(body)
       {
        var matchValue;
        matchValue=body.Label;
        return Runtime.New(Body,{
         Element:Default.Table(List.ofArray([Default.TBody(List.ofArray([Default.TR(List.ofArray([Default.TD(List.ofArray([matchValue.$==0?Default.Span(Runtime.New(T,{
          $:0
         })):matchValue.$0.call(null,null)]))])),Default.TR(List.ofArray([Default.TD(List.ofArray([body.Element]))]))]))])),
         Label:{
          $:0
         }
        });
       },formlet);
      },
      WithLabelAndInfo:function(label,info,formlet)
      {
       return Enhance.WithLabel(function()
       {
        var arg10;
        arg10=List.ofArray([Default.Text(label)]);
        return Utils.InTable(List.ofArray([List.ofArray([Default.Tags().NewTag("label",arg10),Default.Span(List.ofArray([Default.Attr().NewAttr("title",info),Default.Attr().Class("infoIcon")]))])]));
       },formlet);
      },
      WithLabelConfiguration:function(lc,formlet)
      {
       var formlet1;
       formlet1=Formlet2.ApplyLayout(formlet);
       return Formlet2.WithLayout(Data.Layout().LabelLayout(lc),formlet1);
      },
      WithLabelLeft:function(formlet)
      {
       return Formlet2.MapBody(function(body)
       {
        var matchValue,label;
        matchValue=body.Label;
        label=matchValue.$==0?Default.Span(Runtime.New(T,{
         $:0
        })):matchValue.$0.call(null,null);
        return Runtime.New(Body,{
         Element:Default.Table(List.ofArray([Default.TBody(List.ofArray([Default.TR(List.ofArray([Default.TD(List.ofArray([body.Element])),Default.TD(List.ofArray([label]))]))]))])),
         Label:{
          $:0
         }
        });
       },formlet);
      },
      WithLegend:function(label,formlet)
      {
       return Formlet2.MapBody(function(body)
       {
        var arg10,arg101,matchValue;
        arg101=List.ofArray([Default.Tags().text(label)]);
        matchValue=body.Label;
        arg10=List.ofArray([Default.Tags().NewTag("legend",arg101),matchValue.$==0?body.Element:Utils.InTable(List.ofArray([List.ofArray([matchValue.$0.call(null,null),body.Element])]))]);
        return Runtime.New(Body,{
         Element:Default.Tags().NewTag("fieldset",arg10),
         Label:{
          $:0
         }
        });
       },formlet);
      },
      WithResetAction:function(f,formlet)
      {
       var formlet1;
       formlet1=Formlet2.New(function()
       {
        var form;
        form=formlet.Build();
        return Runtime.New(Form,{
         Body:form.Body,
         Dispose1:form.Dispose1,
         Notify:function(o)
         {
          return f(null)?form.Notify.call(null,o):null;
         },
         State:form.State
        });
       });
       return Data.OfIFormlet(Data.PropagateRenderFrom(formlet,Formlet2.WithLayout(formlet.get_Layout(),formlet1)));
      },
      WithResetButton:function(formlet)
      {
       return Enhance.WithCustomResetButton(FormButtonConfiguration.get_Default(),formlet);
      },
      WithResetFormlet:function(formlet,reset)
      {
       var formlet1,x,formlet2,button,_builder_;
       formlet1=Formlet2.InitWithFailure(Formlet2.ApplyLayout(Formlet2.WithLayoutOrDefault(formlet)));
       x=Formlet2.LiftResult(formlet1);
       formlet2=Formlet2.WithNotificationChannel(x);
       button=Formlet2.LiftResult(reset);
       _builder_=Formlet2.Do();
       return Data.OfIFormlet(Data.PropagateRenderFrom(formlet2,Formlet2.MapResult(function(arg00)
       {
        return Result.Join(arg00);
       },_builder_.Delay(function()
       {
        return _builder_.Bind(formlet2,Runtime.Tupled(function(_arg1)
        {
         var v,notify;
         v=_arg1[0];
         notify=_arg1[1];
         return _builder_.Bind(button,function(_arg2)
         {
          if(_arg2.$==0)
           {
            notify(null);
           }
          return _builder_.Return(v);
         });
        }));
       }))));
      },
      WithRowConfiguration:function(rc,formlet)
      {
       var formlet1;
       formlet1=Formlet2.ApplyLayout(formlet);
       return Formlet2.WithLayout(Data.Layout().RowLayout(rc),formlet1);
      },
      WithSubmitAndReset:function(formlet,submReset)
      {
       var _builder_;
       _builder_=Formlet2.Do();
       return Data.OfIFormlet(Data.PropagateRenderFrom(formlet,_builder_.Delay(function()
       {
        return _builder_.Bind(Formlet2.WithNotificationChannel(Formlet2.LiftResult(Formlet2.InitWithFailure(formlet))),Runtime.Tupled(function(_arg1)
        {
         var res;
         res=_arg1[0];
         return _builder_.ReturnFrom((submReset(_arg1[1]))(res));
        }));
       })));
      },
      WithSubmitAndResetButtons:function(formlet)
      {
       var inputRecord,submitConf,inputRecord1;
       inputRecord=FormButtonConfiguration.get_Default();
       submitConf=Runtime.New(FormButtonConfiguration,{
        Label:{
         $:1,
         $0:"Submit"
        },
        Style:inputRecord.Style,
        Class:inputRecord.Class
       });
       inputRecord1=FormButtonConfiguration.get_Default();
       return Enhance.WithCustomSubmitAndResetButtons(submitConf,Runtime.New(FormButtonConfiguration,{
        Label:{
         $:1,
         $0:"Reset"
        },
        Style:inputRecord1.Style,
        Class:inputRecord1.Class
       }),formlet);
      },
      WithSubmitButton:function(formlet)
      {
       return Enhance.WithCustomSubmitButton(FormButtonConfiguration.get_Default(),formlet);
      },
      WithSubmitFormlet:function(formlet,submit)
      {
       var _builder_;
       _builder_=Formlet2.Do();
       return Data.OfIFormlet(Data.PropagateRenderFrom(formlet,Formlet2.MapResult(function(arg00)
       {
        return Result.Join(arg00);
       },_builder_.Delay(function()
       {
        return _builder_.Bind(Formlet2.LiftResult(Formlet2.InitWithFailure(formlet)),function(_arg1)
        {
         return _builder_.Bind(submit(_arg1),function()
         {
          return _builder_.Return(_arg1);
         });
        });
       }))));
      },
      WithTextLabel:function(label,formlet)
      {
       return Enhance.WithLabel(function()
       {
        var arg10;
        arg10=List.ofArray([Default.Text(label)]);
        return Default.Tags().NewTag("label",arg10);
       },formlet);
      },
      WithValidationFrame:function(formlet)
      {
       return Enhance.WithCustomValidationFrame(ValidationFrameConfiguration.get_Default(),formlet);
      },
      WithValidationIcon:function(formlet)
      {
       return Enhance.WithCustomValidationIcon(ValidationIconConfiguration.get_Default(),formlet);
      },
      WrapFormlet:function(wrapper,formlet)
      {
       return Data.MkFormlet(function()
       {
        var formlet1,form,body;
        formlet1=Formlet2.WithLayoutOrDefault(formlet);
        form=Formlet2.BuildForm(formlet1);
        body=formlet1.get_Layout().Apply.call(null,form.Body).$0[0];
        return[(wrapper(form.State))(body),function()
        {
         return form.Notify.call(null,null);
        },form.State];
       });
      }
     },
     Formlet:{
      ApplyLayout:function(formlet)
      {
       return Data.OfIFormlet(Data.PropagateRenderFrom(formlet,Data.BaseFormlet().ApplyLayout(formlet)));
      },
      Bind:function(fl,f)
      {
       return Data.OfIFormlet(Data.PropagateRenderFrom(fl,Data.BaseFormlet().Bind(fl,f)));
      },
      BindWith:function(compose,formlet,f)
      {
       return Data.OfIFormlet(Data.PropagateRenderFrom(formlet,Data.BaseFormlet().BindWith(compose,formlet,f)));
      },
      BuildForm:function(f)
      {
       return Data.BaseFormlet().BuildForm(f);
      },
      BuildFormlet:function(f)
      {
       return Data.MkFormlet(f);
      },
      Choose:function(fs)
      {
       var count,fs1,formlet,x1,arg00;
       count={
        contents:0
       };
       fs1=Seq.map(function(f)
       {
        return Formlet2.LiftResult(Formlet2.InitWithFailure(Formlet2.Map(function(x)
        {
         Operators1.Increment(count);
         return[x,count.contents];
        },f)));
       },fs);
       formlet=Formlet2.Sequence(fs1);
       x1=Formlet2.Map(function(xs)
       {
        var x,x3;
        x=List.choose(function(x2)
        {
         return x2.$==0?{
          $:1,
          $0:x2.$0
         }:{
          $:0
         };
        },xs);
        x3=List.rev(List.sortBy(Runtime.Tupled(function(tupledArg)
        {
         return tupledArg[1];
        }),x));
        return Seq.tryPick(Runtime.Tupled(function(tupledArg)
        {
         return{
          $:1,
          $0:tupledArg[0]
         };
        }),x3);
       },formlet);
       arg00=function(x)
       {
        return x.$==1;
       };
       return Formlet2.Map(function(x)
       {
        return x.$0;
       },Data.Validator().Is(arg00,"",x1));
      },
      Delay:function(f)
      {
       return Data.OfIFormlet(Data.BaseFormlet().Delay(function()
       {
        return f(null);
       }));
      },
      Deletable:function(formlet)
      {
       return Data.OfIFormlet(Data.PropagateRenderFrom(formlet,Data.BaseFormlet().Deletable(formlet)));
      },
      Do:Runtime.Field(function()
      {
       return FormletBuilder.New();
      }),
      Empty:function()
      {
       return Data.OfIFormlet(Data.BaseFormlet().Empty());
      },
      FailWith:function(fs)
      {
       return Data.OfIFormlet(Data.BaseFormlet().FailWith(fs));
      },
      FlipBody:function(formlet)
      {
       return Data.OfIFormlet(Data.PropagateRenderFrom(formlet,Data.BaseFormlet().FlipBody(formlet)));
      },
      Flowlet:function(formlet)
      {
       return Data.OfIFormlet(Data.PropagateRenderFrom(formlet,Data.BaseFormlet().WithLayout(Data.Layout().get_Flowlet(),formlet)));
      },
      Horizontal:function(formlet)
      {
       return Data.OfIFormlet(Data.PropagateRenderFrom(formlet,Data.BaseFormlet().WithLayout(Data.Layout().get_Horizontal(),formlet)));
      },
      InitWith:function(value,formlet)
      {
       return Data.OfIFormlet(Data.PropagateRenderFrom(formlet,Data.BaseFormlet().InitWith(value,formlet)));
      },
      InitWithFailure:function(formlet)
      {
       return Data.OfIFormlet(Data.PropagateRenderFrom(formlet,Data.BaseFormlet().InitWithFailure(formlet)));
      },
      Join:function(formlet)
      {
       var x;
       x=Formlet2.Map(function(f)
       {
        return f;
       },formlet);
       return Data.OfIFormlet(Data.PropagateRenderFrom(formlet,Data.BaseFormlet().Join(x)));
      },
      LiftResult:function(formlet)
      {
       return Data.OfIFormlet(Data.PropagateRenderFrom(formlet,Data.BaseFormlet().LiftResult(formlet)));
      },
      Map:function(f,formlet)
      {
       return Data.OfIFormlet(Data.PropagateRenderFrom(formlet,Data.BaseFormlet().Map(f,formlet)));
      },
      MapBody:function(f,formlet)
      {
       return Data.OfIFormlet(Data.PropagateRenderFrom(formlet,Data.BaseFormlet().MapBody(f,formlet)));
      },
      MapElement:function(f,formlet)
      {
       return Data.OfIFormlet(Data.PropagateRenderFrom(formlet,Data.BaseFormlet().MapBody(function(b)
       {
        return Runtime.New(Body,{
         Element:f(b.Element),
         Label:b.Label
        });
       },formlet)));
      },
      MapResult:function(f,formlet)
      {
       return Data.OfIFormlet(Data.PropagateRenderFrom(formlet,Data.BaseFormlet().MapResult(f,formlet)));
      },
      Never:function()
      {
       return Data.OfIFormlet(Data.BaseFormlet().Never());
      },
      New:function(f)
      {
       return Data.OfIFormlet(Data.BaseFormlet().New(f));
      },
      OfElement:function(genElem)
      {
       return Data.MkFormlet(function()
       {
        return[genElem(null),function()
        {
        },Data.RX().Return(Runtime.New(Result,{
         $:0,
         $0:null
        }))];
       });
      },
      Render:function(formlet)
      {
       return Data.PropagateRenderFrom(formlet,formlet.Run(function()
       {
       }));
      },
      Replace:function(formlet,f)
      {
       return Data.OfIFormlet(Data.PropagateRenderFrom(formlet,Data.BaseFormlet().Replace(formlet,f)));
      },
      ReplaceFirstWithFailure:function(formlet)
      {
       return Data.OfIFormlet(Data.PropagateRenderFrom(formlet,Data.BaseFormlet().ReplaceFirstWithFailure(formlet)));
      },
      Return:function(x)
      {
       return Data.OfIFormlet(Data.BaseFormlet().Return(x));
      },
      ReturnEmpty:function(x)
      {
       return Data.OfIFormlet(Data.BaseFormlet().ReturnEmpty(x));
      },
      Run:function(f,formlet)
      {
       return formlet.Run(f);
      },
      SelectMany:function(formlet)
      {
       var x;
       x=Formlet2.Map(function(f)
       {
        return f;
       },formlet);
       return Data.OfIFormlet(Data.PropagateRenderFrom(formlet,Data.BaseFormlet().SelectMany(x)));
      },
      Sequence:function(fs)
      {
       var x;
       x=Seq.map(function(x1)
       {
        return x1;
       },fs);
       return Data.OfIFormlet(Data.BaseFormlet().Sequence(x));
      },
      Switch:function(formlet)
      {
       var x;
       x=Formlet2.Map(function(f)
       {
        return f;
       },formlet);
       return Data.OfIFormlet(Data.PropagateRenderFrom(formlet,Data.BaseFormlet().Switch(x)));
      },
      Vertical:function(formlet)
      {
       return Data.OfIFormlet(Data.PropagateRenderFrom(formlet,Data.BaseFormlet().WithLayout(Data.Layout().get_Vertical(),formlet)));
      },
      WithCancelation:function(formlet,c)
      {
       return Data.OfIFormlet(Data.PropagateRenderFrom(formlet,Data.BaseFormlet().WithCancelation(formlet,c)));
      },
      WithLabel:function(label,formlet)
      {
       return Data.OfIFormlet(Data.PropagateRenderFrom(formlet,Data.BaseFormlet().MapBody(function(body)
       {
        return Runtime.New(Body,{
         Element:body.Element,
         Label:label
        });
       },formlet)));
      },
      WithLayout:function(l,formlet)
      {
       return Data.OfIFormlet(Data.PropagateRenderFrom(formlet,Data.BaseFormlet().WithLayout(l,formlet)));
      },
      WithLayoutOrDefault:function(formlet)
      {
       return Data.OfIFormlet(Data.PropagateRenderFrom(formlet,Data.BaseFormlet().WithLayoutOrDefault(formlet)));
      },
      WithNotification:function(c,formlet)
      {
       return Data.OfIFormlet(Data.PropagateRenderFrom(formlet,Data.BaseFormlet().WithNotification(c,formlet)));
      },
      WithNotificationChannel:function(formlet)
      {
       return Data.OfIFormlet(Data.PropagateRenderFrom(formlet,Data.BaseFormlet().WithNotificationChannel(formlet)));
      }
     },
     FormletBuilder:Runtime.Class({
      Bind:function(formlet,f)
      {
       return Data.OfIFormlet(Data.PropagateRenderFrom(formlet,Data.BaseFormlet().Bind(formlet,f)));
      },
      Delay:function(f)
      {
       return Data.OfIFormlet(Data.BaseFormlet().Delay(f));
      },
      Return:function(x)
      {
       return Data.OfIFormlet(Data.BaseFormlet().Return(x));
      },
      ReturnFrom:function(formlet)
      {
       return Data.OfIFormlet(formlet);
      }
     },{
      New:function()
      {
       return Runtime.New(this,{});
      }
     }),
     Layout:{
      FormRowConfiguration:Runtime.Class({},{
       get_Default:function()
       {
        return Runtime.New(FormRowConfiguration,{
         Padding:{
          $:0
         },
         Color:{
          $:0
         },
         Class:{
          $:0
         },
         Style:{
          $:0
         },
         LabelConfiguration:{
          $:0
         }
        });
       }
      }),
      LabelConfiguration:Runtime.Class({},{
       get_Default:function()
       {
        return Runtime.New(LabelConfiguration,{
         Align:{
          $:0
         },
         VerticalAlign:{
          $:1
         },
         Placement:{
          $:0
         }
        });
       }
      }),
      Padding:Runtime.Class({},{
       get_Default:function()
       {
        return Runtime.New(Padding1,{
         Left:{
          $:0
         },
         Right:{
          $:0
         },
         Top:{
          $:0
         },
         Bottom:{
          $:0
         }
        });
       }
      })
     },
     LayoutProvider:Runtime.Class({
      ColumnLayout:function(rowConfig)
      {
       var objectArg,_this=this;
       objectArg=this.LayoutUtils;
       return objectArg.New(function()
       {
        var row,container,store,insert,remove;
        row=Default.TR(Runtime.New(T,{
         $:0
        }));
        container=Default.Table(List.ofArray([Default.TBody(List.ofArray([row]))]));
        store=ElementStore.NewElementStore();
        insert=function(rowIx)
        {
         return function(body)
         {
          var elemId,newCol,jqPanel,index,inserted;
          elemId=body.Element.get_Id();
          newCol=Default.TD(List.ofArray([Default.Table(List.ofArray([Default.TBody(List.ofArray([_this.MakeRow(rowConfig,rowIx,body)]))]))]));
          jqPanel=jQuery(row.Body);
          index={
           contents:0
          };
          inserted={
           contents:false
          };
          jqPanel.children().each(function()
          {
           var jqCol;
           jqCol=jQuery(this);
           if(rowIx===index.contents)
            {
             jQuery(newCol.Body).insertBefore(jqCol);
             newCol.Render();
             inserted.contents=true;
            }
           return Operators1.Increment(index);
          });
          if(!inserted.contents)
           {
            row.AppendI(newCol);
           }
          return store.RegisterElement(elemId,function()
          {
           return newCol["HtmlProvider@32"].Remove(newCol.Body);
          });
         };
        };
        remove=function(elems)
        {
         var enumerator;
         enumerator=Enumerator.Get(elems);
         while(enumerator.MoveNext())
          {
           store.Remove(enumerator.get_Current().Element.get_Id());
          }
         return;
        };
        return{
         Body:Runtime.New(Body,{
          Element:container,
          Label:{
           $:0
          }
         }),
         SyncRoot:null,
         Insert:insert,
         Remove:remove
        };
       });
      },
      HorizontalAlignElem:function(align,el)
      {
       var arg10;
       arg10="float:"+(align.$==0?"left":"right")+";";
       return Operators.add(Default.Div(List.ofArray([Default.Attr().NewAttr("style",arg10)])),List.ofArray([el]));
      },
      LabelLayout:function(lc)
      {
       var inputRecord;
       inputRecord=FormRowConfiguration.get_Default();
       return this.RowLayout(Runtime.New(FormRowConfiguration,{
        Padding:inputRecord.Padding,
        Color:inputRecord.Color,
        Class:inputRecord.Class,
        Style:inputRecord.Style,
        LabelConfiguration:{
         $:1,
         $0:lc
        }
       }));
      },
      MakeLayout:function(lm)
      {
       var objectArg;
       objectArg=this.LayoutUtils;
       return objectArg.New(function()
       {
        var lm1,store,insert,remove;
        lm1=lm(null);
        store=ElementStore.NewElementStore();
        insert=function(ix)
        {
         return function(bd)
         {
          var elemId,newElems;
          elemId=bd.Element.get_Id();
          newElems=(lm1.Insert.call(null,ix))(bd);
          return store.RegisterElement(elemId,function()
          {
           var enumerator,e;
           enumerator=Enumerator.Get(newElems);
           while(enumerator.MoveNext())
            {
             e=enumerator.get_Current();
             e["HtmlProvider@32"].Remove(e.Body);
            }
           return;
          });
         };
        };
        remove=function(elems)
        {
         var enumerator;
         enumerator=Enumerator.Get(elems);
         while(enumerator.MoveNext())
          {
           store.Remove(enumerator.get_Current().Element.get_Id());
          }
         return;
        };
        return{
         Body:Runtime.New(Body,{
          Element:lm1.Panel,
          Label:{
           $:0
          }
         }),
         SyncRoot:null,
         Insert:insert,
         Remove:remove
        };
       });
      },
      MakeRow:function(rowConfig,rowIndex,body)
      {
       var x,d,padding,x2,paddingLeft,x3,paddingTop,x4,paddingRight,x5,paddingBottom,makeCell,elem1,matchValue,cells,labelGen,x8,d1,labelConf,x9,arg00,label,matchValue1,xa,xb,xc,d2,rowClass,xd,d3,rowColorStyleProp,xe,d4,matchValue2,rowStyle,arg002;
       x=rowConfig.Padding;
       d=Padding1.get_Default();
       padding=Utils.Maybe(d,function(x1)
       {
        return x1;
       },x);
       x2=padding.Left;
       paddingLeft=Utils.Maybe(0,function(x1)
       {
        return x1;
       },x2);
       x3=padding.Top;
       paddingTop=Utils.Maybe(0,function(x1)
       {
        return x1;
       },x3);
       x4=padding.Right;
       paddingRight=Utils.Maybe(0,function(x1)
       {
        return x1;
       },x4);
       x5=padding.Bottom;
       paddingBottom=Utils.Maybe(0,function(x1)
       {
        return x1;
       },x5);
       makeCell=function(l)
       {
        return function(t)
        {
         return function(r)
         {
          return function(b)
          {
           return function(csp)
           {
            return function(valign)
            {
             return function(elem)
             {
              var x1,mapping,x6,paddingStyle,arg10;
              x1=List.ofArray([["padding-left: ",l],["padding-top: ",t],["padding-right: ",r],["padding-bottom: ",b]]);
              mapping=Runtime.Tupled(function(tupledArg)
              {
               return tupledArg[0]+Global.String(tupledArg[1])+"px;";
              });
              x6=List.map(mapping,x1);
              paddingStyle=Seq.reduce(function(x7)
              {
               return function(y)
               {
                return x7+y;
               };
              },x6);
              arg10=paddingStyle+";"+Utils.Maybe("",function(valign1)
              {
               return"vertical-align: "+(valign1.$==1?"middle":valign1.$==2?"bottom":"top")+";";
              },valign);
              return Default.TD(List.append(Runtime.New(T,{
               $:1,
               $0:Default.Attr().NewAttr("style",arg10),
               $1:csp?List.ofArray([Default.Attr().NewAttr("colspan","2")]):Runtime.New(T,{
                $:0
               })
              }),List.ofArray([elem])));
             };
            };
           };
          };
         };
        };
       };
       elem1=body.Element;
       matchValue=body.Label;
       if(matchValue.$==1)
        {
         labelGen=matchValue.$0;
         x8=rowConfig.LabelConfiguration;
         d1=LabelConfiguration.get_Default();
         labelConf=Utils.Maybe(d1,function(x1)
         {
          return x1;
         },x8);
         x9=labelGen(null);
         arg00=labelConf.Align;
         label=this.HorizontalAlignElem(arg00,x9);
         matchValue1=labelConf.Placement;
         if(matchValue1.$==3)
          {
           xa=Utils.InTable(List.ofArray([List.ofArray([elem1]),List.ofArray([label])]));
           cells=List.ofArray([((((((makeCell(paddingLeft))(paddingTop))(paddingRight))(paddingBottom))(true))({
            $:0
           }))(xa)]);
          }
         else
          {
           if(matchValue1.$==0)
            {
             cells=List.ofArray([((((((makeCell(paddingLeft))(paddingTop))(0))(paddingBottom))(false))({
              $:1,
              $0:labelConf.VerticalAlign
             }))(label),((((((makeCell(0))(paddingTop))(paddingRight))(paddingBottom))(false))({
              $:0
             }))(elem1)]);
            }
           else
            {
             if(matchValue1.$==1)
              {
               cells=List.ofArray([((((((makeCell(paddingLeft))(paddingTop))(0))(paddingBottom))(false))({
                $:1,
                $0:labelConf.VerticalAlign
               }))(elem1),((((((makeCell(0))(paddingTop))(paddingRight))(paddingBottom))(false))({
                $:0
               }))(label)]);
              }
             else
              {
               xb=Utils.InTable(List.ofArray([List.ofArray([label]),List.ofArray([elem1])]));
               cells=List.ofArray([((((((makeCell(paddingLeft))(paddingTop))(paddingRight))(paddingBottom))(true))({
                $:0
               }))(xb)]);
              }
            }
          }
        }
       else
        {
         cells=List.ofArray([((((((makeCell(paddingLeft))(paddingTop))(paddingRight))(paddingBottom))(true))({
          $:0
         }))(elem1)]);
        }
       xc=rowConfig.Class;
       d2=Runtime.New(T,{
        $:0
       });
       rowClass=Utils.Maybe(d2,function(classGen)
       {
        var arg001;
        arg001=classGen(rowIndex);
        return List.ofArray([Default.Attr().Class(arg001)]);
       },xc);
       xd=rowConfig.Color;
       d3=Runtime.New(T,{
        $:0
       });
       rowColorStyleProp=Utils.Maybe(d3,function(colGen)
       {
        return List.ofArray(["background-color: "+colGen(rowIndex)]);
       },xd);
       xe=rowConfig.Style;
       d4=Runtime.New(T,{
        $:0
       });
       matchValue2=List.append(rowColorStyleProp,Utils.Maybe(d4,function(styleGen)
       {
        return List.ofArray([styleGen(rowIndex)]);
       },xe));
       if(matchValue2.$==0)
        {
         rowStyle=Runtime.New(T,{
          $:0
         });
        }
       else
        {
         arg002=Seq.reduce(function(x1)
         {
          return function(y)
          {
           return x1+";"+y;
          };
         },matchValue2);
         rowStyle=List.ofArray([Default.Attr().NewAttr("style",arg002)]);
        }
       return Default.TR(List.append(rowClass,List.append(rowStyle,List.append(rowStyle,cells))));
      },
      RowLayout:function(rowConfig)
      {
       var objectArg,_this=this;
       objectArg=this.LayoutUtils;
       return objectArg.New(function()
       {
        var panel,container,store,insert,remove;
        panel=Default.TBody(Runtime.New(T,{
         $:0
        }));
        container=Default.Table(List.ofArray([panel]));
        store=ElementStore.NewElementStore();
        insert=function(rowIx)
        {
         return function(body)
         {
          var elemId,row,jqPanel,index,inserted;
          elemId=body.Element.get_Id();
          row=_this.MakeRow(rowConfig,rowIx,body);
          jqPanel=jQuery(panel.Body);
          index={
           contents:0
          };
          inserted={
           contents:false
          };
          jqPanel.children().each(function()
          {
           var jqRow;
           jqRow=jQuery(this);
           if(rowIx===index.contents)
            {
             jQuery(row.Body).insertBefore(jqRow);
             row.Render();
             inserted.contents=true;
            }
           return Operators1.Increment(index);
          });
          if(!inserted.contents)
           {
            panel.AppendI(row);
           }
          return store.RegisterElement(elemId,function()
          {
           return row["HtmlProvider@32"].Remove(row.Body);
          });
         };
        };
        remove=function(elems)
        {
         var enumerator;
         enumerator=Enumerator.Get(elems);
         while(enumerator.MoveNext())
          {
           store.Remove(enumerator.get_Current().Element.get_Id());
          }
         return;
        };
        return{
         Body:Runtime.New(Body,{
          Element:container,
          Label:{
           $:0
          }
         }),
         SyncRoot:null,
         Insert:insert,
         Remove:remove
        };
       });
      },
      VerticalAlignedTD:function(valign,elem)
      {
       var valign1,cell;
       valign1=valign.$==1?"middle":valign.$==2?"bottom":"top";
       cell=Default.TD(List.ofArray([elem]));
       cell["HtmlProvider@32"].SetCss(cell.Body,"vertical-align",valign1);
       return cell;
      },
      get_Flowlet:function()
      {
       return this.MakeLayout(function()
       {
        var panel;
        panel=Default.Div(Runtime.New(T,{
         $:0
        }));
        return{
         Insert:function()
         {
          return function(bd)
          {
           var nextScreen;
           nextScreen=Utils.InTable(List.ofArray([List.ofArray([bd.Label.$==1?bd.Label.$0.call(null,null):Default.Span(Runtime.New(T,{
            $:0
           })),Default.Div(List.ofArray([bd.Element]))])]));
           panel["HtmlProvider@32"].Clear(panel.Body);
           panel.AppendI(nextScreen);
           return List.ofArray([nextScreen]);
          };
         },
         Panel:panel
        };
       });
      },
      get_Horizontal:function()
      {
       return this.ColumnLayout(FormRowConfiguration.get_Default());
      },
      get_Vertical:function()
      {
       return this.RowLayout(FormRowConfiguration.get_Default());
      }
     },{
      New:function(LayoutUtils1)
      {
       var r;
       r=Runtime.New(this,{});
       r.LayoutUtils=LayoutUtils1;
       return r;
      }
     }),
     Utils:{
      InTable:function(rows)
      {
       return Default.Table(List.ofArray([Default.TBody(List.map(function(cols)
       {
        return Default.TR(List.map(function(c)
        {
         return Default.TD(List.ofArray([c]));
        },cols));
       },rows))]));
      },
      MapOption:function(f,value)
      {
       return value.$==1?{
        $:1,
        $0:f(value.$0)
       }:{
        $:0
       };
      },
      Maybe:function(d,f,o)
      {
       return o.$==0?d:f(o.$0);
      }
     }
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  WebSharper=Runtime.Safe(Global.IntelliFactory.WebSharper);
  Formlet=Runtime.Safe(WebSharper.Formlet);
  Body=Runtime.Safe(Formlet.Body);
  Controls=Runtime.Safe(Formlet.Controls);
  Html=Runtime.Safe(WebSharper.Html);
  Default=Runtime.Safe(Html.Default);
  List=Runtime.Safe(WebSharper.List);
  Data=Runtime.Safe(Formlet.Data);
  Reactive=Runtime.Safe(Global.IntelliFactory.Reactive);
  HotStream=Runtime.Safe(Reactive.HotStream);
  Formlet1=Runtime.Safe(Global.IntelliFactory.Formlet);
  Base=Runtime.Safe(Formlet1.Base);
  Result=Runtime.Safe(Base.Result);
  T=Runtime.Safe(List.T);
  Operators=Runtime.Safe(Html.Operators);
  jQuery=Runtime.Safe(Global.jQuery);
  EventsPervasives=Runtime.Safe(Html.EventsPervasives);
  Formlet2=Runtime.Safe(Formlet.Formlet);
  Operators1=Runtime.Safe(WebSharper.Operators);
  CssConstants=Runtime.Safe(Formlet.CssConstants);
  Math=Runtime.Safe(Global.Math);
  Seq=Runtime.Safe(WebSharper.Seq);
  Utils=Runtime.Safe(Formlet.Utils);
  Tree=Runtime.Safe(Base.Tree);
  Edit=Runtime.Safe(Tree.Edit);
  Form=Runtime.Safe(Base.Form);
  Arrays=Runtime.Safe(WebSharper.Arrays);
  FormletProvider=Runtime.Safe(Base.FormletProvider);
  Formlet3=Runtime.Safe(Data.Formlet);
  Util=Runtime.Safe(WebSharper.Util);
  LayoutProvider=Runtime.Safe(Formlet.LayoutProvider);
  LayoutUtils=Runtime.Safe(Base.LayoutUtils);
  Reactive1=Runtime.Safe(Reactive.Reactive);
  Validator=Runtime.Safe(Base.Validator);
  ValidatorProvidor=Runtime.Safe(Data.ValidatorProvidor);
  RegExp=Runtime.Safe(Global.RegExp);
  Collections=Runtime.Safe(WebSharper.Collections);
  Dictionary=Runtime.Safe(Collections.Dictionary);
  ElementStore=Runtime.Safe(Formlet.ElementStore);
  Enhance=Runtime.Safe(Formlet.Enhance);
  FormButtonConfiguration=Runtime.Safe(Enhance.FormButtonConfiguration);
  FormContainerConfiguration=Runtime.Safe(Enhance.FormContainerConfiguration);
  Padding=Runtime.Safe(Enhance.Padding);
  ManyConfiguration=Runtime.Safe(Enhance.ManyConfiguration);
  ValidationFrameConfiguration=Runtime.Safe(Enhance.ValidationFrameConfiguration);
  ValidationIconConfiguration=Runtime.Safe(Enhance.ValidationIconConfiguration);
  JSON=Runtime.Safe(Global.JSON);
  FormletBuilder=Runtime.Safe(Formlet.FormletBuilder);
  Layout=Runtime.Safe(Formlet.Layout);
  FormRowConfiguration=Runtime.Safe(Layout.FormRowConfiguration);
  LabelConfiguration=Runtime.Safe(Layout.LabelConfiguration);
  Padding1=Runtime.Safe(Layout.Padding);
  return Enumerator=Runtime.Safe(WebSharper.Enumerator);
 });
 Runtime.OnLoad(function()
 {
  Formlet2.Do();
  Data.Validator();
  Data.RX();
  Data.Layout();
  Data.DefaultLayout();
  CssConstants.InputTextClass();
  return;
 });
}());
