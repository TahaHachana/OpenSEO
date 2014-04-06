(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Formlet,Base,Formlet1,Form,Tree,Edit,Result,WebSharper,List,T,LayoutUtils,Tree1,Util,Seq,Enumerator,Unchecked;
 Runtime.Define(Global,{
  IntelliFactory:{
   Formlet:{
    Base:{
     D:Runtime.Class({
      Dispose:function()
      {
       return null;
      }
     },{
      New:function()
      {
       return Runtime.New(this,{});
      }
     }),
     Form:Runtime.Class({
      Dispose:function()
      {
       return this.Dispose1.call(null,null);
      }
     }),
     Formlet:Runtime.Class({
      Build:function()
      {
       return this.Build1.call(null,null);
      },
      MapResult:function(f)
      {
       var _this=this;
       return Runtime.New(Formlet1,{
        Layout:this.Layout,
        Build1:function()
        {
         var form;
         form=_this.Build1.call(null,null);
         _this.Utils.Reactive.Select(form.State,f);
         return Runtime.New(Form,{
          Body:form.Body,
          Dispose1:form.Dispose1,
          Notify:form.Notify,
          State:form.State
         });
        },
        Utils:_this.Utils
       });
      },
      get_Layout:function()
      {
       return this.Layout;
      }
     }),
     FormletBuilder:Runtime.Class({
      Bind:function(x,f)
      {
       return this.F.Bind(x,f);
      },
      Delay:function(f)
      {
       return this.F.Delay(f);
      },
      Return:function(x)
      {
       return this.F.Return(x);
      },
      ReturnFrom:function(f)
      {
       return f;
      }
     },{
      New:function(F)
      {
       var r;
       r=Runtime.New(this,{});
       r.F=F;
       return r;
      }
     }),
     FormletProvider:Runtime.Class({
      AppendLayout:function(layout,formlet)
      {
       return this.WithLayout(layout,this.ApplyLayout(formlet));
      },
      Apply:function(f,x)
      {
       var _this=this;
       return this.New(function()
       {
        var f1,x1,objectArg,arg00;
        f1=_this.BuildForm(f);
        x1=_this.BuildForm(x);
        objectArg=_this.U.Reactive;
        arg00=f1.Body;
        return Runtime.New(Form,{
         Body:_this.U.Reactive.Merge(objectArg.Select(arg00,function(arg0)
         {
          return Runtime.New(Edit,{
           $:1,
           $0:arg0
          });
         }),_this.U.Reactive.Select(x1.Body,function(arg0)
         {
          return Runtime.New(Edit,{
           $:2,
           $0:arg0
          });
         })),
         Dispose1:function()
         {
          x1.Dispose1.call(null,null);
          return f1.Dispose1.call(null,null);
         },
         Notify:function(o)
         {
          x1.Notify.call(null,o);
          return f1.Notify.call(null,o);
         },
         State:_this.U.Reactive.CombineLatest(x1.State,f1.State,function(r)
         {
          return function(f2)
          {
           return Result.Apply(f2,r);
          };
         })
        });
       });
      },
      ApplyLayout:function(formlet)
      {
       var _this=this;
       return this.New(function()
       {
        var form,matchValue;
        form=formlet.Build();
        matchValue=formlet.get_Layout().Apply.call(null,form.Body);
        return Runtime.New(Form,{
         Body:matchValue.$==0?form.Body:_this.U.Reactive.Return(Tree.Set(matchValue.$0[0])),
         Dispose1:form.Dispose1,
         Notify:form.Notify,
         State:form.State
        });
       });
      },
      Bind:function(formlet,f)
      {
       return this.Join(this.Map(f,formlet));
      },
      BindWith:function(hF,formlet,f)
      {
       var _this=this;
       return this.New(function()
       {
        var formlet1,form,objectArg,x,left,objectArg1,x1,right,matchValue,_,bRight;
        formlet1=_this.Bind(formlet,f);
        form=formlet1.Build();
        objectArg=_this.U.Reactive;
        x=objectArg.Where(form.Body,function(edit)
        {
         return edit.$==1?true:false;
        });
        left=_this.U.DefaultLayout.Apply.call(null,x);
        objectArg1=_this.U.Reactive;
        x1=objectArg1.Where(form.Body,function(edit)
        {
         return edit.$==2?true:false;
        });
        right=_this.U.DefaultLayout.Apply.call(null,x1);
        matchValue=[left,right];
        if(matchValue[0].$==1)
         {
          if(matchValue[1].$==1)
           {
            bRight=matchValue[1].$0[0];
            _=_this.U.Reactive.Return(Tree.Set((hF(matchValue[0].$0[0]))(bRight)));
           }
          else
           {
            _=_this.U.Reactive.Never();
           }
         }
        else
         {
          _=_this.U.Reactive.Never();
         }
        return Runtime.New(Form,{
         Body:_,
         Dispose1:form.Dispose1,
         Notify:form.Notify,
         State:form.State
        });
       });
      },
      BuildForm:function(formlet)
      {
       var form,matchValue,d;
       form=formlet.Build();
       matchValue=formlet.get_Layout().Apply.call(null,form.Body);
       if(matchValue.$==1)
        {
         d=matchValue.$0[1];
         return Runtime.New(Form,{
          Body:this.U.Reactive.Return(Tree.Set(matchValue.$0[0])),
          Dispose1:function()
          {
           form.Dispose1.call(null,null);
           return d.Dispose();
          },
          Notify:form.Notify,
          State:form.State
         });
        }
       else
        {
         return form;
        }
      },
      Delay:function(f)
      {
       var Build,_this=this;
       Build=function()
       {
        return _this.BuildForm(f(null));
       };
       return Runtime.New(Formlet1,{
        Layout:_this.L.Delay(function()
        {
         return f(null).get_Layout();
        }),
        Build1:Build,
        Utils:_this.U
       });
      },
      Deletable:function(formlet)
      {
       var _this=this;
       return this.Replace(formlet,function(value)
       {
        return value.$==1?_this.Return({
         $:1,
         $0:value.$0
        }):_this.ReturnEmpty({
         $:0
        });
       });
      },
      Empty:function()
      {
       var _this=this;
       return this.New(function()
       {
        return Runtime.New(Form,{
         Body:_this.U.Reactive.Return(Tree.Delete()),
         Dispose1:function()
         {
         },
         Notify:function()
         {
         },
         State:_this.U.Reactive.Never()
        });
       });
      },
      EmptyForm:function()
      {
       return Runtime.New(Form,{
        Body:this.U.Reactive.Never(),
        Dispose1:function()
        {
        },
        Notify:function()
        {
        },
        State:this.U.Reactive.Never()
       });
      },
      Fail:function(fs)
      {
       return Runtime.New(Form,{
        Body:this.U.Reactive.Never(),
        Dispose1:function(x)
        {
         return x;
        },
        Notify:function()
        {
        },
        State:this.U.Reactive.Return(Runtime.New(Result,{
         $:1,
         $0:fs
        }))
       });
      },
      FailWith:function(fs)
      {
       var _this=this;
       return this.New(function()
       {
        return _this.Fail(fs);
       });
      },
      FlipBody:function(formlet)
      {
       var arg10,_this=this;
       arg10=this.New(function()
       {
        var form;
        form=formlet.Build();
        return Runtime.New(Form,{
         Body:_this.U.Reactive.Select(form.Body,function(edit)
         {
          return Tree.FlipEdit(edit);
         }),
         Dispose1:form.Dispose1,
         Notify:form.Notify,
         State:form.State
        });
       });
       return _this.WithLayout(formlet.get_Layout(),arg10);
      },
      FromState:function(state)
      {
       var _this=this;
       return this.New(function()
       {
        return Runtime.New(Form,{
         Body:_this.U.Reactive.Never(),
         Dispose1:function()
         {
         },
         Notify:function()
         {
         },
         State:state
        });
       });
      },
      InitWith:function(value,formlet)
      {
       var arg10,_this=this;
       arg10=this.New(function()
       {
        var form,arg101;
        form=formlet.Build();
        arg101=form.State;
        return Runtime.New(Form,{
         Body:form.Body,
         Dispose1:form.Dispose1,
         Notify:form.Notify,
         State:_this.U.Reactive.Concat(_this.U.Reactive.Return(Runtime.New(Result,{
          $:0,
          $0:value
         })),arg101)
        });
       });
       return _this.WithLayout(formlet.get_Layout(),arg10);
      },
      InitWithFailure:function(formlet)
      {
       var arg10,_this=this;
       arg10=this.New(function()
       {
        var form,arg101;
        form=formlet.Build();
        arg101=form.State;
        return Runtime.New(Form,{
         Body:form.Body,
         Dispose1:form.Dispose1,
         Notify:form.Notify,
         State:_this.U.Reactive.Concat(_this.U.Reactive.Return(Runtime.New(Result,{
          $:1,
          $0:Runtime.New(T,{
           $:0
          })
         })),arg101)
        });
       });
       return _this.WithLayout(formlet.get_Layout(),arg10);
      },
      Join:function(formlet)
      {
       var _this=this;
       return this.New(function()
       {
        var form1,objectArg,x,objectArg1,formStream,objectArg2,arg10,right;
        form1=_this.BuildForm(formlet);
        objectArg=_this.U.Reactive;
        x=objectArg.Select(form1.State,function(res)
        {
         return res.$==1?_this.Fail(res.$0):_this.BuildForm(res.$0);
        });
        objectArg1=_this.U.Reactive;
        formStream=objectArg1.Heat(x);
        objectArg2=_this.U.Reactive;
        arg10=function(arg0)
        {
         return Runtime.New(Edit,{
          $:2,
          $0:arg0
         });
        };
        right=_this.U.Reactive.Select(_this.U.Reactive.Switch(objectArg2.Select(formStream,function(f)
        {
         var arg101;
         arg101=f.Body;
         return _this.U.Reactive.Concat(_this.U.Reactive.Return(Tree.Delete()),arg101);
        })),arg10);
        return Runtime.New(Form,{
         Body:_this.U.Reactive.Merge(_this.U.Reactive.Select(form1.Body,function(arg0)
         {
          return Runtime.New(Edit,{
           $:1,
           $0:arg0
          });
         }),right),
         Dispose1:function()
         {
          return form1.Dispose1.call(null,null);
         },
         Notify:form1.Notify,
         State:_this.U.Reactive.Switch(_this.U.Reactive.Select(formStream,function(f)
         {
          return f.State;
         }))
        });
       });
      },
      LiftResult:function(formlet)
      {
       return this.MapResult(function(arg0)
       {
        return Runtime.New(Result,{
         $:0,
         $0:arg0
        });
       },formlet);
      },
      Map:function(f,formlet)
      {
       return this.MapResult(function(arg10)
       {
        return Result.Map(f,arg10);
       },formlet);
      },
      MapBody:function(f,formlet)
      {
       var _this=this;
       return this.WithLayout({
        Apply:function(o)
        {
         var matchValue,matchValue1,d,d1;
         matchValue=formlet.get_Layout().Apply.call(null,o);
         if(matchValue.$==0)
          {
           matchValue1=_this.U.DefaultLayout.Apply.call(null,o);
           if(matchValue1.$==0)
            {
             return{
              $:0
             };
            }
           else
            {
             d=matchValue1.$0[1];
             return{
              $:1,
              $0:[f(matchValue1.$0[0]),d]
             };
            }
          }
         else
          {
           d1=matchValue.$0[1];
           return{
            $:1,
            $0:[f(matchValue.$0[0]),d1]
           };
          }
        }
       },formlet);
      },
      MapResult:function(f,formlet)
      {
       var Build,_this=this;
       Build=function()
       {
        var form;
        form=formlet.Build();
        return Runtime.New(Form,{
         Body:form.Body,
         Dispose1:form.Dispose1,
         Notify:form.Notify,
         State:_this.U.Reactive.Select(form.State,f)
        });
       };
       return Runtime.New(Formlet1,{
        Layout:formlet.get_Layout(),
        Build1:Build,
        Utils:_this.U
       });
      },
      Never:function()
      {
       var _this=this;
       return this.New(function()
       {
        return Runtime.New(Form,{
         Body:_this.U.Reactive.Never(),
         Dispose1:function()
         {
         },
         Notify:function()
         {
         },
         State:_this.U.Reactive.Never()
        });
       });
      },
      New:function(build)
      {
       return Runtime.New(Formlet1,{
        Layout:this.L.Default(),
        Build1:build,
        Utils:this.U
       });
      },
      Replace:function(formlet,f)
      {
       return this.Switch(this.Map(f,formlet));
      },
      ReplaceFirstWithFailure:function(formlet)
      {
       var arg10,_this=this;
       arg10=this.New(function()
       {
        var form,state;
        form=formlet.Build();
        state=_this.U.Reactive.Drop(form.State,1);
        return Runtime.New(Form,{
         Body:form.Body,
         Dispose1:form.Dispose1,
         Notify:form.Notify,
         State:_this.U.Reactive.Concat(_this.U.Reactive.Return(Runtime.New(Result,{
          $:1,
          $0:Runtime.New(T,{
           $:0
          })
         })),state)
        });
       });
       return _this.WithLayout(formlet.get_Layout(),arg10);
      },
      Return:function(x)
      {
       var _this=this;
       return this.New(function()
       {
        return Runtime.New(Form,{
         Body:_this.U.Reactive.Never(),
         Dispose1:function(x1)
         {
          return x1;
         },
         Notify:function()
         {
         },
         State:_this.U.Reactive.Return(Runtime.New(Result,{
          $:0,
          $0:x
         }))
        });
       });
      },
      ReturnEmpty:function(x)
      {
       var _this=this;
       return this.New(function()
       {
        return Runtime.New(Form,{
         Body:_this.U.Reactive.Return(Tree.Delete()),
         Dispose1:function(x1)
         {
          return x1;
         },
         Notify:function()
         {
         },
         State:_this.U.Reactive.Return(Runtime.New(Result,{
          $:0,
          $0:x
         }))
        });
       });
      },
      SelectMany:function(formlet)
      {
       var _this=this;
       return this.New(function()
       {
        var form1,objectArg,x,objectArg1,formStream,objectArg2,arg00,left,tag,arg10;
        form1=_this.BuildForm(formlet);
        objectArg=_this.U.Reactive;
        x=objectArg.Choose(form1.State,function(res)
        {
         return res.$==1?{
          $:0
         }:{
          $:1,
          $0:_this.BuildForm(res.$0)
         };
        });
        objectArg1=_this.U.Reactive;
        formStream=objectArg1.Heat(x);
        objectArg2=_this.U.Reactive;
        arg00=form1.Body;
        left=objectArg2.Select(arg00,function(arg0)
        {
         return Runtime.New(Edit,{
          $:1,
          $0:arg0
         });
        });
        tag={
         contents:function(arg0)
         {
          return Runtime.New(Edit,{
           $:1,
           $0:arg0
          });
         }
        };
        arg10=function(arg001)
        {
         return Result.Sequence(arg001);
        };
        return Runtime.New(Form,{
         Body:_this.U.Reactive.Merge(left,_this.U.Reactive.SelectMany(_this.U.Reactive.Select(formStream,function(f)
         {
          var g;
          g=tag.contents;
          tag.contents=function(x1)
          {
           return Runtime.New(Edit,{
            $:2,
            $0:g(x1)
           });
          };
          return _this.U.Reactive.Select(f.Body,tag.contents);
         }))),
         Dispose1:function()
         {
          return form1.Dispose1.call(null,null);
         },
         Notify:form1.Notify,
         State:_this.U.Reactive.Select(_this.U.Reactive.CollectLatest(_this.U.Reactive.Select(formStream,function(f)
         {
          return f.State;
         })),arg10)
        });
       });
      },
      Sequence:function(fs)
      {
       var fs1,fs2,f,fComp,fRest;
       fs1=List.ofSeq(fs);
       if(fs1.$==1)
        {
         fs2=fs1.$1;
         f=fs1.$0;
         fComp=this.Return(function(v)
         {
          return function(vs)
          {
           return Runtime.New(T,{
            $:1,
            $0:v,
            $1:vs
           });
          };
         });
         fRest=this.Sequence(fs2);
         return this.Apply(this.Apply(fComp,f),fRest);
        }
       else
        {
         return this.Return(Runtime.New(T,{
          $:0
         }));
        }
      },
      Switch:function(formlet)
      {
       var _this=this;
       return this.New(function()
       {
        var x,formlet1,form1,objectArg,x1,objectArg1,formStream;
        x=_this.WithLayoutOrDefault(formlet);
        formlet1=_this.ApplyLayout(x);
        form1=_this.BuildForm(formlet1);
        objectArg=_this.U.Reactive;
        x1=objectArg.Choose(form1.State,function(res)
        {
         return res.$==1?{
          $:0
         }:{
          $:1,
          $0:_this.BuildForm(res.$0)
         };
        });
        objectArg1=_this.U.Reactive;
        formStream=objectArg1.Heat(x1);
        return Runtime.New(Form,{
         Body:_this.U.Reactive.Concat(form1.Body,_this.U.Reactive.Switch(_this.U.Reactive.Select(formStream,function(f)
         {
          return f.Body;
         }))),
         Dispose1:function()
         {
          return form1.Dispose1.call(null,null);
         },
         Notify:form1.Notify,
         State:_this.U.Reactive.Switch(_this.U.Reactive.Select(formStream,function(f)
         {
          return f.State;
         }))
        });
       });
      },
      WithCancelation:function(formlet,cancelFormlet)
      {
       var f1,f2,f3;
       f1=this.Return(function(r1)
       {
        return function(r2)
        {
         var matchValue;
         matchValue=[r1,r2];
         return matchValue[1].$==0?Runtime.New(Result,{
          $:0,
          $0:{
           $:0
          }
         }):matchValue[0].$==1?Runtime.New(Result,{
          $:1,
          $0:matchValue[0].$0
         }):Runtime.New(Result,{
          $:0,
          $0:{
           $:1,
           $0:matchValue[0].$0
          }
         });
        };
       });
       f2=this.LiftResult(formlet);
       f3=this.LiftResult(cancelFormlet);
       return this.MapResult(function(arg00)
       {
        return Result.Join(arg00);
       },this.Apply(this.Apply(f1,f2),f3));
      },
      WithLayout:function(layout,formlet)
      {
       return Runtime.New(Formlet1,{
        Layout:layout,
        Build1:function()
        {
         return formlet.Build();
        },
        Utils:this.U
       });
      },
      WithLayoutOrDefault:function(formlet)
      {
       return this.MapBody(function(x)
       {
        return x;
       },formlet);
      },
      WithNotification:function(notify,formlet)
      {
       var arg10,_this=this;
       arg10=this.New(function()
       {
        var form;
        form=_this.BuildForm(formlet);
        return Runtime.New(Form,{
         Body:form.Body,
         Dispose1:form.Dispose1,
         Notify:function(obj)
         {
          form.Notify.call(null,obj);
          return notify(obj);
         },
         State:form.State
        });
       });
       return _this.WithLayout(formlet.get_Layout(),arg10);
      },
      WithNotificationChannel:function(formlet)
      {
       var arg10,_this=this;
       arg10=this.New(function()
       {
        var form,arg00;
        form=formlet.Build();
        arg00=function(v)
        {
         return[v,form.Notify];
        };
        return Runtime.New(Form,{
         Body:form.Body,
         Dispose1:form.Dispose1,
         Notify:form.Notify,
         State:_this.U.Reactive.Select(form.State,function(arg101)
         {
          return Result.Map(arg00,arg101);
         })
        });
       });
       return _this.WithLayout(formlet.get_Layout(),arg10);
      }
     },{
      New:function(U)
      {
       var r;
       r=Runtime.New(this,{});
       r.U=U;
       r.L=LayoutUtils.New({
        Reactive:r.U.Reactive
       });
       return r;
      }
     }),
     LayoutUtils:Runtime.Class({
      Default:function()
      {
       return{
        Apply:function()
        {
         return{
          $:0
         };
        }
       };
      },
      Delay:function(f)
      {
       return{
        Apply:function(x)
        {
         return f(null).Apply.call(null,x);
        }
       };
      },
      New:function(container)
      {
       return{
        Apply:function(event)
        {
         var panel,tree;
         panel=container(null);
         tree={
          contents:Runtime.New(Tree1,{
           $:0
          })
         };
         return{
          $:1,
          $0:[panel.Body,Util.subscribeTo(event,function(edit)
          {
           var deletedTree,off;
           deletedTree=Tree.ReplacedTree(edit,tree.contents);
           tree.contents=Tree.Apply(edit,tree.contents);
           off=(Tree.Range(edit,tree.contents))[0];
           panel.Remove.call(null,deletedTree.get_Sequence());
           return Seq.iteri(function(i)
           {
            return function(e)
            {
             return(panel.Insert.call(null,off+i))(e);
            };
           },edit);
          })]
         };
        }
       };
      }
     },{
      New:function()
      {
       return Runtime.New(this,{});
      }
     }),
     Result:Runtime.Class({},{
      Apply:function(f,r)
      {
       var matchValue;
       matchValue=[f,r];
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
      Join:function(res)
      {
       return res.$==1?Runtime.New(Result,{
        $:1,
        $0:res.$0
       }):res.$0;
      },
      Map:function(f,res)
      {
       return res.$==1?Runtime.New(Result,{
        $:1,
        $0:res.$0
       }):Runtime.New(Result,{
        $:0,
        $0:f(res.$0)
       });
      },
      OfOption:function(o)
      {
       return o.$==0?Runtime.New(Result,{
        $:1,
        $0:Runtime.New(T,{
         $:0
        })
       }):Runtime.New(Result,{
        $:0,
        $0:o.$0
       });
      },
      Sequence:function(rs)
      {
       return Seq.fold(function(rs1)
       {
        return function(r)
        {
         var fs1,vs;
         if(rs1.$==1)
          {
           fs1=rs1.$0;
           return r.$==1?Runtime.New(Result,{
            $:1,
            $0:List.append(fs1,r.$0)
           }):Runtime.New(Result,{
            $:1,
            $0:fs1
           });
          }
         else
          {
           vs=rs1.$0;
           return r.$==1?Runtime.New(Result,{
            $:1,
            $0:r.$0
           }):Runtime.New(Result,{
            $:0,
            $0:List.append(vs,List.ofArray([r.$0]))
           });
          }
        };
       },Runtime.New(Result,{
        $:0,
        $0:Runtime.New(T,{
         $:0
        })
       }),rs);
      }
     }),
     Tree:{
      Apply:function(edit,input)
      {
       var apply;
       apply=function(edit1,input1)
       {
        var edit2,r,edit3;
        if(edit1.$==1)
         {
          edit2=edit1.$0;
          if(input1.$==2)
           {
            r=input1.$1;
            return Runtime.New(Tree1,{
             $:2,
             $0:apply(edit2,input1.$0),
             $1:r
            });
           }
          else
           {
            return apply(Runtime.New(Edit,{
             $:1,
             $0:edit2
            }),Runtime.New(Tree1,{
             $:2,
             $0:Runtime.New(Tree1,{
              $:0
             }),
             $1:input1
            }));
           }
         }
        else
         {
          if(edit1.$==2)
           {
            edit3=edit1.$0;
            return input1.$==2?Runtime.New(Tree1,{
             $:2,
             $0:input1.$0,
             $1:apply(edit3,input1.$1)
            }):apply(Runtime.New(Edit,{
             $:2,
             $0:edit3
            }),Runtime.New(Tree1,{
             $:2,
             $0:input1,
             $1:Runtime.New(Tree1,{
              $:0
             })
            }));
           }
          else
           {
            return edit1.$0;
           }
         }
       };
       return apply(edit,input);
      },
      Count:function(t)
      {
       var loop,_,a,_1,_2,tree,k,ts,_3;
       loop=[];
       _=Runtime.New(T,{
        $:0
       });
       loop[3]=t;
       loop[2]=_;
       loop[1]=0;
       loop[0]=1;
       while(loop[0])
        {
         if(loop[3].$==2)
          {
           a=loop[3].$0;
           _1=Runtime.New(T,{
            $:1,
            $0:loop[3].$1,
            $1:loop[2]
           });
           _2=loop[1];
           loop[3]=a;
           loop[2]=_1;
           loop[1]=_2;
           loop[0]=1;
          }
         else
          {
           tree=loop[3];
           k=tree.$==0?0:1;
           if(loop[2].$==1)
            {
             ts=loop[2].$1;
             _3=loop[1]+k;
             loop[3]=loop[2].$0;
             loop[2]=ts;
             loop[1]=_3;
             loop[0]=1;
            }
           else
            {
             loop[0]=0;
             loop[1]=loop[1]+k;
            }
          }
        }
       return loop[1];
      },
      DeepFlipEdit:function(edit)
      {
       return edit.$==1?Runtime.New(Edit,{
        $:2,
        $0:Tree.DeepFlipEdit(edit.$0)
       }):edit.$==2?Runtime.New(Edit,{
        $:1,
        $0:Tree.DeepFlipEdit(edit.$0)
       }):Runtime.New(Edit,{
        $:0,
        $0:edit.$0
       });
      },
      Delete:function()
      {
       return Runtime.New(Edit,{
        $:0,
        $0:Runtime.New(Tree1,{
         $:0
        })
       });
      },
      Edit:Runtime.Class({
       GetEnumerator:function()
       {
        return Enumerator.Get(this.get_Sequence());
       },
       GetEnumerator1:function()
       {
        return Enumerator.Get(this.get_Sequence());
       },
       get_Sequence:function()
       {
        return this.$==1?this.$0.get_Sequence():this.$==2?this.$0.get_Sequence():this.$0.get_Sequence();
       }
      }),
      FlipEdit:function(edit)
      {
       return edit.$==1?Runtime.New(Edit,{
        $:2,
        $0:edit.$0
       }):edit.$==2?Runtime.New(Edit,{
        $:1,
        $0:edit.$0
       }):Runtime.New(Edit,{
        $:0,
        $0:edit.$0
       });
      },
      FromSequence:function(vs)
      {
       return Seq.fold(function(state)
       {
        return function(v)
        {
         return Runtime.New(Tree1,{
          $:2,
          $0:state,
          $1:Runtime.New(Tree1,{
           $:1,
           $0:v
          })
         });
        };
       },Runtime.New(Tree1,{
        $:0
       }),vs);
      },
      Range:function(edit,input)
      {
       var loop,edit1,l,_,_1,edit2,r,_2,_3;
       loop=[];
       loop[3]=0;
       loop[2]=input;
       loop[1]=edit;
       loop[0]=1;
       while(loop[0])
        {
         if(loop[1].$==1)
          {
           edit1=loop[1].$0;
           if(loop[2].$==2)
            {
             l=loop[2].$0;
             loop[3]=loop[3];
             loop[2]=l;
             loop[1]=edit1;
             loop[0]=1;
            }
           else
            {
             _=loop[3];
             _1=Runtime.New(Tree1,{
              $:0
             });
             loop[3]=_;
             loop[2]=_1;
             loop[1]=edit1;
             loop[0]=1;
            }
          }
         else
          {
           if(loop[1].$==2)
            {
             edit2=loop[1].$0;
             if(loop[2].$==2)
              {
               r=loop[2].$1;
               loop[3]=loop[3]+Tree.Count(loop[2].$0);
               loop[2]=r;
               loop[1]=edit2;
               loop[0]=1;
              }
             else
              {
               _2=loop[3]+Tree.Count(loop[2]);
               _3=Runtime.New(Tree1,{
                $:0
               });
               loop[3]=_2;
               loop[2]=_3;
               loop[1]=edit2;
               loop[0]=1;
              }
            }
           else
            {
             loop[0]=0;
             loop[1]=[loop[3],Tree.Count(loop[2])];
            }
          }
        }
       return loop[1];
      },
      ReplacedTree:function(edit,input)
      {
       var edit1,edit2;
       if(edit.$==1)
        {
         edit1=edit.$0;
         return input.$==2?Tree.ReplacedTree(edit1,input.$0):Tree.ReplacedTree(Runtime.New(Edit,{
          $:1,
          $0:edit1
         }),Runtime.New(Tree1,{
          $:2,
          $0:Runtime.New(Tree1,{
           $:0
          }),
          $1:input
         }));
        }
       else
        {
         if(edit.$==2)
          {
           edit2=edit.$0;
           return input.$==2?Tree.ReplacedTree(edit2,input.$1):Tree.ReplacedTree(Runtime.New(Edit,{
            $:2,
            $0:edit2
           }),Runtime.New(Tree1,{
            $:2,
            $0:input,
            $1:Runtime.New(Tree1,{
             $:0
            })
           }));
          }
         else
          {
           return input;
          }
        }
      },
      Set:function(value)
      {
       return Runtime.New(Edit,{
        $:0,
        $0:Runtime.New(Tree1,{
         $:1,
         $0:value
        })
       });
      },
      ShowEdit:function(edit)
      {
       var showE;
       showE=function(edit1)
       {
        return edit1.$==1?"Left > "+showE(edit1.$0):edit1.$==2?"Right > "+showE(edit1.$0):"Replace";
       };
       return showE(edit);
      },
      Transform:function(f,edit)
      {
       return edit.$==1?Runtime.New(Edit,{
        $:1,
        $0:Tree.Transform(f,edit.$0)
       }):edit.$==2?Runtime.New(Edit,{
        $:2,
        $0:Tree.Transform(f,edit.$0)
       }):Runtime.New(Edit,{
        $:0,
        $0:f(edit.$0)
       });
      },
      Tree:Runtime.Class({
       GetEnumerator:function()
       {
        return Enumerator.Get(this.get_Sequence());
       },
       GetEnumerator1:function()
       {
        return Enumerator.Get(this.get_Sequence());
       },
       Map:function(f)
       {
        var right;
        if(this.$==1)
         {
          return Runtime.New(Tree1,{
           $:1,
           $0:f(this.$0)
          });
         }
        else
         {
          if(this.$==2)
           {
            right=this.$1;
            return Runtime.New(Tree1,{
             $:2,
             $0:this.$0.Map(f),
             $1:right.Map(f)
            });
           }
          else
           {
            return Runtime.New(Tree1,{
             $:0
            });
           }
         }
       },
       get_Sequence:function()
       {
        var y;
        if(this.$==1)
         {
          return[this.$0];
         }
        else
         {
          if(this.$==2)
           {
            y=this.$1;
            return Seq.append(this.$0.get_Sequence(),y.get_Sequence());
           }
          else
           {
            return Seq.empty();
           }
         }
       }
      })
     },
     Validator:Runtime.Class({
      Is:function(f,m,flet)
      {
       return this.Validate(f,m,flet);
      },
      IsEmail:function(msg)
      {
       var _this=this;
       return function(arg20)
       {
        return _this.IsRegexMatch("^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$",msg,arg20);
       };
      },
      IsEqual:function(value,msg,flet)
      {
       return this.Validate(function(i)
       {
        return Unchecked.Equals(i,value);
       },msg,flet);
      },
      IsFloat:function(msg)
      {
       var _this=this;
       return function(arg20)
       {
        return _this.IsRegexMatch("^\\s*(\\+|-)?((\\d+(\\.\\d+)?)|(\\.\\d+))\\s*$",msg,arg20);
       };
      },
      IsGreaterThan:function(min,msg,flet)
      {
       return this.Validate(function(i)
       {
        return Unchecked.Compare(i,min)===1;
       },msg,flet);
      },
      IsInt:function(msg)
      {
       var _this=this;
       return function(arg20)
       {
        return _this.IsRegexMatch("^-?\\d+$",msg,arg20);
       };
      },
      IsLessThan:function(max,msg,flet)
      {
       return this.Validate(function(i)
       {
        return Unchecked.Compare(i,max)===-1;
       },msg,flet);
      },
      IsNotEmpty:function(msg,flet)
      {
       return this.Validate(function(s)
       {
        return s!=="";
       },msg,flet);
      },
      IsNotEqual:function(value,msg,flet)
      {
       return this.Validate(function(i)
       {
        return!Unchecked.Equals(i,value);
       },msg,flet);
      },
      IsRegexMatch:function(regex,msg,flet)
      {
       var _this=this;
       return this.Validate(function(x)
       {
        return _this.VP.Matches(regex,x);
       },msg,flet);
      },
      IsTrue:function(msg,flet)
      {
       return this.Validate(function(x)
       {
        return x;
       },msg,flet);
      },
      Validate:function(f,msg,flet)
      {
       return flet.MapResult(function(res)
       {
        var v;
        if(res.$==1)
         {
          return Runtime.New(Result,{
           $:1,
           $0:res.$0
          });
         }
        else
         {
          v=res.$0;
          return f(v)?Runtime.New(Result,{
           $:0,
           $0:v
          }):Runtime.New(Result,{
           $:1,
           $0:List.ofArray([msg])
          });
         }
       });
      }
     },{
      New:function(VP)
      {
       var r;
       r=Runtime.New(this,{});
       r.VP=VP;
       return r;
      }
     })
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Formlet=Runtime.Safe(Global.IntelliFactory.Formlet);
  Base=Runtime.Safe(Formlet.Base);
  Formlet1=Runtime.Safe(Base.Formlet);
  Form=Runtime.Safe(Base.Form);
  Tree=Runtime.Safe(Base.Tree);
  Edit=Runtime.Safe(Tree.Edit);
  Result=Runtime.Safe(Base.Result);
  WebSharper=Runtime.Safe(Global.IntelliFactory.WebSharper);
  List=Runtime.Safe(WebSharper.List);
  T=Runtime.Safe(List.T);
  LayoutUtils=Runtime.Safe(Base.LayoutUtils);
  Tree1=Runtime.Safe(Tree.Tree);
  Util=Runtime.Safe(WebSharper.Util);
  Seq=Runtime.Safe(WebSharper.Seq);
  Enumerator=Runtime.Safe(WebSharper.Enumerator);
  return Unchecked=Runtime.Safe(WebSharper.Unchecked);
 });
 Runtime.OnLoad(function()
 {
  return;
 });
}());
