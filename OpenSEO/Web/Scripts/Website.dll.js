(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,OpenSEO,DBCleanup,Client,WebSharper,Html,Default,List,Remoting,alert,Concurrency,EventsPervasives,T,Operators,HTML5,Details,Client1,Seq,Utilities,Client2,jQuery,Keywords,Client3,Arrays,LatestReports,Client4,Links,Client5,String,Number,kendo,Formlet,Controls,Enhance,Data,Formlet1,window,Login,Client6,UrlForm,Client7,Violations,Client8,Strings;
 Runtime.Define(Global,{
  OpenSEO:{
   DBCleanup:{
    ButtonControl:Runtime.Class({
     get_Body:function()
     {
      return Client.cleanDbBtn();
     }
    }),
    Client:{
     cleanDbBtn:function()
     {
      var x,f,x1;
      x=Default.Button(List.ofArray([Default.Attr().Class("btn btn-primary"),Default.Text("Clean Database")]));
      f=(x1=function(x2)
      {
       return function()
       {
        var x3,f1,f3;
        x3=(f1=function()
        {
         var objectArg,arg00,x4,f2;
         objectArg=x2["HtmlProvider@32"];
         (arg00=x2.Body,function(arg10)
         {
          return objectArg.AddClass(arg00,arg10);
         })("disabled");
         x4=Remoting.Async("Website:6",[]);
         f2=function()
         {
          var objectArg1,arg001;
          objectArg1=x2["HtmlProvider@32"];
          (arg001=x2.Body,function(arg10)
          {
           return objectArg1.RemoveClass(arg001,arg10);
          })("disabled");
          alert("Done");
          return Concurrency.Return(null);
         };
         return Concurrency.Bind(x4,f2);
        },Concurrency.Delay(f1));
        f3=function(arg00)
        {
         var t;
         t={
          $:0
         };
         return Concurrency.Start(arg00);
        };
        return f3(x3);
       };
      },function(arg10)
      {
       return EventsPervasives.Events().OnClick(x1,arg10);
      });
      f(x);
      return x;
     }
    }
   },
   Details:{
    Client:{
     detailsSection:function(id)
     {
      var tabsDiv,x,_this,x1,f,f1;
      tabsDiv=Default.Div(Runtime.New(T,{
       $:0
      }));
      x=Operators.add((_this=HTML5.Tags(),(x1=List.ofArray([Default.Attr().Class("tab-pane fade active in reportSection"),Default.Id("details")]),_this.NewTag("section",x1))),List.ofArray([Client1.makeDiv("URL","url"),Default.Hr(Runtime.New(T,{
       $:0
      })),Client1.makeDiv("Size","size"),Default.Hr(Runtime.New(T,{
       $:0
      })),Client1.makeDiv("Server","server"),Default.Hr(Runtime.New(T,{
       $:0
      })),Client1.makeDiv("Elapsed Time","elapsedTime"),Default.Hr(Runtime.New(T,{
       $:0
      })),Client1.makeDiv("Title","title"),Client1.makeDiv("Length","titleLength"),Default.Hr(Runtime.New(T,{
       $:0
      })),Client1.makeDiv("Description","description"),Client1.makeDiv("Length","descriptionLength"),Default.Hr(Runtime.New(T,{
       $:0
      })),Operators.add(Default.Div(List.ofArray([Default.Attr().Class("row-fluid")])),List.ofArray([Operators.add(Default.Div(List.ofArray([Default.Attr().Class("span3")])),List.ofArray([Operators.add(Default.H4(List.ofArray([Default.Attr().Class("h4")])),List.ofArray([Default.Text("Headings")]))])),Operators.add(Default.Div(List.ofArray([Default.Attr().Class("span9")])),List.ofArray([tabsDiv]))]))]));
      f=(f1=function()
      {
       var x2,f2,f8;
       x2=(f2=function()
       {
        var x3,f3;
        x3=Remoting.Async("Website:5",[id]);
        f3=function(_arg11)
        {
         var details,x4,f4,action,a,matchValue,headings,tabs,b,f6,f7;
         if(_arg11.$==1)
          {
           details=_arg11.$0;
           x4=List.ofArray([["#url",details.RequestUri],["#size",details.Size],["#server",details.Server],["#elapsedTime",details.ElapsedTime],["#title",details.Title],["#titleLength",details.TitleLength],["#description",details.Description],["#descriptionLength",details.DescriptionLength]]);
           f4=(action=Runtime.Tupled(function(x5)
           {
            var arg1,arg2,f5;
            arg1=x5[0];
            arg2=x5[1];
            f5=function(selector)
            {
             return function(txt)
             {
              return Client1.setPText(selector,txt);
             };
            };
            return(f5(arg1))(arg2);
           }),function(list)
           {
            return Seq.iter(action,list);
           });
           f4(x4);
           a=(matchValue=details.Headings,matchValue.$==1?(headings=matchValue.$0,(tabs=Client2.makeTabsDiv(headings),(tabsDiv.AppendI(tabs),Concurrency.Return(null)))):(null,Concurrency.Return(null)));
           b=(f6=function()
           {
            Client2.updateProgressBar();
            return Concurrency.Return(null);
           },Concurrency.Delay(f6));
           f7=function()
           {
            return b;
           };
           return Concurrency.Bind(a,f7);
          }
         else
          {
           return Concurrency.Return(null);
          }
        };
        return Concurrency.Bind(x3,f3);
       },Concurrency.Delay(f2));
       f8=function(arg00)
       {
        var t;
        t={
         $:0
        };
        return Concurrency.Start(arg00);
       };
       return f8(x2);
      },function(w)
      {
       return Operators.OnAfterRender(f1,w);
      });
      f(x);
      return x;
     },
     makeDiv:function(txt,id)
     {
      return Operators.add(Default.Div(List.ofArray([Default.Attr().Class("row-fluid")])),List.ofArray([Operators.add(Default.Div(List.ofArray([Default.Attr().Class("span3")])),List.ofArray([Operators.add(Default.H4(List.ofArray([Default.Attr().Class("h4")])),List.ofArray([Default.Text(txt)]))])),Operators.add(Default.Div(List.ofArray([Default.Attr().Class("span9")])),List.ofArray([Default.P(List.ofArray([Default.Id(id)]))]))]));
     },
     setPText:function(selector,txt)
     {
      return jQuery(selector).text(txt);
     }
    },
    DetailsControl:Runtime.Class({
     get_Body:function()
     {
      return Client1.detailsSection(this.id);
     }
    })
   },
   Keywords:{
    Client:{
     appendTd:function(text,tableRow)
     {
      return jQuery("<td/>").text(text).appendTo(tableRow);
     },
     displayKeywords:function(keywords,selector)
     {
      var x,f,mapping,f1,action;
      x=(f=(mapping=Runtime.Tupled(function(tupledArg)
      {
       var x1,y,z;
       x1=tupledArg[0];
       y=tupledArg[1];
       z=tupledArg[2];
       return Client3.tableRow(x1,y,z);
      }),function(array)
      {
       return Arrays.map(mapping,array);
      }),f(keywords));
      f1=(action=function(x1)
      {
       return x1.appendTo(jQuery(selector));
      },function(array)
      {
       return Arrays.iter(action,array);
      });
      return f1(x);
     },
     keywordsSection:function(id)
     {
      var x,_this,x1,_this1,arg00,_this2,arg001,_this3,arg002,f,f1;
      x=Operators.add((_this=HTML5.Tags(),(x1=List.ofArray([Default.Attr().Class("tab-pane fade in reportSection"),Default.Id("keywords")]),_this.NewTag("section",x1))),List.ofArray([Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tabbable")])),List.ofArray([Operators.add(Default.UL(List.ofArray([Default.Attr().Class("nav nav-pills")])),List.ofArray([Operators.add(Default.LI(List.ofArray([Default.Attr().Class("active")])),List.ofArray([Operators.add(Default.A(List.ofArray([Default.HRef("#keywords1"),(_this1=HTML5.Attr(),(arg00="data-"+"toggle",_this1.NewAttr(arg00,"tab")))])),List.ofArray([Default.Text("1 Keyword")]))])),Default.LI(List.ofArray([Operators.add(Default.A(List.ofArray([Default.HRef("#keywords2"),(_this2=HTML5.Attr(),(arg001="data-"+"toggle",_this2.NewAttr(arg001,"tab")))])),List.ofArray([Default.Text("2 Keywords")]))])),Default.LI(List.ofArray([Operators.add(Default.A(List.ofArray([Default.HRef("#keywords3"),(_this3=HTML5.Attr(),(arg002="data-"+"toggle",_this3.NewAttr(arg002,"tab")))])),List.ofArray([Default.Text("3 Keywords")]))]))])),Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tab-content")])),List.ofArray([Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tab-pane active fade in span8"),Default.Id("keywords1")])),List.ofArray([Client3.makeTable("table1")])),Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tab-pane fade span8"),Default.Id("keywords2")])),List.ofArray([Client3.makeTable("table2")])),Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tab-pane fade span8"),Default.Id("keywords3")])),List.ofArray([Client3.makeTable("table3")]))]))]))]));
      f=(f1=function()
      {
       var x2,f2,f6;
       x2=(f2=function()
       {
        var x3,f3;
        x3=Remoting.Async("Website:4",[id]);
        f3=function(_arg11)
        {
         var a,keywords,b,f4,f5;
         a=_arg11.$==1?(keywords=_arg11.$0,(Client3.displayKeywords(keywords.get_Item(0),"#table1"),(Client3.displayKeywords(keywords.get_Item(1),"#table2"),(Client3.displayKeywords(keywords.get_Item(2),"#table3"),Concurrency.Return(null))))):(null,Concurrency.Return(null));
         b=(f4=function()
         {
          Client2.updateProgressBar();
          return Concurrency.Return(null);
         },Concurrency.Delay(f4));
         f5=function()
         {
          return b;
         };
         return Concurrency.Bind(a,f5);
        };
        return Concurrency.Bind(x3,f3);
       },Concurrency.Delay(f2));
       f6=function(arg003)
       {
        var t;
        t={
         $:0
        };
        return Concurrency.Start(arg003);
       };
       return f6(x2);
      },function(w)
      {
       return Operators.OnAfterRender(f1,w);
      });
      f(x);
      return x;
     },
     makeTable:function(id)
     {
      return Operators.add(Default.Table(List.ofArray([Default.Id(id),Default.Attr().Class("table table-bordered table-striped span10")])),List.ofArray([Default.TR(List.ofArray([Client3.makeTh(id),Default.TH(List.ofArray([Default.Text("Occurrence")])),Default.TH(List.ofArray([Default.Text("Density %")]))]))]));
     },
     makeTh:function(id)
     {
      if(id==="table1")
       {
        return Default.TH(List.ofArray([Default.Text("Keyword")]));
       }
      else
       {
        return Default.TH(List.ofArray([Default.Text("Keywords Combination")]));
       }
     },
     tableRow:function(keyword,occurrence,density)
     {
      var tr;
      tr=jQuery("<tr/>");
      Client3.appendTd(keyword,tr);
      Client3.appendTd(occurrence,tr);
      Client3.appendTd(density,tr);
      return tr;
     }
    },
    KeywordsControl:Runtime.Class({
     get_Body:function()
     {
      return Client3.keywordsSection(this.id);
     }
    })
   },
   LatestReports:{
    Client:{
     latestReportsList:function()
     {
      var x,f,f1;
      x=Default.UL(List.ofArray([Default.Attr().Class("unstyled")]));
      f=(f1=function(x1)
      {
       var x2,f2,f6;
       x2=(f2=function()
       {
        var x3,f3;
        x3=Remoting.Async("Website:7",[]);
        f3=function(_arg1)
        {
         var arr,x4,f4,f5,action;
         if(_arg1.$==1)
          {
           arr=_arg1.$0;
           x4=(f4=function(array)
           {
            return Arrays.map(function(url)
            {
             return Client4.makeLi(url);
            },array);
           },f4(arr));
           f5=(action=function(arg00)
           {
            return x1.AppendI(arg00);
           },function(array)
           {
            return Arrays.iter(action,array);
           });
           f5(x4);
           return Concurrency.Return(null);
          }
         else
          {
           return Concurrency.Return(null);
          }
        };
        return Concurrency.Bind(x3,f3);
       },Concurrency.Delay(f2));
       f6=function(arg00)
       {
        var t;
        t={
         $:0
        };
        return Concurrency.Start(arg00);
       };
       return f6(x2);
      },function(w)
      {
       return Operators.OnAfterRender(f1,w);
      });
      f(x);
      return x;
     },
     makeLi:function(url)
     {
      var _this;
      return Default.LI(List.ofArray([Operators.add(Default.A(List.ofArray([Default.HRef(url),(_this=Default.Attr(),_this.NewAttr("target","_blank"))])),List.ofArray([Default.Text(url)]))]));
     }
    },
    LatestReportsControl:Runtime.Class({
     get_Body:function()
     {
      return Client4.latestReportsList();
     }
    })
   },
   Links:{
    Client:{
     appendTd:function(text,tableRow)
     {
      return jQuery("<td/>").text(text).appendTo(tableRow);
     },
     "appendTd'":function(text,tableRow)
     {
      var aTag,_this;
      aTag=Operators.add(Default.A(List.ofArray([Default.HRef(text),(_this=Default.Attr(),_this.NewAttr("target","_blank"))])),List.ofArray([Default.Text(text)]));
      return jQuery("<td/>").append(aTag.Body).appendTo(tableRow);
     },
     displayLinks:function(links,selector)
     {
      var x,f,mapping,f1,action;
      x=(f=(mapping=Runtime.Tupled(function(tupledArg)
      {
       var x1,y,z;
       x1=tupledArg[0];
       y=tupledArg[1];
       z=tupledArg[2];
       return Client5.tableRow(x1,y,z);
      }),function(array)
      {
       return Arrays.map(mapping,array);
      }),f(links));
      f1=(action=function(x1)
      {
       return x1.appendTo(jQuery(selector));
      },function(array)
      {
       return Arrays.iter(action,array);
      });
      return f1(x);
     },
     linksSection:function(id)
     {
      var div,_div_,x,_this,x1,_this1,arg00,_this2,arg001,_this3,arg002,f,f1;
      div=Default.Div(List.ofArray([Client5.makeDiv("Internal Links","internalLinksCount"),Client5.makeDiv("External Links","externalLinksCount")]));
      _div_=Default.Div(List.ofArray([Client5.makeDiv("Follow Links","followLinksCount"),Client5.makeDiv("Nofollow Links","nofollowLinksCount")]));
      x=Operators.add((_this=HTML5.Tags(),(x1=List.ofArray([Default.Attr().Class("tab-pane fade in reportSection"),Default.Id("links")]),_this.NewTag("section",x1))),List.ofArray([Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tabbable")])),List.ofArray([Operators.add(Default.UL(List.ofArray([Default.Attr().Class("nav nav-pills")])),List.ofArray([Operators.add(Default.LI(List.ofArray([Default.Attr().Class("active")])),List.ofArray([Operators.add(Default.A(List.ofArray([Default.HRef("#links1"),(_this1=HTML5.Attr(),(arg00="data-"+"toggle",_this1.NewAttr(arg00,"tab")))])),List.ofArray([Default.Text("Internal")]))])),Default.LI(List.ofArray([Operators.add(Default.A(List.ofArray([Default.HRef("#links2"),(_this2=HTML5.Attr(),(arg001="data-"+"toggle",_this2.NewAttr(arg001,"tab")))])),List.ofArray([Default.Text("External")]))])),Default.LI(List.ofArray([Operators.add(Default.A(List.ofArray([Default.HRef("#linksStats"),(_this3=HTML5.Attr(),(arg002="data-"+"toggle",_this3.NewAttr(arg002,"tab")))])),List.ofArray([Default.Text("Stats")]))]))])),Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tab-content")])),List.ofArray([Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tab-pane active fade in span8"),Default.Id("links1")])),List.ofArray([Client5.makeTable("linksTable1")])),Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tab-pane fade span8"),Default.Id("links2")])),List.ofArray([Client5.makeTable("linksTable2")])),Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tab-pane fade span8"),Default.Id("linksStats")])),List.ofArray([div,Default.Hr(Runtime.New(T,{
       $:0
      })),_div_]))]))]))]));
      f=(f1=function()
      {
       var x2,f2,f6;
       x2=(f2=function()
       {
        var x3,f3;
        x3=Remoting.Async("Website:3",[id]);
        f3=function(_arg11)
        {
         var a,links,txt,txt1,txt2,txt3,pie,_pie_,b,f4,f5;
         a=_arg11.$==1?(links=_arg11.$0,(Client5.displayLinks(links.InternalLinks,"#linksTable1"),(Client5.displayLinks(links.ExternalLinks,"#linksTable2"),(txt=String(links.InternalCount),Client5.setPText("#internalLinksCount",txt),(txt1=String(links.ExternalCount),Client5.setPText("#externalLinksCount",txt1),(txt2=String(links.FollowCount),Client5.setPText("#followLinksCount",txt2),(txt3=String(links.NofollowCount),Client5.setPText("#nofollowLinksCount",txt3),(pie=Client5.pieChart("Internal vs. External","Internal","External",Number(links.InternalPercent),Number(links.ExternalPercent)),(_pie_=Client5.pieChart("Follow vs. NoFollow","Follow","NoFollow",Number(links.FollowPercent),Number(links.NofollowPercent)),(div.AppendI(pie),(_div_.AppendI(_pie_),Concurrency.Return(null)))))))))))):(null,Concurrency.Return(null));
         b=(f4=function()
         {
          Client2.updateProgressBar();
          return Concurrency.Return(null);
         },Concurrency.Delay(f4));
         f5=function()
         {
          return b;
         };
         return Concurrency.Bind(a,f5);
        };
        return Concurrency.Bind(x3,f3);
       },Concurrency.Delay(f2));
       f6=function(arg003)
       {
        var t;
        t={
         $:0
        };
        return Concurrency.Start(arg003);
       };
       return f6(x2);
      },function(w)
      {
       return Operators.OnAfterRender(f1,w);
      });
      f(x);
      return x;
     },
     makeDiv:function(txt,id)
     {
      return Operators.add(Default.Div(List.ofArray([Default.Attr().Class("row-fluid")])),List.ofArray([Operators.add(Default.Div(List.ofArray([Default.Attr().Class("span3")])),List.ofArray([Operators.add(Default.H4(List.ofArray([Default.Attr().Class("h4")])),List.ofArray([Default.Text(txt)]))])),Operators.add(Default.Div(List.ofArray([Default.Attr().Class("span2")])),List.ofArray([Default.P(List.ofArray([Default.Id(id)]))]))]));
     },
     makeTable:function(id)
     {
      return Operators.add(Default.Table(List.ofArray([Default.Id(id),Default.Attr().Class("table table-bordered table-striped span10")])),List.ofArray([Default.TR(List.ofArray([Default.TH(List.ofArray([Default.Text("URL")])),Default.TH(List.ofArray([Default.Text("Anchor")])),Default.TH(List.ofArray([Default.Text("Rel")]))]))]));
     },
     pieChart:function(title,category,_category_,x,y)
     {
      var x1,f,f1;
      x1=Default.Div(Runtime.New(T,{
       $:0
      }));
      f=(f1=function(el)
      {
       var x2,returnVal,returnVal1,returnVal2,returnVal3,returnVal4,returnVal5,returnVal6,returnVal7,returnVal8,f2;
       x2=new kendo.ui.Chart(el.Body,(returnVal=[{}],(null,returnVal[0].title=(returnVal1=[{}],(null,returnVal1[0].text=title,returnVal1[0])),returnVal[0].legend=(returnVal2=[{}],(null,returnVal2[0].position="bottom",returnVal2[0])),returnVal[0].seriesDefaults=(returnVal3=[{}],(null,returnVal3[0].labels=(returnVal4=[{}],(null,returnVal4[0].visible=true,returnVal4[0].format="{0}%",returnVal4[0])),returnVal3[0])),returnVal[0].series=[(returnVal5=[{}],(null,returnVal5[0].type="pie",returnVal5[0].data=[(returnVal6=[{}],(null,returnVal6[0].category=category,returnVal6[0].value=x,returnVal6[0])),(returnVal7=[{}],(null,returnVal7[0].category=_category_,returnVal7[0].value=y,returnVal7[0]))],returnVal5[0]))],returnVal[0].tooltip=(returnVal8=[{}],(null,returnVal8[0].visible=true,returnVal8[0].format="{0}%",returnVal8[0])),returnVal[0].seriesClick=function(args)
       {
        var msg;
        msg=args.category+" : "+Global.String(args.value);
        return alert(Global.String(args.value));
       },returnVal[0])));
       f2=function(value)
       {
        value;
       };
       return f2(x2);
      },function(w)
      {
       return Operators.OnAfterRender(f1,w);
      });
      f(x1);
      return x1;
     },
     setPText:function(selector,txt)
     {
      return jQuery(selector).text(txt);
     },
     tableRow:function(url,anchor,rel)
     {
      var tr;
      tr=jQuery("<tr/>");
      Client5["appendTd'"](url,tr);
      Client5.appendTd(anchor,tr);
      Client5.appendTd(rel,tr);
      return tr;
     }
    },
    LinksControl:Runtime.Class({
     get_Body:function()
     {
      return Client5.linksSection(this.id);
     }
    })
   },
   Login:{
    Client:{
     loginForm:function(redirectUrl)
     {
      var userName,x,f,password,x1,f1,formlet1,x2,x3,x4,f2,f3;
      userName=(x=Controls.Input(""),(f=function(formlet)
      {
       return Enhance.WithTextLabel("Username",formlet);
      },f(x)));
      password=(x1=Controls.Password(""),(f1=function(formlet)
      {
       return Enhance.WithTextLabel("Password",formlet);
      },f1(x1)));
      formlet1=(x2=(x3=Data.$(Data.$((x4=function(n)
      {
       return function(pw)
       {
        return{
         Name:n,
         Password:pw
        };
       };
      },Formlet1.Return(x4)),userName),password),(f2=function(formlet)
      {
       return Enhance.WithSubmitButton(formlet);
      },f2(x3))),(f3=function(formlet)
      {
       return Enhance.WithFormContainer(formlet);
      },f3(x2)));
      return Formlet1.Run(function(loginInfo)
      {
       var x5,f4,f6;
       x5=(f4=function()
       {
        var x6,f5;
        x6=Remoting.Async("Website:1",[loginInfo]);
        f5=function(_arg1)
        {
         if(_arg1)
          {
           window.location.href=redirectUrl;
           return Concurrency.Return(null);
          }
         else
          {
           alert("Login failed");
           return Concurrency.Return(null);
          }
        };
        return Concurrency.Bind(x6,f5);
       },Concurrency.Delay(f4));
       f6=function(arg00)
       {
        var t;
        t={
         $:0
        };
        return Concurrency.Start(arg00);
       };
       return f6(x5);
      },formlet1);
     }
    },
    LoginControl:Runtime.Class({
     get_Body:function()
     {
      return Client6.loginForm(this.redirectUrl);
     }
    })
   },
   UrlForm:{
    Client:{
     alertHideLoader:function(element,jquery,msg)
     {
      var objectArg,arg00;
      jquery.css("visibility","hidden");
      objectArg=element["HtmlProvider@32"];
      (arg00=element.Body,function(arg10)
      {
       return objectArg.RemoveClass(arg00,arg10);
      })("disabled");
      return alert(msg);
     },
     showLoader:function(jquery,element)
     {
      var objectArg,arg00;
      objectArg=element["HtmlProvider@32"];
      (arg00=element.Body,function(arg10)
      {
       return objectArg.AddClass(arg00,arg10);
      })("disabled");
      return jquery.css("visibility","visible");
     },
     urlForm:function()
     {
      var legend,x,_this,label,x1,_this1,urlInput,x2,_this2,_this3,_this4,_this5,f,x3,submitBtn,x4,_this6,f1,x5;
      legend=(x=List.ofArray([Default.Text("Enter the URL you want to analyze.")]),(_this=Default.Tags(),_this.NewTag("legend",x)));
      label=(x1=List.ofArray([Default.Text("URL")]),(_this1=Default.Tags(),_this1.NewTag("label",x1)));
      urlInput=(x2=Default.Input(List.ofArray([Default.Attr().Class("input-xxlarge"),(_this2=Default.Attr(),_this2.NewAttr("type","text")),(_this3=HTML5.Attr(),_this3.NewAttr("placeholder","http://www.example.com/")),(_this4=HTML5.Attr(),_this4.NewAttr("autofocus","autofocus")),(_this5=HTML5.Attr(),_this5.NewAttr("spellcheck","false"))])),(f=(x3=function()
      {
       return function(key)
       {
        var _key_;
        _key_=key.KeyCode;
        if(_key_===13)
         {
          return jQuery("#submitButton").click();
         }
        else
         {
          return null;
         }
       };
      },function(arg10)
      {
       return EventsPervasives.Events().OnKeyDown(x3,arg10);
      }),(f(x2),x2)));
      submitBtn=(x4=Default.Button(List.ofArray([Default.Id("submitButton"),Default.Attr().Class("btn btn-primary"),Default.Text("Submit"),(_this6=Default.Attr(),_this6.NewAttr("type","button"))])),(f1=(x5=function(x6)
      {
       return function()
       {
        var x7,f2,f4;
        x7=(f2=function()
        {
         var loaderJquery,x8,f3;
         loaderJquery=jQuery("#loader");
         Client7.showLoader(loaderJquery,x6);
         x8=Remoting.Async("Website:0",[urlInput.get_Value()]);
         f3=function(_arg1)
         {
          var _alertHideLoader_,mongoObjId;
          _alertHideLoader_=function(msg)
          {
           return Client7.alertHideLoader(x6,loaderJquery,msg);
          };
          if(_arg1.$==1)
           {
            _alertHideLoader_("The specified URL is invalid.");
            return Concurrency.Return(null);
           }
          else
           {
            if(_arg1.$==2)
             {
              _alertHideLoader_("The specified URL doesn't point to a HTML document. The application can only process HTML pages.");
              return Concurrency.Return(null);
             }
            else
             {
              if(_arg1.$==3)
               {
                _alertHideLoader_("Downloading the specified URL failed.");
                return Concurrency.Return(null);
               }
              else
               {
                if(_arg1.$==4)
                 {
                  mongoObjId=_arg1.$0;
                  window.location.href="/Report/"+mongoObjId;
                  return Concurrency.Return(null);
                 }
                else
                 {
                  _alertHideLoader_("An error occured.");
                  return Concurrency.Return(null);
                 }
               }
             }
           }
         };
         return Concurrency.Bind(x8,f3);
        },Concurrency.Delay(f2));
        f4=function(arg00)
        {
         var t;
         t={
          $:0
         };
         return Concurrency.Start(arg00);
        };
        return f4(x7);
       };
      },function(arg10)
      {
       return EventsPervasives.Events().OnClick(x5,arg10);
      }),(f1(x4),x4)));
      return Operators.add(Default.Div(List.ofArray([Default.Id("urlForm"),Default.Attr().Class("offset2")])),List.ofArray([legend,label,urlInput,Default.Div(List.ofArray([submitBtn]))]));
     }
    },
    UrlFormControl:Runtime.Class({
     get_Body:function()
     {
      return Client7.urlForm();
     }
    })
   },
   Utilities:{
    Client:{
     makeDiv:function(idx,x,y)
     {
      if(idx===0)
       {
        return Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tab-pane fade active in"),Default.Id(x)])),List.ofArray([Client2.makeList(y)]));
       }
      else
       {
        return Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tab-pane fade"),Default.Id(x)])),List.ofArray([Client2.makeList(y)]));
       }
     },
     makeLi:function(idx,id)
     {
      var _this,arg00,_this1,arg001;
      if(idx===0)
       {
        return Operators.add(Default.LI(List.ofArray([Default.Attr().Class("active")])),List.ofArray([Operators.add(Default.A(List.ofArray([Default.HRef("#"+id),(_this=HTML5.Attr(),(arg00="data-"+"toggle",_this.NewAttr(arg00,"tab")))])),List.ofArray([Default.Text(id)]))]));
       }
      else
       {
        return Default.LI(List.ofArray([Operators.add(Default.A(List.ofArray([Default.HRef("#"+id),(_this1=HTML5.Attr(),(arg001="data-"+"toggle",_this1.NewAttr(arg001,"tab")))])),List.ofArray([Default.Text(id)]))]));
       }
     },
     makeList:function(lst)
     {
      return Default.UL(Seq.toList(Seq.delay(function()
      {
       return Seq.map(function(x)
       {
        return Default.LI(List.ofArray([Default.Text(x)]));
       },lst);
      })));
     },
     makeTabsDiv:function(tabsContent)
     {
      var lis,x,f,mapping,f1,mapping1,divs,f2,mapping2;
      lis=(x=(f=(mapping=Runtime.Tupled(function(tuple)
      {
       return tuple[0];
      }),function(array)
      {
       return Arrays.map(mapping,array);
      }),f(tabsContent)),(f1=(mapping1=function(idx)
      {
       return function(x1)
       {
        return Client2.makeLi(idx,x1);
       };
      },function(array)
      {
       return Arrays.mapi(mapping1,array);
      }),f1(x)));
      divs=(f2=(mapping2=function(idx)
      {
       return Runtime.Tupled(function(tupledArg)
       {
        var x1,y;
        x1=tupledArg[0];
        y=tupledArg[1];
        return Client2.makeDiv(idx,x1,y);
       });
      },function(array)
      {
       return Arrays.mapi(mapping2,array);
      }),f2(tabsContent));
      return Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tabbable")])),List.ofArray([Operators.add(Default.UL(List.ofArray([Default.Attr().Class("nav nav-pills")])),lis),Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tab-content")])),divs)]));
     },
     updateProgressBar:function()
     {
      var progressBarJquery,dataWidth,x,f,width,_width_,x1,f1,f2;
      progressBarJquery=jQuery("#progressBar");
      dataWidth=(x=String(progressBarJquery.data("width")),(f=function(value)
      {
       return value<<0;
      },f(x)));
      if(dataWidth===75)
       {
        progressBarJquery.css("width","100%");
        return jQuery("#progressDiv").fadeOut(3000);
       }
      else
       {
        width=dataWidth+25;
        _width_=(x1=(f1=function(value)
        {
         return Global.String(value);
        },f1(width)),(f2=function(x2)
        {
         return x2+"%";
        },f2(x1)));
        progressBarJquery.data("width",width);
        return progressBarJquery.css("width",_width_);
       }
     }
    }
   },
   Violations:{
    Client:{
     displayAccordions:function(arr,accordionId,div)
     {
      var x,f,mapping,f1,action;
      x=(f=(mapping=function(idx)
      {
       return Runtime.Tupled(function(x1)
       {
        var id,recommendation,line,level,heading,description,column;
        id="accordion"+Global.String(idx);
        recommendation=x1[5];
        line=x1[2];
        level=x1[0];
        heading=x1[1];
        description=x1[4];
        column=x1[3];
        return Client8.makeAccordionGroup(accordionId,id,heading,line,column,description,recommendation);
       });
      },function(array)
      {
       return Arrays.mapi(mapping,array);
      }),f(arr));
      f1=(action=function(arg00)
      {
       return div.AppendI(arg00);
      },function(array)
      {
       return Arrays.iter(action,array);
      });
      return f1(x);
     },
     displayViolations:function(violations,level,selector,accordionId,div)
     {
      var _violations_;
      _violations_=Client8.filterLevel(violations,level);
      Client8.updateTabHeader(_violations_,selector);
      return Client8.displayAccordions(_violations_,accordionId,div);
     },
     filterLevel:function(arr,level)
     {
      var f,predicate;
      f=(predicate=Runtime.Tupled(function(x)
      {
       var _level_;
       _level_=x[0];
       return _level_===level;
      }),function(array)
      {
       return Arrays.filter(predicate,array);
      });
      return f(arr);
     },
     makeAccordionGroup:function(parent,id,heading,line,column,description,recommendation)
     {
      var _this,arg00,_this1,arg001,x;
      return Operators.add(Default.Div(List.ofArray([Default.Attr().Class("accordion-group")])),List.ofArray([Operators.add(Default.Div(List.ofArray([Default.Attr().Class("accordion-heading")])),List.ofArray([Operators.add(Default.A(List.ofArray([Default.Attr().Class("accordion-toggle"),(_this=HTML5.Attr(),(arg00="data-"+"toggle",_this.NewAttr(arg00,"collapse"))),(_this1=HTML5.Attr(),(arg001="data-"+"parent",_this1.NewAttr(arg001,parent))),(x="#"+id,Default.HRef(x))])),List.ofArray([Default.Text(heading)]))])),Operators.add(Default.Div(List.ofArray([Default.Id(id),Default.Attr().Class("accordion-body collapse")])),List.ofArray([Operators.add(Default.Div(List.ofArray([Default.Attr().Class("accordion-inner")])),List.ofArray([Client8.makeDiv("Line",line),Client8.makeDiv("Column",column),Client8.makeDiv("Description",description),Client8.makeDiv("Recommendation",recommendation)]))]))]));
     },
     makeDiv:function(txt,_txt_)
     {
      return Operators.add(Default.Div(List.ofArray([Default.Attr().Class("row-fluid")])),List.ofArray([Operators.add(Default.Div(List.ofArray([Default.Attr().Class("span3")])),List.ofArray([Operators.add(Default.H4(List.ofArray([Default.Attr().Class("h4")])),List.ofArray([Default.Text(txt)]))])),Operators.add(Default.Div(List.ofArray([Default.Attr().Class("span9")])),List.ofArray([Default.P(List.ofArray([Default.Text(_txt_)]))]))]));
     },
     updateTabHeader:function(arr,selector)
     {
      var count,copyOfStruct,jquery,text;
      count=(copyOfStruct=[arr.length],String(copyOfStruct[0]));
      jquery=jQuery(selector);
      text=jquery.text();
      return jquery.text(Strings.concat("",List.ofArray([text," (",count,")"])));
     },
     violationsSection:function(id)
     {
      var div,_div_,x,_this,x1,_this1,arg00,_this2,arg001,f,f1;
      div=Default.Div(List.ofArray([Default.Attr().Class("accordion"),Default.Id("errorsAccordion")]));
      _div_=Default.Div(List.ofArray([Default.Attr().Class("accordion"),Default.Id("warningsAccordion")]));
      x=Operators.add((_this=HTML5.Tags(),(x1=List.ofArray([Default.Attr().Class("tab-pane fade in reportSection"),Default.Id("violations")]),_this.NewTag("section",x1))),List.ofArray([div,Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tabbable")])),List.ofArray([Operators.add(Default.UL(List.ofArray([Default.Attr().Class("nav nav-pills")])),List.ofArray([Operators.add(Default.LI(List.ofArray([Default.Attr().Class("active")])),List.ofArray([Operators.add(Default.A(List.ofArray([Default.HRef("#errors"),(_this1=HTML5.Attr(),(arg00="data-"+"toggle",_this1.NewAttr(arg00,"tab"))),Default.Id("errorsTab")])),List.ofArray([Default.Text("Errors")]))])),Default.LI(List.ofArray([Operators.add(Default.A(List.ofArray([Default.HRef("#warnings"),(_this2=HTML5.Attr(),(arg001="data-"+"toggle",_this2.NewAttr(arg001,"tab"))),Default.Id("warningsTab")])),List.ofArray([Default.Text("Warnings")]))]))])),Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tab-content")])),List.ofArray([Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tab-pane active fade in span8"),Default.Id("errors")])),List.ofArray([div])),Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tab-pane fade span8"),Default.Id("warnings")])),List.ofArray([_div_]))]))]))]));
      f=(f1=function()
      {
       var x2,f2,f6;
       x2=(f2=function()
       {
        var x3,f3;
        x3=Remoting.Async("Website:2",[id]);
        f3=function(_arg11)
        {
         var a,violations,_displayViolations_,b,f4,f5;
         a=_arg11.$==1?(violations=_arg11.$0,(_displayViolations_=function(level,selector,accordionId,div1)
         {
          return Client8.displayViolations(violations,level,selector,accordionId,div1);
         },(_displayViolations_("Error","#errorsTab","errorsAccordion",div),(_displayViolations_("Warning","#warningsTab","warningsAccordion",_div_),Concurrency.Return(null))))):(null,Concurrency.Return(null));
         b=(f4=function()
         {
          Client2.updateProgressBar();
          return Concurrency.Return(null);
         },Concurrency.Delay(f4));
         f5=function()
         {
          return b;
         };
         return Concurrency.Bind(a,f5);
        };
        return Concurrency.Bind(x3,f3);
       },Concurrency.Delay(f2));
       f6=function(arg002)
       {
        var t;
        t={
         $:0
        };
        return Concurrency.Start(arg002);
       };
       return f6(x2);
      },function(w)
      {
       return Operators.OnAfterRender(f1,w);
      });
      f(x);
      return x;
     }
    },
    ViolationsControl:Runtime.Class({
     get_Body:function()
     {
      return Client8.violationsSection(this.id);
     }
    })
   }
  }
 });
 Runtime.OnInit(function()
 {
  OpenSEO=Runtime.Safe(Global.OpenSEO);
  DBCleanup=Runtime.Safe(OpenSEO.DBCleanup);
  Client=Runtime.Safe(DBCleanup.Client);
  WebSharper=Runtime.Safe(Global.IntelliFactory.WebSharper);
  Html=Runtime.Safe(WebSharper.Html);
  Default=Runtime.Safe(Html.Default);
  List=Runtime.Safe(WebSharper.List);
  Remoting=Runtime.Safe(WebSharper.Remoting);
  alert=Runtime.Safe(Global.alert);
  Concurrency=Runtime.Safe(WebSharper.Concurrency);
  EventsPervasives=Runtime.Safe(Html.EventsPervasives);
  T=Runtime.Safe(List.T);
  Operators=Runtime.Safe(Html.Operators);
  HTML5=Runtime.Safe(Default.HTML5);
  Details=Runtime.Safe(OpenSEO.Details);
  Client1=Runtime.Safe(Details.Client);
  Seq=Runtime.Safe(WebSharper.Seq);
  Utilities=Runtime.Safe(OpenSEO.Utilities);
  Client2=Runtime.Safe(Utilities.Client);
  jQuery=Runtime.Safe(Global.jQuery);
  Keywords=Runtime.Safe(OpenSEO.Keywords);
  Client3=Runtime.Safe(Keywords.Client);
  Arrays=Runtime.Safe(WebSharper.Arrays);
  LatestReports=Runtime.Safe(OpenSEO.LatestReports);
  Client4=Runtime.Safe(LatestReports.Client);
  Links=Runtime.Safe(OpenSEO.Links);
  Client5=Runtime.Safe(Links.Client);
  String=Runtime.Safe(Global.String);
  Number=Runtime.Safe(Global.Number);
  kendo=Runtime.Safe(Global.kendo);
  Formlet=Runtime.Safe(WebSharper.Formlet);
  Controls=Runtime.Safe(Formlet.Controls);
  Enhance=Runtime.Safe(Formlet.Enhance);
  Data=Runtime.Safe(Formlet.Data);
  Formlet1=Runtime.Safe(Formlet.Formlet);
  window=Runtime.Safe(Global.window);
  Login=Runtime.Safe(OpenSEO.Login);
  Client6=Runtime.Safe(Login.Client);
  UrlForm=Runtime.Safe(OpenSEO.UrlForm);
  Client7=Runtime.Safe(UrlForm.Client);
  Violations=Runtime.Safe(OpenSEO.Violations);
  Client8=Runtime.Safe(Violations.Client);
  return Strings=Runtime.Safe(WebSharper.Strings);
 });
 Runtime.OnLoad(function()
 {
 });
}());
