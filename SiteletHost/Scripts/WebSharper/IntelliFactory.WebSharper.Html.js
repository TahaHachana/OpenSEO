(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,WebSharper,Html,Activator,document,Default,JavaScript,Json,JSON,Arrays,Attribute,Implementation,HTML5,Element,Enumerator,Math,jQuery,Events,JQueryEventSupport,AttributeBuilder,DeprecatedTagBuilder,Html5AttributeBuilder,JQueryHtmlProvider,Html5TagBuilder,TagBuilder,Text,HTML51,EventsPervasives;
 Runtime.Define(Global,{
  IntelliFactory:{
   WebSharper:{
    Html:{
     Activator:{
      Activate:Runtime.Field(function()
      {
       var meta;
       if(Activator.hasDocument())
        {
         meta=document.getElementById("websharper-data");
         return meta?Default.OnLoad(function()
         {
          var array;
          array=JavaScript.GetFields(Json.Activate(JSON.parse(meta.getAttribute("content"))));
          return Arrays.iter(Runtime.Tupled(function(tupledArg)
          {
           var k,p,old;
           k=tupledArg[0];
           p=tupledArg[1].get_Body();
           old=document.getElementById(k);
           old.parentNode.replaceChild(p.get_Body(),old);
           return p.Render();
          }),array);
         }):null;
        }
       else
        {
         return null;
        }
      }),
      hasDocument:function()
      {
       var $0=this,$this=this;
       return typeof Global.document!=="undefined";
      }
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
       r=Runtime.New(this,{});
       r.HtmlProvider=HtmlProvider;
       return r;
      }
     }),
     AttributeBuilder:Runtime.Class({
      Class:function(x)
      {
       return this.NewAttr("class",x);
      },
      NewAttr:function(name,value)
      {
       return Attribute.New(this.HtmlProvider,name,value);
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
       r=Runtime.New(this,{});
       r.HtmlProvider=HtmlProvider;
       return r;
      }
     }),
     Default:{
      A:function(x)
      {
       return Default.Tags().NewTag("a",x);
      },
      Action:function(x)
      {
       return Default.Attr().NewAttr("action",x);
      },
      Align:function(x)
      {
       return Default.Attr().NewAttr("align",x);
      },
      Alt:function(x)
      {
       return Default.Attr().NewAttr("alt",x);
      },
      Attr:Runtime.Field(function()
      {
       return Implementation.Attr();
      }),
      B:function(x)
      {
       return Default.Tags().NewTag("b",x);
      },
      Body:function(x)
      {
       return Default.Tags().NewTag("body",x);
      },
      Br:function(x)
      {
       return Default.Tags().NewTag("br",x);
      },
      Button:function(x)
      {
       return Default.Tags().NewTag("button",x);
      },
      Code:function(x)
      {
       return Default.Tags().NewTag("code",x);
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
       return Default.Tags().NewTag("em",x);
      },
      Form:function(x)
      {
       return Default.Tags().NewTag("form",x);
      },
      H1:function(x)
      {
       return Default.Tags().NewTag("h1",x);
      },
      H2:function(x)
      {
       return Default.Tags().NewTag("h2",x);
      },
      H3:function(x)
      {
       return Default.Tags().NewTag("h3",x);
      },
      H4:function(x)
      {
       return Default.Tags().NewTag("h4",x);
      },
      HRef:function(x)
      {
       return Default.Attr().NewAttr("href",x);
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
       return Default.Tags().NewTag("head",x);
      },
      Height:function(x)
      {
       return Default.Attr().NewAttr("height",x);
      },
      Hr:function(x)
      {
       return Default.Tags().NewTag("hr",x);
      },
      I:function(x)
      {
       return Default.Tags().NewTag("i",x);
      },
      IFrame:function(x)
      {
       return Default.Tags().NewTag("iframe",x);
      },
      Id:function(x)
      {
       return Default.Attr().NewAttr("id",x);
      },
      Img:function(x)
      {
       return Default.Tags().NewTag("img",x);
      },
      Input:function(x)
      {
       return Default.Tags().NewTag("input",x);
      },
      LI:function(x)
      {
       return Default.Tags().NewTag("li",x);
      },
      Name:function(x)
      {
       return Default.Attr().NewAttr("name",x);
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
       return Default.Tags().NewTag("ol",x);
      },
      OnLoad:function(init)
      {
       return Implementation.HtmlProvider().OnDocumentReady(init);
      },
      P:function(x)
      {
       return Default.Tags().NewTag("p",x);
      },
      Pre:function(x)
      {
       return Default.Tags().NewTag("pre",x);
      },
      RowSpan:function(x)
      {
       return Default.Attr().NewAttr("rowspan",x);
      },
      Script:function(x)
      {
       return Default.Tags().NewTag("script",x);
      },
      Select:function(x)
      {
       return Default.Tags().NewTag("select",x);
      },
      Selected:function(x)
      {
       return Default.Attr().NewAttr("selected",x);
      },
      Span:function(x)
      {
       return Default.Tags().NewTag("span",x);
      },
      Src:function(x)
      {
       return Default.Attr().NewAttr("src",x);
      },
      TBody:function(x)
      {
       return Default.Tags().NewTag("tbody",x);
      },
      TD:function(x)
      {
       return Default.Tags().NewTag("td",x);
      },
      TFoot:function(x)
      {
       return Default.Tags().NewTag("tfoot",x);
      },
      TH:function(x)
      {
       return Default.Tags().NewTag("th",x);
      },
      THead:function(x)
      {
       return Default.Tags().NewTag("thead",x);
      },
      TR:function(x)
      {
       return Default.Tags().NewTag("tr",x);
      },
      Table:function(x)
      {
       return Default.Tags().NewTag("table",x);
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
       return Default.Tags().NewTag("textarea",x);
      },
      UL:function(x)
      {
       return Default.Tags().NewTag("ul",x);
      },
      VAlign:function(x)
      {
       return Default.Attr().NewAttr("valign",x);
      },
      Width:function(x)
      {
       return Default.Attr().NewAttr("width",x);
      }
     },
     DeprecatedAttributeBuilder:Runtime.Class({
      NewAttr:function(name,value)
      {
       return Attribute.New(this.HtmlProvider,name,value);
      }
     },{
      New:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,{});
       r.HtmlProvider=HtmlProvider;
       return r;
      }
     }),
     DeprecatedTagBuilder:Runtime.Class({
      NewTag:function(name,children)
      {
       var el,enumerator;
       el=Element.New(this.HtmlProvider,name);
       enumerator=Enumerator.Get(children);
       while(enumerator.MoveNext())
        {
         el.AppendI(enumerator.get_Current());
        }
       return el;
      }
     },{
      New:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,{});
       r.HtmlProvider=HtmlProvider;
       return r;
      }
     }),
     Element:Runtime.Class({
      AppendI:function(pl)
      {
       var body,r;
       body=pl.get_Body();
       if(body.nodeType===2)
        {
         this["HtmlProvider@32"].AppendAttribute(this.Body,body);
        }
       else
        {
         this["HtmlProvider@32"].AppendNode(this.Body,pl.get_Body());
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
         return;
        }
      },
      AppendN:function(node)
      {
       return this["HtmlProvider@32"].AppendNode(this.Body,node);
      },
      OnLoad:function(f)
      {
       return this["HtmlProvider@32"].OnLoad(this.Body,f);
      },
      Render:function()
      {
       if(!this.IsRendered)
        {
         this.RenderInternal.call(null,null);
         this.IsRendered=true;
         return;
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
       var id,newId;
       id=this["HtmlProvider@32"].GetProperty(this.Body,"id");
       if(id===undefined?true:id==="")
        {
         newId="id"+Math.round(Math.random()*100000000);
         this["HtmlProvider@32"].SetProperty(this.Body,"id",newId);
         return newId;
        }
       else
        {
         return id;
        }
      },
      get_Item:function(name)
      {
       this["HtmlProvider@32"].GetAttribute(this.Body,name);
       return this["HtmlProvider@32"].GetAttribute(this.Body,name);
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
       return this["HtmlProvider@32"].SetHtml(this.Body,x);
      },
      set_Item:function(name,value)
      {
       return this["HtmlProvider@32"].SetAttribute(this.Body,name,value);
      },
      set_Text:function(x)
      {
       return this["HtmlProvider@32"].SetText(this.Body,x);
      },
      set_Value:function(x)
      {
       return this["HtmlProvider@32"].SetValue(this.Body,x);
      }
     },{
      New:function(html,name)
      {
       var el,dom;
       el=Element.New1(html);
       dom=document.createElement(name);
       el.RenderInternal=function()
       {
       };
       el.Body=dom;
       el.IsRendered=false;
       return el;
      },
      New1:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,{});
       r["HtmlProvider@32"]=HtmlProvider;
       return r;
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
        return this.OnMouse("click",f,el);
       },
       OnDoubleClick:function(f,el)
       {
        return this.OnMouse("dblclick",f,el);
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
        return this.OnMouse("mousedown",f,el);
       },
       OnMouseEnter:function(f,el)
       {
        return this.OnMouse("mouseenter",f,el);
       },
       OnMouseLeave:function(f,el)
       {
        return this.OnMouse("mouseleave",f,el);
       },
       OnMouseMove:function(f,el)
       {
        return this.OnMouse("mousemove",f,el);
       },
       OnMouseOut:function(f,el)
       {
        return this.OnMouse("mouseout",f,el);
       },
       OnMouseUp:function(f,el)
       {
        return this.OnMouse("mouseup",f,el);
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
        return Runtime.New(this,{});
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
       return Attribute.New(this.HtmlProvider,name,value);
      }
     },{
      New:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,{});
       r.HtmlProvider=HtmlProvider;
       return r;
      }
     }),
     Html5TagBuilder:Runtime.Class({
      NewTag:function(name,children)
      {
       var el,enumerator;
       el=Element.New(this.HtmlProvider,name);
       enumerator=Enumerator.Get(children);
       while(enumerator.MoveNext())
        {
         el.AppendI(enumerator.get_Current());
        }
       return el;
      }
     },{
      New:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,{});
       r.HtmlProvider=HtmlProvider;
       return r;
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
        return this.SetAttribute(node,attr.nodeName,attr.nodeValue);
       },
       AppendNode:function(node,el)
       {
        return jQuery(node).append(jQuery(el));
       },
       Clear:function(node)
       {
        return jQuery(node).contents().detach();
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
        return jQuery(node).attr(name);
       },
       GetHtml:function(node)
       {
        return jQuery(node).html();
       },
       GetProperty:function(node,name)
       {
        return jQuery(node).attr(name);
       },
       GetText:function(node)
       {
        return node.textContent;
       },
       GetValue:function(node)
       {
        return jQuery(node).val();
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
        return jQuery(node).prop(name,value);
       },
       SetStyle:function(node,style)
       {
        return jQuery(node).attr("style",style);
       },
       SetText:function(node,text)
       {
        node.textContent=text;
       },
       SetValue:function(node,value)
       {
        return jQuery(node).val(value);
       }
      },{
       New:function()
       {
        return Runtime.New(this,{});
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
       return;
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
       return;
      },
      add:function(el,inner)
      {
       var enumerator;
       enumerator=Enumerator.Get(inner);
       while(enumerator.MoveNext())
        {
         el.AppendI(enumerator.get_Current());
        }
       return el;
      }
     },
     PageletExtensions:{
      "IPagelet.AppendTo":function(p,targetId)
      {
       document.getElementById(targetId).appendChild(p.get_Body());
       return p.Render();
      }
     },
     TagBuilder:Runtime.Class({
      Div:function(x)
      {
       return this.NewTag("div",x);
      },
      NewTag:function(name,children)
      {
       var el,enumerator;
       el=Element.New(this.HtmlProvider,name);
       enumerator=Enumerator.Get(children);
       while(enumerator.MoveNext())
        {
         el.AppendI(enumerator.get_Current());
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
       r=Runtime.New(this,{});
       r.HtmlProvider=HtmlProvider;
       return r;
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
  Activator=Runtime.Safe(Html.Activator);
  document=Runtime.Safe(Global.document);
  Default=Runtime.Safe(Html.Default);
  JavaScript=Runtime.Safe(WebSharper.JavaScript);
  Json=Runtime.Safe(WebSharper.Json);
  JSON=Runtime.Safe(Global.JSON);
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
  return;
 });
}());
