(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,WebSharper,Html,Default,document,Json,JSON,JavaScript,Arrays,Attribute,Implementation,HTML5,Element,Enumerator,Math,jQuery,Events,JQueryEventSupport,AttributeBuilder,DeprecatedTagBuilder,Html5AttributeBuilder,JQueryHtmlProvider,Html5TagBuilder,TagBuilder,Text,Activator,HTML51,EventsPervasives;
 Runtime.Define(Global,{
  IntelliFactory:{
   WebSharper:{
    Html:{
     Activator:{
      Activate:Runtime.Field(function()
      {
       return Default.OnLoad(function()
       {
        var doc,meta,text,obj,x,f,action;
        doc=document;
        meta=doc.getElementById("websharper-data");
        text=meta.getAttribute("content");
        obj=Json.Activate(JSON.parse(text));
        x=JavaScript.GetFields(obj);
        f=(action=Runtime.Tupled(function(tupledArg)
        {
         var k,v,p,old;
         k=tupledArg[0];
         v=tupledArg[1];
         p=v.get_Body();
         old=doc.getElementById(k);
         old.parentNode.replaceChild(p.get_Body(),old);
         return p.Render();
        }),function(array)
        {
         return Arrays.iter(action,array);
        });
        return f(x);
       });
      })
     },
     Attribute:Runtime.Class({
      Render:function()
      {
       return null;
      },
      get_Body:function()
      {
       var attr;
       attr=this.HtmlProvider.CreateAttribute(this.Name);
       attr.nodeValue=this.Value;
       return attr;
      }
     },{
      New:function(htmlProvider,name,value)
      {
       var a;
       a=Attribute.New1(htmlProvider);
       a.Name=name;
       a.Value=value;
       return a;
      },
      New1:function(HtmlProvider)
      {
       var r;
       r={};
       r.HtmlProvider=HtmlProvider;
       return Runtime.New(this,r);
      }
     }),
     AttributeBuilder:Runtime.Class({
      Class:function(x)
      {
       return this.NewAttr("class",x);
      },
      NewAttr:function(name,value)
      {
       var a;
       a=Attribute.New(this.HtmlProvider,name,value);
       return a;
      },
      get_CheckBox:function()
      {
       return this.NewAttr("type","checkbox");
      },
      get_Hidden:function()
      {
       return this.NewAttr("type","hidden");
      },
      get_Password:function()
      {
       return this.NewAttr("type","password");
      },
      get_Radio:function()
      {
       return this.NewAttr("type","radio");
      },
      get_Reset:function()
      {
       return this.NewAttr("type","reset");
      },
      get_Submit:function()
      {
       return this.NewAttr("type","submit");
      },
      get_TextField:function()
      {
       return this.NewAttr("type","textfield");
      }
     },{
      New:function(HtmlProvider)
      {
       var r;
       r={};
       r.HtmlProvider=HtmlProvider;
       return Runtime.New(this,r);
      }
     }),
     Default:{
      A:function(x)
      {
       var _this;
       _this=Default.Tags();
       return _this.NewTag("a",x);
      },
      Action:function(x)
      {
       var _this;
       _this=Default.Attr();
       return _this.NewAttr("action",x);
      },
      Align:function(x)
      {
       var _this;
       _this=Default.Attr();
       return _this.NewAttr("align",x);
      },
      Alt:function(x)
      {
       var _this;
       _this=Default.Attr();
       return _this.NewAttr("alt",x);
      },
      Attr:Runtime.Field(function()
      {
       return Implementation.Attr();
      }),
      B:function(x)
      {
       var _this;
       _this=Default.Tags();
       return _this.NewTag("b",x);
      },
      Body:function(x)
      {
       var _this;
       _this=Default.Tags();
       return _this.NewTag("body",x);
      },
      Br:function(x)
      {
       var _this;
       _this=Default.Tags();
       return _this.NewTag("br",x);
      },
      Button:function(x)
      {
       var _this;
       _this=Default.Tags();
       return _this.NewTag("button",x);
      },
      Code:function(x)
      {
       var _this;
       _this=Default.Tags();
       return _this.NewTag("code",x);
      },
      Deprecated:Runtime.Field(function()
      {
       return Implementation.DeprecatedHtml();
      }),
      Div:function(x)
      {
       return Default.Tags().Div(x);
      },
      Em:function(x)
      {
       var _this;
       _this=Default.Tags();
       return _this.NewTag("em",x);
      },
      Form:function(x)
      {
       var _this;
       _this=Default.Tags();
       return _this.NewTag("form",x);
      },
      H1:function(x)
      {
       var _this;
       _this=Default.Tags();
       return _this.NewTag("h1",x);
      },
      H2:function(x)
      {
       var _this;
       _this=Default.Tags();
       return _this.NewTag("h2",x);
      },
      H3:function(x)
      {
       var _this;
       _this=Default.Tags();
       return _this.NewTag("h3",x);
      },
      H4:function(x)
      {
       var _this;
       _this=Default.Tags();
       return _this.NewTag("h4",x);
      },
      HRef:function(x)
      {
       var _this;
       _this=Default.Attr();
       return _this.NewAttr("href",x);
      },
      HTML5:{
       Attr:Runtime.Field(function()
       {
        return HTML5.Attr();
       }),
       Tags:Runtime.Field(function()
       {
        return HTML5.Tags();
       })
      },
      Head:function(x)
      {
       var _this;
       _this=Default.Tags();
       return _this.NewTag("head",x);
      },
      Height:function(x)
      {
       var _this;
       _this=Default.Attr();
       return _this.NewAttr("height",x);
      },
      Hr:function(x)
      {
       var _this;
       _this=Default.Tags();
       return _this.NewTag("hr",x);
      },
      I:function(x)
      {
       var _this;
       _this=Default.Tags();
       return _this.NewTag("i",x);
      },
      IFrame:function(x)
      {
       var _this;
       _this=Default.Tags();
       return _this.NewTag("iframe",x);
      },
      Id:function(x)
      {
       var _this;
       _this=Default.Attr();
       return _this.NewAttr("id",x);
      },
      Img:function(x)
      {
       var _this;
       _this=Default.Tags();
       return _this.NewTag("img",x);
      },
      Input:function(x)
      {
       var _this;
       _this=Default.Tags();
       return _this.NewTag("input",x);
      },
      LI:function(x)
      {
       var _this;
       _this=Default.Tags();
       return _this.NewTag("li",x);
      },
      Name:function(x)
      {
       var _this;
       _this=Default.Attr();
       return _this.NewAttr("name",x);
      },
      NewAttr:function(x)
      {
       return function(arg10)
       {
        return Default.Attr().NewAttr(x,arg10);
       };
      },
      OL:function(x)
      {
       var _this;
       _this=Default.Tags();
       return _this.NewTag("ol",x);
      },
      OnLoad:function(init)
      {
       return Implementation.HtmlProvider().OnDocumentReady(init);
      },
      P:function(x)
      {
       var _this;
       _this=Default.Tags();
       return _this.NewTag("p",x);
      },
      Pre:function(x)
      {
       var _this;
       _this=Default.Tags();
       return _this.NewTag("pre",x);
      },
      RowSpan:function(x)
      {
       var _this;
       _this=Default.Attr();
       return _this.NewAttr("rowspan",x);
      },
      Script:function(x)
      {
       var _this;
       _this=Default.Tags();
       return _this.NewTag("script",x);
      },
      Select:function(x)
      {
       var _this;
       _this=Default.Tags();
       return _this.NewTag("select",x);
      },
      Selected:function(x)
      {
       var _this;
       _this=Default.Attr();
       return _this.NewAttr("selected",x);
      },
      Span:function(x)
      {
       var _this;
       _this=Default.Tags();
       return _this.NewTag("span",x);
      },
      Src:function(x)
      {
       var _this;
       _this=Default.Attr();
       return _this.NewAttr("src",x);
      },
      TBody:function(x)
      {
       var _this;
       _this=Default.Tags();
       return _this.NewTag("tbody",x);
      },
      TD:function(x)
      {
       var _this;
       _this=Default.Tags();
       return _this.NewTag("td",x);
      },
      TFoot:function(x)
      {
       var _this;
       _this=Default.Tags();
       return _this.NewTag("tfoot",x);
      },
      TH:function(x)
      {
       var _this;
       _this=Default.Tags();
       return _this.NewTag("th",x);
      },
      THead:function(x)
      {
       var _this;
       _this=Default.Tags();
       return _this.NewTag("thead",x);
      },
      TR:function(x)
      {
       var _this;
       _this=Default.Tags();
       return _this.NewTag("tr",x);
      },
      Table:function(x)
      {
       var _this;
       _this=Default.Tags();
       return _this.NewTag("table",x);
      },
      Tags:Runtime.Field(function()
      {
       return Implementation.Tags();
      }),
      Text:function(x)
      {
       return Default.Tags().text(x);
      },
      TextArea:function(x)
      {
       var _this;
       _this=Default.Tags();
       return _this.NewTag("textarea",x);
      },
      UL:function(x)
      {
       var _this;
       _this=Default.Tags();
       return _this.NewTag("ul",x);
      },
      VAlign:function(x)
      {
       var _this;
       _this=Default.Attr();
       return _this.NewAttr("valign",x);
      },
      Width:function(x)
      {
       var _this;
       _this=Default.Attr();
       return _this.NewAttr("width",x);
      }
     },
     DeprecatedAttributeBuilder:Runtime.Class({
      NewAttr:function(name,value)
      {
       var a;
       a=Attribute.New(this.HtmlProvider,name,value);
       return a;
      }
     },{
      New:function(HtmlProvider)
      {
       var r;
       r={};
       r.HtmlProvider=HtmlProvider;
       return Runtime.New(this,r);
      }
     }),
     DeprecatedTagBuilder:Runtime.Class({
      NewTag:function(name,children)
      {
       var el,enumerator,pl;
       el=Element.New(this.HtmlProvider,name);
       enumerator=Enumerator.Get(children);
       while(enumerator.MoveNext())
        {
         pl=enumerator.get_Current();
         el.AppendI(pl);
        }
       return el;
      }
     },{
      New:function(HtmlProvider)
      {
       var r;
       r={};
       r.HtmlProvider=HtmlProvider;
       return Runtime.New(this,r);
      }
     }),
     Element:Runtime.Class({
      AppendI:function(pl)
      {
       var attr,objectArg,arg00,objectArg1,arg001,r;
       if(pl.get_Body().nodeType===2)
        {
         attr=pl.get_Body();
         objectArg=this["HtmlProvider@32"];
         (arg00=this.Body,function(arg10)
         {
          return objectArg.AppendAttribute(arg00,arg10);
         })(attr);
        }
       else
        {
         objectArg1=this["HtmlProvider@32"];
         (arg001=this.Body,function(arg10)
         {
          return objectArg1.AppendNode(arg001,arg10);
         })(pl.get_Body());
        }
       if(this.IsRendered)
        {
         return pl.Render();
        }
       else
        {
         r=this.RenderInternal;
         this.RenderInternal=function()
         {
          r(null);
          return pl.Render();
         };
        }
      },
      AppendN:function(node)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@32"];
       return(arg00=this.Body,function(arg10)
       {
        return objectArg.AppendNode(arg00,arg10);
       })(node);
      },
      OnLoad:function(f)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@32"];
       return(arg00=this.Body,function(arg10)
       {
        return objectArg.OnLoad(arg00,arg10);
       })(f);
      },
      Render:function()
      {
       if(!this.IsRendered)
        {
         this.RenderInternal.call(null,null);
         this.IsRendered=true;
        }
       else
        {
         return null;
        }
      },
      get_Body:function()
      {
       return this.Body;
      },
      get_Html:function()
      {
       return this["HtmlProvider@32"].GetHtml(this.Body);
      },
      get_HtmlProvider:function()
      {
       return this["HtmlProvider@32"];
      },
      get_Id:function()
      {
       var id,objectArg,arg00,newId,objectArg1,arg001;
       id=(objectArg=this["HtmlProvider@32"],(arg00=this.Body,function(arg10)
       {
        return objectArg.GetProperty(arg00,arg10);
       })("id"));
       if(id===undefined?true:id==="")
        {
         newId="id"+Math.round(Math.random()*100000000);
         objectArg1=this["HtmlProvider@32"];
         ((arg001=this.Body,function(arg10)
         {
          return function(arg20)
          {
           return objectArg1.SetProperty(arg001,arg10,arg20);
          };
         })("id"))(newId);
         return newId;
        }
       else
        {
         return id;
        }
      },
      get_Item:function(name)
      {
       var prop,objectArg,arg00,objectArg1,arg001;
       prop=(objectArg=this["HtmlProvider@32"],(arg00=this.Body,function(arg10)
       {
        return objectArg.GetAttribute(arg00,arg10);
       })(name));
       objectArg1=this["HtmlProvider@32"];
       return(arg001=this.Body,function(arg10)
       {
        return objectArg1.GetAttribute(arg001,arg10);
       })(name);
      },
      get_Text:function()
      {
       return this["HtmlProvider@32"].GetText(this.Body);
      },
      get_Value:function()
      {
       return this["HtmlProvider@32"].GetValue(this.Body);
      },
      set_Html:function(x)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@32"];
       return(arg00=this.Body,function(arg10)
       {
        return objectArg.SetHtml(arg00,arg10);
       })(x);
      },
      set_Item:function(name,value)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@32"];
       return((arg00=this.Body,function(arg10)
       {
        return function(arg20)
        {
         return objectArg.SetAttribute(arg00,arg10,arg20);
        };
       })(name))(value);
      },
      set_Text:function(x)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@32"];
       return(arg00=this.Body,function(arg10)
       {
        return objectArg.SetText(arg00,arg10);
       })(x);
      },
      set_Value:function(x)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@32"];
       return(arg00=this.Body,function(arg10)
       {
        return objectArg.SetValue(arg00,arg10);
       })(x);
      }
     },{
      New:function(html,name)
      {
       var el,dom;
       el=Element.New1(html);
       dom=document.createElement(name);
       el.RenderInternal=function(value)
       {
        value;
       };
       el.Body=dom;
       el.IsRendered=false;
       return el;
      },
      New1:function(HtmlProvider)
      {
       var r;
       r={};
       r["HtmlProvider@32"]=HtmlProvider;
       return Runtime.New(this,r);
      }
     }),
     Events:{
      JQueryEventSupport:Runtime.Class({
       OnBlur:function(f,el)
       {
        return jQuery(el.get_Body()).bind("blur",function()
        {
         return f(el);
        });
       },
       OnChange:function(f,el)
       {
        return jQuery(el.get_Body()).bind("change",function()
        {
         return f(el);
        });
       },
       OnClick:function(f,el)
       {
        var _this=this;
        return function(arg20)
        {
         return _this.OnMouse("click",f,arg20);
        }(el);
       },
       OnDoubleClick:function(f,el)
       {
        var _this=this;
        return function(arg20)
        {
         return _this.OnMouse("dblclick",f,arg20);
        }(el);
       },
       OnError:function(f,el)
       {
        return jQuery(el.get_Body()).bind("error",function()
        {
         return f(el);
        });
       },
       OnFocus:function(f,el)
       {
        return jQuery(el.get_Body()).bind("focus",function()
        {
         return f(el);
        });
       },
       OnKeyDown:function(f,el)
       {
        var h;
        h=function(ev)
        {
         return(f(el))({
          KeyCode:ev.keyCode
         });
        };
        return jQuery(el.get_Body()).bind("keydown",h);
       },
       OnKeyPress:function(f,el)
       {
        return jQuery(el.get_Body()).keypress(function(arg)
        {
         return(f(el))({
          CharacterCode:arg.which
         });
        });
       },
       OnKeyUp:function(f,el)
       {
        var h;
        h=function(ev)
        {
         return(f(el))({
          KeyCode:ev.keyCode
         });
        };
        return jQuery(el.get_Body()).bind("keyup",h);
       },
       OnLoad:function(f,el)
       {
        return jQuery(el.get_Body()).bind("load",function()
        {
         return f(el);
        });
       },
       OnMouse:function(name,f,el)
       {
        var h;
        h=function(ev)
        {
         return(f(el))({
          X:ev.pageX,
          Y:ev.pageY
         });
        };
        return jQuery(el.get_Body()).bind(name,h);
       },
       OnMouseDown:function(f,el)
       {
        var _this=this;
        return function(arg20)
        {
         return _this.OnMouse("mousedown",f,arg20);
        }(el);
       },
       OnMouseEnter:function(f,el)
       {
        var _this=this;
        return function(arg20)
        {
         return _this.OnMouse("mouseenter",f,arg20);
        }(el);
       },
       OnMouseLeave:function(f,el)
       {
        var _this=this;
        return function(arg20)
        {
         return _this.OnMouse("mouseleave",f,arg20);
        }(el);
       },
       OnMouseMove:function(f,el)
       {
        var _this=this;
        return function(arg20)
        {
         return _this.OnMouse("mousemove",f,arg20);
        }(el);
       },
       OnMouseOut:function(f,el)
       {
        var _this=this;
        return function(arg20)
        {
         return _this.OnMouse("mouseout",f,arg20);
        }(el);
       },
       OnMouseUp:function(f,el)
       {
        var _this=this;
        return function(arg20)
        {
         return _this.OnMouse("mouseup",f,arg20);
        }(el);
       },
       OnResize:function(f,el)
       {
        return jQuery(el.get_Body()).bind("resize",function()
        {
         return f(el);
        });
       },
       OnScroll:function(f,el)
       {
        return jQuery(el.get_Body()).bind("scroll",function()
        {
         return f(el);
        });
       },
       OnSelect:function(f,el)
       {
        return jQuery(el.get_Body()).bind("select",function()
        {
         return f(el);
        });
       },
       OnSubmit:function(f,el)
       {
        return jQuery(el.get_Body()).bind("submit",function()
        {
         return f(el);
        });
       },
       OnUnLoad:function(f,el)
       {
        return jQuery(el.get_Body()).bind("unload",function()
        {
         return f(el);
        });
       }
      },{
       New:function()
       {
        var r;
        r={};
        return Runtime.New(this,r);
       }
      })
     },
     EventsPervasives:{
      Events:Runtime.Field(function()
      {
       return JQueryEventSupport.New();
      })
     },
     Html5AttributeBuilder:Runtime.Class({
      NewAttr:function(name,value)
      {
       var a;
       a=Attribute.New(this.HtmlProvider,name,value);
       return a;
      }
     },{
      New:function(HtmlProvider)
      {
       var r;
       r={};
       r.HtmlProvider=HtmlProvider;
       return Runtime.New(this,r);
      }
     }),
     Html5TagBuilder:Runtime.Class({
      NewTag:function(name,children)
      {
       var el,enumerator,pl;
       el=Element.New(this.HtmlProvider,name);
       enumerator=Enumerator.Get(children);
       while(enumerator.MoveNext())
        {
         pl=enumerator.get_Current();
         el.AppendI(pl);
        }
       return el;
      }
     },{
      New:function(HtmlProvider)
      {
       var r;
       r={};
       r.HtmlProvider=HtmlProvider;
       return Runtime.New(this,r);
      }
     }),
     Implementation:{
      Attr:Runtime.Field(function()
      {
       return AttributeBuilder.New(Implementation.HtmlProvider());
      }),
      DeprecatedHtml:Runtime.Field(function()
      {
       return DeprecatedTagBuilder.New(Implementation.HtmlProvider());
      }),
      HTML5:{
       Attr:Runtime.Field(function()
       {
        return Html5AttributeBuilder.New(HTML5.Html5Provider());
       }),
       Html5Provider:Runtime.Field(function()
       {
        return JQueryHtmlProvider.New();
       }),
       Tags:Runtime.Field(function()
       {
        return Html5TagBuilder.New(HTML5.Html5Provider());
       })
      },
      HtmlProvider:Runtime.Field(function()
      {
       return JQueryHtmlProvider.New();
      }),
      JQueryHtmlProvider:Runtime.Class({
       AddClass:function(node,cls)
       {
        return jQuery(node).addClass(cls);
       },
       AppendAttribute:function(node,attr)
       {
        var name,value,_this=this;
        name=attr.nodeName;
        value=attr.nodeValue;
        return(function(arg10)
        {
         return function(arg20)
         {
          return _this.SetAttribute(node,arg10,arg20);
         };
        }(name))(value);
       },
       AppendNode:function(node,el)
       {
        return jQuery(node).append(jQuery(el));
       },
       Clear:function(node)
       {
        return jQuery(node).empty();
       },
       CreateAttribute:function(str)
       {
        return document.createAttribute(str);
       },
       CreateElement:function(name)
       {
        return document.createElement(name);
       },
       CreateTextNode:function(str)
       {
        return document.createTextNode(str);
       },
       GetAttribute:function(node,name)
       {
        var attr,clo1;
        attr=jQuery(node).attr(name);
        clo1=function(value)
        {
         return value;
        };
        return clo1(attr);
       },
       GetHtml:function(node)
       {
        return jQuery(node).html();
       },
       GetProperty:function(node,name)
       {
        var attr,clo1;
        attr=jQuery(node).attr(name);
        clo1=function(value)
        {
         return value;
        };
        return clo1(attr);
       },
       GetText:function(node)
       {
        return jQuery(node).text();
       },
       GetValue:function(node)
       {
        var clo1,arg10;
        clo1=function(value)
        {
         return value;
        };
        arg10=jQuery(node).val();
        return clo1(arg10);
       },
       HasAttribute:function(node,name)
       {
        return jQuery(node).attr(name)!=null;
       },
       OnDocumentReady:function(f)
       {
        return jQuery(document).ready(f);
       },
       OnLoad:function(node,f)
       {
        return jQuery(node).ready(f);
       },
       Remove:function(node)
       {
        return jQuery(node).remove();
       },
       RemoveAttribute:function(node,name)
       {
        return jQuery(node).removeAttr(name);
       },
       RemoveClass:function(node,cls)
       {
        return jQuery(node).removeClass(cls);
       },
       SetAttribute:function(node,name,value)
       {
        return jQuery(node).attr(name,value);
       },
       SetCss:function(node,name,prop)
       {
        return jQuery(node).css(name,prop);
       },
       SetHtml:function(node,text)
       {
        return jQuery(node).html(text);
       },
       SetProperty:function(node,name,value)
       {
        var attr,clo1;
        attr=jQuery(node).prop(name,value);
        clo1=function(value1)
        {
         return value1;
        };
        return clo1(attr);
       },
       SetStyle:function(node,style)
       {
        return jQuery(node).attr("style",style);
       },
       SetText:function(node,text)
       {
        return jQuery(node).text(text);
       },
       SetValue:function(node,value)
       {
        return jQuery(node).val(value);
       }
      },{
       New:function()
       {
        var r;
        r={};
        return Runtime.New(this,r);
       }
      }),
      Tags:Runtime.Field(function()
      {
       return TagBuilder.New(Implementation.HtmlProvider());
      })
     },
     Operators:{
      OnAfterRender:function(f,w)
      {
       var r;
       r=w.Render;
       w.Render=function()
       {
        r.apply(w);
        return f(w);
       };
      },
      OnBeforeRender:function(f,w)
      {
       var r;
       r=w.Render;
       w.Render=function()
       {
        f(w);
        return r.apply(w);
       };
      },
      add:function(el,inner)
      {
       var enumerator,pl;
       enumerator=Enumerator.Get(inner);
       while(enumerator.MoveNext())
        {
         pl=enumerator.get_Current();
         el.AppendI(pl);
        }
       return el;
      }
     },
     TagBuilder:Runtime.Class({
      Div:function(x)
      {
       return this.NewTag("div",x);
      },
      NewTag:function(name,children)
      {
       var el,enumerator,pl;
       el=Element.New(this.HtmlProvider,name);
       enumerator=Enumerator.Get(children);
       while(enumerator.MoveNext())
        {
         pl=enumerator.get_Current();
         el.AppendI(pl);
        }
       return el;
      },
      text:function(data)
      {
       return Runtime.New(Text,{
        text:data
       });
      }
     },{
      New:function(HtmlProvider)
      {
       var r;
       r={};
       r.HtmlProvider=HtmlProvider;
       return Runtime.New(this,r);
      }
     }),
     Text:Runtime.Class({
      Render:function()
      {
       return null;
      },
      get_Body:function()
      {
       return document.createTextNode(this.text);
      }
     })
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  WebSharper=Runtime.Safe(Global.IntelliFactory.WebSharper);
  Html=Runtime.Safe(WebSharper.Html);
  Default=Runtime.Safe(Html.Default);
  document=Runtime.Safe(Global.document);
  Json=Runtime.Safe(WebSharper.Json);
  JSON=Runtime.Safe(Global.JSON);
  JavaScript=Runtime.Safe(WebSharper.JavaScript);
  Arrays=Runtime.Safe(WebSharper.Arrays);
  Attribute=Runtime.Safe(Html.Attribute);
  Implementation=Runtime.Safe(Html.Implementation);
  HTML5=Runtime.Safe(Implementation.HTML5);
  Element=Runtime.Safe(Html.Element);
  Enumerator=Runtime.Safe(WebSharper.Enumerator);
  Math=Runtime.Safe(Global.Math);
  jQuery=Runtime.Safe(Global.jQuery);
  Events=Runtime.Safe(Html.Events);
  JQueryEventSupport=Runtime.Safe(Events.JQueryEventSupport);
  AttributeBuilder=Runtime.Safe(Html.AttributeBuilder);
  DeprecatedTagBuilder=Runtime.Safe(Html.DeprecatedTagBuilder);
  Html5AttributeBuilder=Runtime.Safe(Html.Html5AttributeBuilder);
  JQueryHtmlProvider=Runtime.Safe(Implementation.JQueryHtmlProvider);
  Html5TagBuilder=Runtime.Safe(Html.Html5TagBuilder);
  TagBuilder=Runtime.Safe(Html.TagBuilder);
  Text=Runtime.Safe(Html.Text);
  Activator=Runtime.Safe(Html.Activator);
  HTML51=Runtime.Safe(Default.HTML5);
  return EventsPervasives=Runtime.Safe(Html.EventsPervasives);
 });
 Runtime.OnLoad(function()
 {
  Implementation.Tags();
  Implementation.HtmlProvider();
  HTML5.Tags();
  HTML5.Html5Provider();
  HTML5.Attr();
  Implementation.DeprecatedHtml();
  Implementation.Attr();
  EventsPervasives.Events();
  Default.Tags();
  HTML51.Tags();
  HTML51.Attr();
  Default.Deprecated();
  Default.Attr();
  Activator.Activate();
 });
}());
