(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,OpenSEO,AddThis,Client,WebSharper,Html,Default,HTML5,List,T,DBCleanup,Client1,Remoting,alert,Concurrency,EventsPervasives,Operators,Details,Client2,Utilities,Client3,jQuery,Headers,Client4,Arrays,Keywords,Client5,LatestReports,Client6,Links,Client7,String,Strings,Formlet,Controls,Enhance,Data,Formlet1,window,Login,Client8,Pagespeed,Client9,Seq,Number,Math,UrlForm,Clienta,google,visualization,PieChart,Google,Visualization,Visualizations,PieChartOptions,DataTable,Validator,Clientb,Violations,Clientc;
 Runtime.Define(Global,{
  OpenSEO:{
   AddThis:{
    AddThisControl:Runtime.Class({
     get_Body:function()
     {
      return Client.addThisSection();
     }
    }),
    Client:{
     addThisSection:function()
     {
      var section,_this,x;
      section=(_this=HTML5.Tags(),(x=Runtime.New(T,{
       $:0
      }),_this.NewTag("section",x)));
      section.set_Html("<div class=\"addthis_toolbox addthis_default_style \">\r\n                <a class=\"addthis_button_facebook_like\" fb:like:layout=\"button_count\"></a>\r\n                <a class=\"addthis_button_tweet\"></a>\r\n                <a class=\"addthis_button_pinterest_pinit\"></a>\r\n                <a class=\"addthis_counter addthis_pill_style\"></a>\r\n                </div>\r\n                <script type=\"text/javascript\" src=\"http://s7.addthis.com/js/300/addthis_widget.js#pubid=ra-50af450141ce9366\"></script>");
      return section;
     }
    }
   },
   DBCleanup:{
    ButtonControl:Runtime.Class({
     get_Body:function()
     {
      return Client1.cleanDbBtn();
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
         x4=Remoting.Async("Website:9",[]);
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
      x=Operators.add((_this=HTML5.Tags(),(x1=List.ofArray([Default.Attr().Class("tab-pane fade active in reportSection"),Default.Id("details")]),_this.NewTag("section",x1))),List.ofArray([Client2.makeDiv("urlDiv","URL","url"),Client3.hRule(),Client2.makeDiv("timeDiv","Elapsed Time","elapsedTime"),Client3.hRule(),Client2.makeDiv("textRatioDiv","Text/HTML Ratio","textRatio"),Client3.hRule(),Client2.makeDiv("titleDiv","Title","title"),Client3.hRule(),Client2.makeDiv("descDiv","Description","description"),Client3.hRule(),Operators.add(Default.Div(List.ofArray([Default.Attr().Class("row-fluid")])),List.ofArray([Operators.add(Default.Div(List.ofArray([Default.Attr().Class("span3")])),List.ofArray([Operators.add(Default.H4(List.ofArray([Default.Attr().Class("h4")])),List.ofArray([Default.Text("Headings")]))])),Operators.add(Default.Div(List.ofArray([Default.Attr().Class("span9")])),List.ofArray([tabsDiv]))]))]));
      f=(f1=function()
      {
       var x2,f2,f4;
       x2=(f2=function()
       {
        var x3,f3;
        x3=Remoting.Async("Website:8",[id]);
        f3=function(_arg11)
        {
         var details,requestUri;
         if(_arg11.$==1)
          {
           details=_arg11.$0;
           Client2.displayDetails(details,tabsDiv);
           requestUri=details.RequestUri;
           Client2.setInputVal("#validatorUri",requestUri);
           Client2.setInputVal("#pagespeedUri",requestUri);
           Client3.updateProgressBar();
           return Concurrency.Return(null);
          }
         else
          {
           return Concurrency.Return(null);
          }
        };
        return Concurrency.Bind(x3,f3);
       },Concurrency.Delay(f2));
       f4=function(arg00)
       {
        var t;
        t={
         $:0
        };
        return Concurrency.Start(arg00);
       };
       return f4(x2);
      },function(w)
      {
       return Operators.OnAfterRender(f1,w);
      });
      f(x);
      return x;
     },
     displayDetails:function(details,tabsDiv)
     {
      var title,description,txt,txt1,headings,matchValue,tabs;
      title=details.Title;
      description=details.Description;
      Client2.setPText("#url",details.RequestUri);
      txt=details.ElapsedTime+" milliseconds";
      Client2.setPText("#elapsedTime",txt);
      txt1=Global.String(details.TextRatio)+" %";
      Client2.setPText("#textRatio",txt1);
      Client2.setPText("#title",title);
      Client2.displayLength(title,"#titleDiv");
      Client2.setPText("#description",description);
      Client2.displayLength(description,"#descDiv");
      headings=details.Headings;
      matchValue=headings.length;
      if(matchValue===0)
       {
        return null;
       }
      else
       {
        tabs=Client3.makeTabsDiv(headings);
        return tabsDiv.AppendI(tabs);
       }
     },
     displayLength:function(str,selector)
     {
      var strLength,x;
      strLength=str==="MISSING"?{
       $:0
      }:{
       $:1,
       $0:"("+Global.String(str.length)+" characters)"
      };
      if(strLength.$==1)
       {
        x=strLength.$0;
        return jQuery(selector).append(jQuery("<small/>").text(x));
       }
      else
       {
        return null;
       }
     },
     makeDiv:function(divId,h4Text,pId)
     {
      return Operators.add(Default.Div(List.ofArray([Default.Attr().Class("row-fluid")])),List.ofArray([Operators.add(Default.Div(List.ofArray([Default.Attr().Class("span3"),Default.Id(divId)])),List.ofArray([Operators.add(Default.H4(List.ofArray([Default.Attr().Class("h4")])),List.ofArray([Default.Text(h4Text)]))])),Operators.add(Default.Div(List.ofArray([Default.Attr().Class("span9")])),List.ofArray([Default.P(List.ofArray([Default.Id(pId)]))]))]));
     },
     setInputVal:function(selector,requestUri)
     {
      return jQuery(selector).val(requestUri).trigger("change");
     },
     setPText:function(selector,txt)
     {
      return jQuery(selector).text(txt);
     }
    },
    DetailsControl:Runtime.Class({
     get_Body:function()
     {
      return Client2.detailsSection(this.id);
     }
    })
   },
   Headers:{
    Client:{
     appendTd:function(text,tableRow)
     {
      return jQuery("<td/>").text(text).appendTo(tableRow);
     },
     displayHeaders:function(headers,selector)
     {
      var x,f,mapping,f1,action;
      x=(f=(mapping=Runtime.Tupled(function(tupledArg)
      {
       var x1,y;
       x1=tupledArg[0];
       y=tupledArg[1];
       return Client4.tableRow(x1,y);
      }),function(array)
      {
       return Arrays.map(mapping,array);
      }),f(headers));
      f1=(action=function(x1)
      {
       return x1.appendTo(jQuery(selector));
      },function(array)
      {
       return Arrays.iter(action,array);
      });
      return f1(x);
     },
     headersSection:function(id)
     {
      var tabsDiv,x,_this,x1,f,f1;
      tabsDiv=Default.Div(Runtime.New(T,{
       $:0
      }));
      x=Operators.add((_this=HTML5.Tags(),(x1=List.ofArray([Default.Attr().Class("tab-pane fade in reportSection"),Default.Id("headers")]),_this.NewTag("section",x1))),List.ofArray([Operators.add(Default.Div(List.ofArray([Default.Attr().Class("span8")])),List.ofArray([Operators.add(Default.Table(List.ofArray([Default.Id("headersTable"),Default.Attr().Class("table table-bordered table-striped span8")])),List.ofArray([Default.TR(List.ofArray([Default.TH(List.ofArray([Default.Text("Key")])),Default.TH(List.ofArray([Default.Text("Value")]))]))]))]))]));
      f=(f1=function()
      {
       var x2,f2,f4;
       x2=(f2=function()
       {
        var x3,f3;
        x3=Remoting.Async("Website:4",[id]);
        f3=function(_arg11)
        {
         var headers;
         if(_arg11.$==1)
          {
           headers=_arg11.$0;
           Client4.displayHeaders(headers,"#headersTable");
           Client3.updateProgressBar();
           return Concurrency.Return(null);
          }
         else
          {
           return Concurrency.Return(null);
          }
        };
        return Concurrency.Bind(x3,f3);
       },Concurrency.Delay(f2));
       f4=function(arg00)
       {
        var t;
        t={
         $:0
        };
        return Concurrency.Start(arg00);
       };
       return f4(x2);
      },function(w)
      {
       return Operators.OnAfterRender(f1,w);
      });
      f(x);
      return x;
     },
     makeTable:function(id)
     {
      return Operators.add(Default.Table(List.ofArray([Default.Id(id),Default.Attr().Class("table table-bordered table-striped span10")])),List.ofArray([Default.TR(List.ofArray([Default.TH(List.ofArray([Default.Text("Key")])),Default.TH(List.ofArray([Default.Text("Value")]))]))]));
     },
     tableRow:function(key,value)
     {
      var tr;
      tr=jQuery("<tr/>");
      Client4.appendTd(key,tr);
      Client4.appendTd(value,tr);
      return tr;
     }
    },
    HeadersControl:Runtime.Class({
     get_Body:function()
     {
      return Client4.headersSection(this.id);
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
       return Client5.tableRow(x1,y,z);
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
      x=Operators.add((_this=HTML5.Tags(),(x1=List.ofArray([Default.Attr().Class("tab-pane fade in reportSection"),Default.Id("keywords")]),_this.NewTag("section",x1))),List.ofArray([Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tabbable")])),List.ofArray([Operators.add(Default.UL(List.ofArray([Default.Attr().Class("nav nav-pills")])),List.ofArray([Operators.add(Default.LI(List.ofArray([Default.Attr().Class("active")])),List.ofArray([Operators.add(Default.A(List.ofArray([Default.HRef("#keywords1"),(_this1=HTML5.Attr(),(arg00="data-"+"toggle",_this1.NewAttr(arg00,"tab")))])),List.ofArray([Default.Text("1 Keyword")]))])),Default.LI(List.ofArray([Operators.add(Default.A(List.ofArray([Default.HRef("#keywords2"),(_this2=HTML5.Attr(),(arg001="data-"+"toggle",_this2.NewAttr(arg001,"tab")))])),List.ofArray([Default.Text("2 Keywords")]))])),Default.LI(List.ofArray([Operators.add(Default.A(List.ofArray([Default.HRef("#keywords3"),(_this3=HTML5.Attr(),(arg002="data-"+"toggle",_this3.NewAttr(arg002,"tab")))])),List.ofArray([Default.Text("3 Keywords")]))]))])),Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tab-content")])),List.ofArray([Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tab-pane active fade in span8"),Default.Id("keywords1")])),List.ofArray([Client5.makeTable("table1")])),Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tab-pane fade span8"),Default.Id("keywords2")])),List.ofArray([Client5.makeTable("table2")])),Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tab-pane fade span8"),Default.Id("keywords3")])),List.ofArray([Client5.makeTable("table3")]))]))]))]));
      f=(f1=function()
      {
       var x2,f2,f6;
       x2=(f2=function()
       {
        var x3,f3;
        x3=Remoting.Async("Website:7",[id]);
        f3=function(_arg11)
        {
         var a,keywords,b,f4,f5;
         a=_arg11.$==1?(keywords=_arg11.$0,(Client5.displayKeywords(keywords.get_Item(0),"#table1"),(Client5.displayKeywords(keywords.get_Item(1),"#table2"),(Client5.displayKeywords(keywords.get_Item(2),"#table3"),Concurrency.Return(null))))):(null,Concurrency.Return(null));
         b=(f4=function()
         {
          Client3.updateProgressBar();
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
      return Operators.add(Default.Table(List.ofArray([Default.Id(id),Default.Attr().Class("table table-bordered table-striped span10")])),List.ofArray([Default.TR(List.ofArray([Client5.makeTh(id),Default.TH(List.ofArray([Default.Text("Occurrence")])),Default.TH(List.ofArray([Default.Text("Density %")]))]))]));
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
      Client5.appendTd(keyword,tr);
      Client5.appendTd(occurrence,tr);
      Client5.appendTd(density,tr);
      return tr;
     }
    },
    KeywordsControl:Runtime.Class({
     get_Body:function()
     {
      return Client5.keywordsSection(this.id);
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
        x3=Remoting.Async("Website:10",[]);
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
             return Client6.makeLi(url);
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
      return Client6.latestReportsList();
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
     displayLinks:function(links,selector,_selector_)
     {
      var x,f,mapping,f1,action;
      x=(f=(mapping=Runtime.Tupled(function(tupledArg)
      {
       var x1,y,z;
       x1=tupledArg[0];
       y=tupledArg[1];
       z=tupledArg[2];
       return Client7.tableRow(x1,y,z);
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
      f1(x);
      return Client7.updateTabHeader(links,_selector_);
     },
     linksSection:function(id)
     {
      var div,_div_,x,_this,x1,_this1,arg00,_this2,arg001,_this3,arg002,_this4,f,f1;
      div=Default.Div(List.ofArray([Client7.makeDiv("Internal Links","internalLinksCount"),Client7.makeDiv("External Links","externalLinksCount")]));
      _div_=Default.Div(List.ofArray([Client7.makeDiv("Follow Links","followLinksCount"),Client7.makeDiv("Nofollow Links","nofollowLinksCount")]));
      x=Operators.add((_this=HTML5.Tags(),(x1=List.ofArray([Default.Attr().Class("tab-pane fade in reportSection"),Default.Id("links")]),_this.NewTag("section",x1))),List.ofArray([Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tabbable")])),List.ofArray([Operators.add(Default.UL(List.ofArray([Default.Attr().Class("nav nav-pills")])),List.ofArray([Operators.add(Default.LI(List.ofArray([Default.Attr().Class("active")])),List.ofArray([Operators.add(Default.A(List.ofArray([Default.HRef("#links1"),(_this1=HTML5.Attr(),(arg00="data-"+"toggle",_this1.NewAttr(arg00,"tab"))),Default.Id("internalLinksTab")])),List.ofArray([Default.Text("Internal")]))])),Default.LI(List.ofArray([Operators.add(Default.A(List.ofArray([Default.HRef("#links2"),(_this2=HTML5.Attr(),(arg001="data-"+"toggle",_this2.NewAttr(arg001,"tab"))),Default.Id("externalLinksTab")])),List.ofArray([Default.Text("External")]))])),Default.LI(List.ofArray([Operators.add(Default.A(List.ofArray([Default.HRef("#linksStats"),(_this3=HTML5.Attr(),(arg002="data-"+"toggle",_this3.NewAttr(arg002,"tab")))])),List.ofArray([Default.Text("Stats")]))]))])),Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tab-content")])),List.ofArray([Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tab-pane active fade in span8"),Default.Id("links1")])),List.ofArray([Client7.makeTable("linksTable1")])),Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tab-pane fade span8"),Default.Id("links2")])),List.ofArray([Client7.makeTable("linksTable2")])),Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tab-pane fade span8"),Default.Id("linksStats"),(_this4=Default.Attr(),_this4.NewAttr("style","overflow-y: hidden;"))])),List.ofArray([div,Client3.hRule(),_div_]))]))]))]));
      f=(f1=function()
      {
       var x2,f2,f6;
       x2=(f2=function()
       {
        var x3,f3;
        x3=Remoting.Async("Website:6",[id]);
        f3=function(_arg11)
        {
         var a,links,txt,txt1,txt2,txt3,dataTable,_dataTable_,pie,_pie_,b,f4,f5;
         a=_arg11.$==1?(links=_arg11.$0,(Client7.displayLinks(links.InternalLinks,"#linksTable1","#internalLinksTab"),(Client7.displayLinks(links.ExternalLinks,"#linksTable2","#externalLinksTab"),(txt=String(links.InternalCount),Client7.setPText("#internalLinksCount",txt),(txt1=String(links.ExternalCount),Client7.setPText("#externalLinksCount",txt1),(txt2=String(links.FollowCount),Client7.setPText("#followLinksCount",txt2),(txt3=String(links.NofollowCount),Client7.setPText("#nofollowLinksCount",txt3),(dataTable=Client3.makeDataTable("Link Type","Count",List.ofArray([["External",links.ExternalCount],["Internal",links.InternalCount]])),(_dataTable_=Client3.makeDataTable("Link Rel","Count",List.ofArray([["Follow",links.FollowCount],["NoFollow",links.NofollowCount]])),(pie=Client3.drawPie(dataTable),(_pie_=Client3.drawPie(_dataTable_),(div.AppendI(pie),(_div_.AppendI(_pie_),Concurrency.Return(null)))))))))))))):(null,Concurrency.Return(null));
         b=(f4=function()
         {
          Client3.updateProgressBar();
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
     setPText:function(selector,txt)
     {
      return jQuery(selector).text(txt);
     },
     tableRow:function(url,anchor,rel)
     {
      var tr;
      tr=jQuery("<tr/>");
      Client7["appendTd'"](url,tr);
      Client7.appendTd(anchor,tr);
      Client7.appendTd(rel,tr);
      return tr;
     },
     updateTabHeader:function(arr,selector)
     {
      var count,copyOfStruct,jquery,text;
      count=(copyOfStruct=[arr.length],String(copyOfStruct[0]));
      jquery=jQuery(selector);
      text=jquery.text();
      return jquery.text(Strings.concat("",List.ofArray([text," (",count,")"])));
     }
    },
    LinksControl:Runtime.Class({
     get_Body:function()
     {
      return Client7.linksSection(this.id);
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
      return Client8.loginForm(this.redirectUrl);
     }
    })
   },
   Pagespeed:{
    Client:{
     displayAccordions:function(id,accordionId,div,lst)
     {
      var x,f,mapping,f1,action,length;
      x=(f=(mapping=function(idx)
      {
       return Runtime.Tupled(function(x1)
       {
        var _id_,suggestions,ruleName;
        _id_=id+Global.String(idx);
        suggestions=x1[1];
        ruleName=x1[0];
        return Client9.makeAccordionGroup(accordionId,_id_,ruleName,suggestions);
       });
      },function(list)
      {
       return List.mapi(mapping,list);
      }),f(lst));
      f1=(action=function(arg00)
      {
       return div.AppendI(arg00);
      },function(list)
      {
       return Seq.iter(action,list);
      });
      f1(x);
      length=Global.String(lst.get_Length());
      return Client9.updateTabHeader(length,"#speedSuggestionsTab");
     },
     displaySpeedData:function(uriString,div,_div_)
     {
      var x,f,f2;
      x=(f=function()
      {
       var x1,f1;
       x1=Remoting.Async("Website:2",[uriString]);
       f1=function(_arg1)
       {
        var speedData,score,sizeBreakdown,txt,txt1,txt2,txt3,txt4,txt5,dataTable,chart;
        if(_arg1.$==1)
         {
          speedData=_arg1.$0;
          score=Global.String(speedData.Score)+" / 100";
          sizeBreakdown=speedData.ResourceBreakdown;
          Client9.setPText("#speedScore",score);
          txt=Client9.kbSize(sizeBreakdown.Css);
          Client9.setPText("#cssSize",txt);
          txt1=Client9.kbSize(sizeBreakdown.Html);
          Client9.setPText("#htmlSize",txt1);
          txt2=Client9.kbSize(sizeBreakdown.Images);
          Client9.setPText("#imagesSize",txt2);
          txt3=Client9.kbSize(sizeBreakdown.Javascript);
          Client9.setPText("#jsSize",txt3);
          txt4=Client9.kbSize(sizeBreakdown.Other);
          Client9.setPText("#otherSize",txt4);
          txt5=Client9.kbSize(sizeBreakdown.Total);
          Client9.setPText("#totalSize",txt5);
          Client9.displayAccordions("speedSuggestion","speedSuggestionsAccordion",div,speedData.Rules);
          dataTable=Client3.makeDataTable("Resource","Size",List.ofArray([["CSS",sizeBreakdown.Css],["HTML",sizeBreakdown.Html],["Images",sizeBreakdown.Images],["JavaScript",sizeBreakdown.Javascript],["Other",sizeBreakdown.Other]]));
          chart=Client3.drawPie(dataTable);
          _div_.AppendI(chart);
          return Concurrency.Return(null);
         }
        else
         {
          return Concurrency.Return(null);
         }
       };
       return Concurrency.Bind(x1,f1);
      },Concurrency.Delay(f));
      f2=function(arg00)
      {
       var t;
       t={
        $:0
       };
       return Concurrency.Start(arg00);
      };
      return f2(x);
     },
     kbSize:function(x)
     {
      var x1,x2,f,f1;
      x1=(x2=Number(x)/1024,(f=function(arg00)
      {
       return Math.round(arg00);
      },f(x2)));
      f1=function(x3)
      {
       return Global.String(x3)+" KB";
      };
      return f1(x1);
     },
     makeAccordionGroup:function(parent,id,ruleName,suggestions)
     {
      var div,x,_this,arg00,_this1,arg001,x1;
      div=suggestions.$==1?(x=suggestions.$0,Default.Div(Seq.toList(Seq.delay(function()
      {
       var f;
       f=function(list)
       {
        return List.map(function(suggestion)
        {
         return Client9["makeDiv'"](suggestion);
        },list);
       };
       return f(x);
      })))):Default.Div(Runtime.New(T,{
       $:0
      }));
      return Operators.add(Default.Div(List.ofArray([Default.Attr().Class("accordion-group")])),List.ofArray([Operators.add(Default.Div(List.ofArray([Default.Attr().Class("accordion-heading")])),List.ofArray([Operators.add(Default.A(List.ofArray([Default.Attr().Class("accordion-toggle"),(_this=HTML5.Attr(),(arg00="data-"+"toggle",_this.NewAttr(arg00,"collapse"))),(_this1=HTML5.Attr(),(arg001="data-"+"parent",_this1.NewAttr(arg001,parent))),(x1="#"+id,Default.HRef(x1))])),List.ofArray([Default.Text(ruleName)]))])),Operators.add(Default.Div(List.ofArray([Default.Id(id),Default.Attr().Class("accordion-body collapse")])),List.ofArray([Operators.add(Default.Div(List.ofArray([Default.Attr().Class("accordion-inner")])),List.ofArray([div]))]))]));
     },
     makeDiv:function(txt,id)
     {
      return Operators.add(Default.Div(List.ofArray([Default.Attr().Class("row-fluid")])),List.ofArray([Operators.add(Default.Div(List.ofArray([Default.Attr().Class("span3")])),List.ofArray([Operators.add(Default.H4(List.ofArray([Default.Attr().Class("h4")])),List.ofArray([Default.Text(txt)]))])),Operators.add(Default.Div(List.ofArray([Default.Attr().Class("span9")])),List.ofArray([Default.P(List.ofArray([Default.Id(id)]))]))]));
     },
     "makeDiv'":function(suggestion)
     {
      return Default.Div(List.ofArray([Operators.add(Default.H4(List.ofArray([Default.Attr().Class("h4")])),List.ofArray([Default.Text(suggestion.Header)])),Default.UL(Seq.toList(Seq.delay(function()
      {
       var x,f;
       x=suggestion.Urls;
       f=function(list)
       {
        return List.map(function(text)
        {
         return Client9.makeLi(text);
        },list);
       };
       return f(x);
      })))]));
     },
     makeLi:function(text)
     {
      return Default.LI(List.ofArray([Default.Text(text)]));
     },
     pagespeedSection:function()
     {
      var input,_this,_this1,div,_div_,_this2,x,_this3,x1,_this4,arg00,_this5,arg001,f,f1;
      input=Default.Input(List.ofArray([(_this=Default.Attr(),_this.NewAttr("type","hidden")),(_this1=Default.Attr(),_this1.NewAttr("value","")),Default.Id("pagespeedUri")]));
      div=Default.Div(List.ofArray([Default.Attr().Class("accordion"),Default.Id("speedSuggestionsAccordion")]));
      _div_=Default.Div(List.ofArray([Default.Id("resourceSizeDiv"),(_this2=Default.Attr(),_this2.NewAttr("style","overflow-y: hidden;"))]));
      x=Operators.add((_this3=HTML5.Tags(),(x1=List.ofArray([Default.Attr().Class("tab-pane fade in reportSection"),Default.Id("speed")]),_this3.NewTag("section",x1))),List.ofArray([input,Client9.makeDiv("Score","speedScore"),Default.Hr(Runtime.New(T,{
       $:0
      })),Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tabbable")])),List.ofArray([Operators.add(Default.UL(List.ofArray([Default.Attr().Class("nav nav-pills")])),List.ofArray([Operators.add(Default.LI(List.ofArray([Default.Attr().Class("active")])),List.ofArray([Operators.add(Default.A(List.ofArray([Default.HRef("#speedSuggestions"),(_this4=HTML5.Attr(),(arg00="data-"+"toggle",_this4.NewAttr(arg00,"tab"))),Default.Id("speedSuggestionsTab")])),List.ofArray([Default.Text("Suggestions")]))])),Default.LI(List.ofArray([Operators.add(Default.A(List.ofArray([Default.HRef("#resourceBreakdown"),(_this5=HTML5.Attr(),(arg001="data-"+"toggle",_this5.NewAttr(arg001,"tab"))),Default.Id("sizeBreakdownTab")])),List.ofArray([Default.Text("Resource Breakdown")]))]))])),Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tab-content")])),List.ofArray([Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tab-pane active fade in span8"),Default.Id("speedSuggestions")])),List.ofArray([div])),Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tab-pane fade span8"),Default.Id("resourceBreakdown")])),List.ofArray([Client9.makeDiv("CSS","cssSize"),Client9.makeDiv("HTML","htmlSize"),Client9.makeDiv("Images","imagesSize"),Client9.makeDiv("JavaScript","jsSize"),Client9.makeDiv("Other","otherSize"),Client9.makeDiv("Total","totalSize"),_div_]))]))]))]));
      f=(f1=function()
      {
       return jQuery("#pagespeedUri").change(function()
       {
        var uriString;
        uriString=this.getAttribute("value");
        return Client9.displaySpeedData(uriString,div,_div_);
       });
      },function(w)
      {
       return Operators.OnAfterRender(f1,w);
      });
      f(x);
      return x;
     },
     setPText:function(selector,txt)
     {
      return jQuery(selector).text(txt);
     },
     updateTabHeader:function(count,selector)
     {
      var jquery,text;
      jquery=jQuery(selector);
      text=jquery.text();
      return jquery.text(Strings.concat("",List.ofArray([text," (",count,")"])));
     }
    },
    PagespeedControl:Runtime.Class({
     get_Body:function()
     {
      return Client9.pagespeedSection(function(x)
      {
       return x;
      });
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
      urlInput=(x2=Default.Input(List.ofArray([Default.Attr().Class("span6"),(_this2=Default.Attr(),_this2.NewAttr("type","text")),(_this3=HTML5.Attr(),_this3.NewAttr("placeholder","http://www.YourWebsite.com/")),(_this4=HTML5.Attr(),_this4.NewAttr("autofocus","autofocus")),(_this5=HTML5.Attr(),_this5.NewAttr("spellcheck","false"))])),(f=(x3=function()
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
      submitBtn=(x4=Default.Button(List.ofArray([Default.Id("submitButton"),Default.Attr().Class("btn btn-success"),Default.Text("URL Review"),(_this6=Default.Attr(),_this6.NewAttr("type","button"))])),(f1=(x5=function(x6)
      {
       return function()
       {
        var x7,f2,f4;
        x7=(f2=function()
        {
         var loaderJquery,x8,f3;
         loaderJquery=jQuery("#loader");
         Clienta.showLoader(loaderJquery,x6);
         x8=Remoting.Async("Website:0",[urlInput.get_Value()]);
         f3=function(_arg1)
         {
          var _alertHideLoader_,mongoObjId;
          _alertHideLoader_=function(msg)
          {
           return Clienta.alertHideLoader(x6,loaderJquery,msg);
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
      return Operators.add(Default.Div(List.ofArray([Default.Id("urlForm"),Default.Attr().Class("input-append offset2")])),List.ofArray([urlInput,submitBtn]));
     }
    },
    UrlFormControl:Runtime.Class({
     get_Body:function()
     {
      return Clienta.urlForm();
     }
    })
   },
   Utilities:{
    Client:{
     drawPie:function(dataTable)
     {
      var x,f,f1;
      x=Default.Div(Runtime.New(T,{
       $:0
      }));
      f=(f1=function(x1)
      {
       var pie,options,inputRecord;
       pie=new PieChart(x1.Body);
       options=(inputRecord=PieChartOptions.get_Default(),Runtime.New(PieChartOptions,{
        backgroundColor:inputRecord.backgroundColor,
        color:inputRecord.color,
        colors:inputRecord.colors,
        enableEvents:inputRecord.enableEvents,
        height:600,
        is3D:inputRecord.is3D,
        labels:inputRecord.labels,
        legend:inputRecord.legend,
        title:inputRecord.title,
        width:600
       }));
       return pie.draw(dataTable,options);
      },function(w)
      {
       return Operators.OnAfterRender(f1,w);
      });
      f(x);
      return x;
     },
     hRule:function()
     {
      return Default.Hr(List.ofArray([Default.Attr().Class("span6 hrule")]));
     },
     makeDataTable:function(column,_column_,rows)
     {
      var dataTable,x,f,x1,f1,x2,f2,f3,action;
      dataTable=new DataTable();
      x=dataTable.addColumn("string",column);
      f=function(value)
      {
       value;
      };
      f(x);
      x1=dataTable.addColumn("number",_column_);
      f1=function(value)
      {
       value;
      };
      f1(x1);
      x2=dataTable.addRows(rows.get_Length());
      f2=function(value)
      {
       value;
      };
      f2(x2);
      f3=(action=function(idx)
      {
       return Runtime.Tupled(function(tupledArg)
       {
        var x3,y;
        x3=tupledArg[0];
        y=tupledArg[1];
        dataTable.setCell(idx,0,x3);
        return dataTable.setCell(idx,1,y);
       });
      },function(list)
      {
       return Seq.iteri(action,list);
      });
      f3(rows);
      return dataTable;
     },
     makeDiv:function(idx,x,y)
     {
      if(idx===0)
       {
        return Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tab-pane fade active in"),Default.Id(x)])),List.ofArray([Client3.makeList(y)]));
       }
      else
       {
        return Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tab-pane fade"),Default.Id(x)])),List.ofArray([Client3.makeList(y)]));
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
        return Client3.makeLi(idx,x1);
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
        return Client3.makeDiv(idx,x1,y);
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
      if(dataWidth===80)
       {
        progressBarJquery.css("width","100%");
        return jQuery("#progressDiv").fadeOut(3000);
       }
      else
       {
        width=dataWidth+20;
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
   Validator:{
    Client:{
     displayAccordions:function(id,lst,accordionId,div)
     {
      var x,f,mapping,f1,action;
      x=(f=(mapping=function(idx)
      {
       return Runtime.Tupled(function(x1)
       {
        var _id_,message,line,column;
        _id_=id+Global.String(idx);
        message=x1[2];
        line=x1[0];
        column=x1[1];
        return Clientb.makeAccordionGroup(accordionId,_id_,message,line,column);
       });
      },function(list)
      {
       return List.mapi(mapping,list);
      }),f(lst));
      f1=(action=function(arg00)
      {
       return div.AppendI(arg00);
      },function(list)
      {
       return Seq.iter(action,list);
      });
      return f1(x);
     },
     displayMarkupErrors:function(count,id,lst,selector,accordionId,div)
     {
      Clientb.updateTabHeader(count,selector);
      return Clientb.displayAccordions(id,lst,accordionId,div);
     },
     displayMarkupValidation:function(uriString,div,_div_)
     {
      var x,f,f2;
      x=(f=function()
      {
       var x1,f1;
       x1=Remoting.Async("Website:3",[uriString]);
       f1=function(_arg1)
       {
        var validationResult,doctype,charset,validity;
        if(_arg1.$==1)
         {
          validationResult=_arg1.$0;
          doctype=validationResult.Doctype;
          charset=validationResult.Charset;
          validity=validationResult.Status;
          Clientb.setPText("#doctype",doctype);
          Clientb.setPText("#charset",charset);
          Clientb.setPText("#validity",validity);
          Clientb.displayMarkupErrors(validationResult.ErrorCount,"htmlErrorAccordion",validationResult.Errors,"#htmlErrorsTab","htmlErrorsAccordion",div);
          Clientb.displayMarkupErrors(validationResult.WarningCount,"htmlWarningAccordion",validationResult.Warnings,"#htmlWarningsTab","htmlWarningsAccordion",_div_);
          return Concurrency.Return(null);
         }
        else
         {
          return Concurrency.Return(null);
         }
       };
       return Concurrency.Bind(x1,f1);
      },Concurrency.Delay(f));
      f2=function(arg00)
      {
       var t;
       t={
        $:0
       };
       return Concurrency.Start(arg00);
      };
      return f2(x);
     },
     makeAccordionGroup:function(parent,id,message,line,column)
     {
      var _this,arg00,_this1,arg001,x;
      return Operators.add(Default.Div(List.ofArray([Default.Attr().Class("accordion-group")])),List.ofArray([Operators.add(Default.Div(List.ofArray([Default.Attr().Class("accordion-heading")])),List.ofArray([Operators.add(Default.A(List.ofArray([Default.Attr().Class("accordion-toggle"),(_this=HTML5.Attr(),(arg00="data-"+"toggle",_this.NewAttr(arg00,"collapse"))),(_this1=HTML5.Attr(),(arg001="data-"+"parent",_this1.NewAttr(arg001,parent))),(x="#"+id,Default.HRef(x))])),List.ofArray([Default.Text(message)]))])),Operators.add(Default.Div(List.ofArray([Default.Id(id),Default.Attr().Class("accordion-body collapse")])),List.ofArray([Operators.add(Default.Div(List.ofArray([Default.Attr().Class("accordion-inner")])),List.ofArray([Clientb["makeDiv'"]("Line",line),Clientb["makeDiv'"]("Column",column)]))]))]));
     },
     makeDiv:function(txt,id)
     {
      return Operators.add(Default.Div(List.ofArray([Default.Attr().Class("row-fluid")])),List.ofArray([Operators.add(Default.Div(List.ofArray([Default.Attr().Class("span3")])),List.ofArray([Operators.add(Default.H4(List.ofArray([Default.Attr().Class("h4")])),List.ofArray([Default.Text(txt)]))])),Operators.add(Default.Div(List.ofArray([Default.Attr().Class("span9")])),List.ofArray([Default.P(List.ofArray([Default.Id(id)]))]))]));
     },
     "makeDiv'":function(txt,_txt_)
     {
      return Operators.add(Default.Div(List.ofArray([Default.Attr().Class("row-fluid")])),List.ofArray([Operators.add(Default.Div(List.ofArray([Default.Attr().Class("span3")])),List.ofArray([Operators.add(Default.H4(List.ofArray([Default.Attr().Class("h4")])),List.ofArray([Default.Text(txt)]))])),Operators.add(Default.Div(List.ofArray([Default.Attr().Class("span9")])),List.ofArray([Default.P(List.ofArray([Default.Text(_txt_)]))]))]));
     },
     setPText:function(selector,txt)
     {
      return jQuery(selector).text(txt);
     },
     updateTabHeader:function(count,selector)
     {
      var jquery,text;
      jquery=jQuery(selector);
      text=jquery.text();
      return jquery.text(Strings.concat("",List.ofArray([text," (",count,")"])));
     },
     validatorSection:function()
     {
      var input,_this,_this1,div,_div_,x,_this2,x1,_this3,arg00,_this4,arg001,f,f1;
      input=Default.Input(List.ofArray([(_this=Default.Attr(),_this.NewAttr("type","hidden")),(_this1=Default.Attr(),_this1.NewAttr("value","")),Default.Id("validatorUri")]));
      div=Default.Div(List.ofArray([Default.Attr().Class("accordion"),Default.Id("htmlErrorsAccordion")]));
      _div_=Default.Div(List.ofArray([Default.Attr().Class("accordion"),Default.Id("htmlWarningsAccordion")]));
      x=Operators.add((_this2=HTML5.Tags(),(x1=List.ofArray([Default.Attr().Class("tab-pane fade in reportSection"),Default.Id("validator")]),_this2.NewTag("section",x1))),List.ofArray([input,Clientb.makeDiv("Doctype","doctype"),Default.Hr(Runtime.New(T,{
       $:0
      })),Clientb.makeDiv("Charset","charset"),Default.Hr(Runtime.New(T,{
       $:0
      })),Clientb.makeDiv("Validity","validity"),Default.Hr(Runtime.New(T,{
       $:0
      })),Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tabbable")])),List.ofArray([Operators.add(Default.UL(List.ofArray([Default.Attr().Class("nav nav-pills")])),List.ofArray([Operators.add(Default.LI(List.ofArray([Default.Attr().Class("active")])),List.ofArray([Operators.add(Default.A(List.ofArray([Default.HRef("#htmlErrors"),(_this3=HTML5.Attr(),(arg00="data-"+"toggle",_this3.NewAttr(arg00,"tab"))),Default.Id("htmlErrorsTab")])),List.ofArray([Default.Text("Errors")]))])),Default.LI(List.ofArray([Operators.add(Default.A(List.ofArray([Default.HRef("#htmlWarnings"),(_this4=HTML5.Attr(),(arg001="data-"+"toggle",_this4.NewAttr(arg001,"tab"))),Default.Id("htmlWarningsTab")])),List.ofArray([Default.Text("Warnings")]))]))])),Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tab-content")])),List.ofArray([Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tab-pane active fade in span8"),Default.Id("htmlErrors")])),List.ofArray([div])),Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tab-pane fade span8"),Default.Id("htmlWarnings")])),List.ofArray([_div_]))]))]))]));
      f=(f1=function()
      {
       return jQuery("#validatorUri").change(function()
       {
        var uriString;
        uriString=this.getAttribute("value");
        return Clientb.displayMarkupValidation(uriString,div,_div_);
       });
      },function(w)
      {
       return Operators.OnAfterRender(f1,w);
      });
      f(x);
      return x;
     }
    },
    ValidatorControl:Runtime.Class({
     get_Body:function()
     {
      return Clientb.validatorSection();
     }
    })
   },
   Violations:{
    Client:{
     appendParagraph:function(div,text)
     {
      var p;
      p=Default.P(List.ofArray([Default.Text(text)]));
      return div.AppendI(p);
     },
     displayAccordions:function(id,arr,accordionId,div)
     {
      var x,f,mapping,f1,action;
      x=(f=(mapping=function(idx)
      {
       return Runtime.Tupled(function(x1)
       {
        var _id_,recommendation,line,level,heading,description,column;
        _id_=id+Global.String(idx);
        recommendation=x1[5];
        line=x1[2];
        level=x1[0];
        heading=x1[1];
        description=x1[4];
        column=x1[3];
        return Clientc.makeAccordionGroup(accordionId,_id_,heading,line,column,description,recommendation);
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
     displayViolations:function(violations,id,level,selector,accordionId,div,text)
     {
      var _violations_,matchValue;
      _violations_=Clientc.filterLevel(violations,level);
      Clientc.updateTabHeader(_violations_,selector);
      matchValue=_violations_.length;
      if(matchValue===0)
       {
        return Clientc.appendParagraph(div,text);
       }
      else
       {
        return Clientc.displayAccordions(id,_violations_,accordionId,div);
       }
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
      return Operators.add(Default.Div(List.ofArray([Default.Attr().Class("accordion-group")])),List.ofArray([Operators.add(Default.Div(List.ofArray([Default.Attr().Class("accordion-heading")])),List.ofArray([Operators.add(Default.A(List.ofArray([Default.Attr().Class("accordion-toggle"),(_this=HTML5.Attr(),(arg00="data-"+"toggle",_this.NewAttr(arg00,"collapse"))),(_this1=HTML5.Attr(),(arg001="data-"+"parent",_this1.NewAttr(arg001,parent))),(x="#"+id,Default.HRef(x))])),List.ofArray([Default.Text(heading)]))])),Operators.add(Default.Div(List.ofArray([Default.Id(id),Default.Attr().Class("accordion-body collapse")])),List.ofArray([Operators.add(Default.Div(List.ofArray([Default.Attr().Class("accordion-inner")])),List.ofArray([Clientc.makeDiv("Line",line),Clientc.makeDiv("Column",column),Clientc.makeDiv("Description",description),Clientc.makeDiv("Recommendation",recommendation)]))]))]));
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
      x=Operators.add((_this=HTML5.Tags(),(x1=List.ofArray([Default.Attr().Class("tab-pane fade in reportSection"),Default.Id("violations")]),_this.NewTag("section",x1))),List.ofArray([Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tabbable")])),List.ofArray([Operators.add(Default.UL(List.ofArray([Default.Attr().Class("nav nav-pills")])),List.ofArray([Operators.add(Default.LI(List.ofArray([Default.Attr().Class("active")])),List.ofArray([Operators.add(Default.A(List.ofArray([Default.HRef("#errors"),(_this1=HTML5.Attr(),(arg00="data-"+"toggle",_this1.NewAttr(arg00,"tab"))),Default.Id("errorsTab")])),List.ofArray([Default.Text("Errors")]))])),Default.LI(List.ofArray([Operators.add(Default.A(List.ofArray([Default.HRef("#warnings"),(_this2=HTML5.Attr(),(arg001="data-"+"toggle",_this2.NewAttr(arg001,"tab"))),Default.Id("warningsTab")])),List.ofArray([Default.Text("Warnings")]))]))])),Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tab-content")])),List.ofArray([Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tab-pane active fade in span8"),Default.Id("errors")])),List.ofArray([div])),Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tab-pane fade span8"),Default.Id("warnings")])),List.ofArray([_div_]))]))]))]));
      f=(f1=function()
      {
       var x2,f2,f6;
       x2=(f2=function()
       {
        var x3,f3;
        x3=Remoting.Async("Website:5",[id]);
        f3=function(_arg11)
        {
         var a,violations,_displayViolations_,b,f4,f5;
         a=_arg11.$==1?(violations=_arg11.$0,(_displayViolations_=function(id1,level,selector,accordionId,div1,text)
         {
          return Clientc.displayViolations(violations,id1,level,selector,accordionId,div1,text);
         },(_displayViolations_("errorAccordion","Error","#errorsTab","errorsAccordion",div,"No errors were detected on the page."),(_displayViolations_("WarningAccordion","Warning","#warningsTab","warningsAccordion",_div_,"No warnings were detected on the page."),Concurrency.Return(null))))):(null,Concurrency.Return(null));
         b=(f4=function()
         {
          Client3.updateProgressBar();
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
      return Clientc.violationsSection(this.id);
     }
    })
   }
  }
 });
 Runtime.OnInit(function()
 {
  OpenSEO=Runtime.Safe(Global.OpenSEO);
  AddThis=Runtime.Safe(OpenSEO.AddThis);
  Client=Runtime.Safe(AddThis.Client);
  WebSharper=Runtime.Safe(Global.IntelliFactory.WebSharper);
  Html=Runtime.Safe(WebSharper.Html);
  Default=Runtime.Safe(Html.Default);
  HTML5=Runtime.Safe(Default.HTML5);
  List=Runtime.Safe(WebSharper.List);
  T=Runtime.Safe(List.T);
  DBCleanup=Runtime.Safe(OpenSEO.DBCleanup);
  Client1=Runtime.Safe(DBCleanup.Client);
  Remoting=Runtime.Safe(WebSharper.Remoting);
  alert=Runtime.Safe(Global.alert);
  Concurrency=Runtime.Safe(WebSharper.Concurrency);
  EventsPervasives=Runtime.Safe(Html.EventsPervasives);
  Operators=Runtime.Safe(Html.Operators);
  Details=Runtime.Safe(OpenSEO.Details);
  Client2=Runtime.Safe(Details.Client);
  Utilities=Runtime.Safe(OpenSEO.Utilities);
  Client3=Runtime.Safe(Utilities.Client);
  jQuery=Runtime.Safe(Global.jQuery);
  Headers=Runtime.Safe(OpenSEO.Headers);
  Client4=Runtime.Safe(Headers.Client);
  Arrays=Runtime.Safe(WebSharper.Arrays);
  Keywords=Runtime.Safe(OpenSEO.Keywords);
  Client5=Runtime.Safe(Keywords.Client);
  LatestReports=Runtime.Safe(OpenSEO.LatestReports);
  Client6=Runtime.Safe(LatestReports.Client);
  Links=Runtime.Safe(OpenSEO.Links);
  Client7=Runtime.Safe(Links.Client);
  String=Runtime.Safe(Global.String);
  Strings=Runtime.Safe(WebSharper.Strings);
  Formlet=Runtime.Safe(WebSharper.Formlet);
  Controls=Runtime.Safe(Formlet.Controls);
  Enhance=Runtime.Safe(Formlet.Enhance);
  Data=Runtime.Safe(Formlet.Data);
  Formlet1=Runtime.Safe(Formlet.Formlet);
  window=Runtime.Safe(Global.window);
  Login=Runtime.Safe(OpenSEO.Login);
  Client8=Runtime.Safe(Login.Client);
  Pagespeed=Runtime.Safe(OpenSEO.Pagespeed);
  Client9=Runtime.Safe(Pagespeed.Client);
  Seq=Runtime.Safe(WebSharper.Seq);
  Number=Runtime.Safe(Global.Number);
  Math=Runtime.Safe(Global.Math);
  UrlForm=Runtime.Safe(OpenSEO.UrlForm);
  Clienta=Runtime.Safe(UrlForm.Client);
  google=Runtime.Safe(Global.google);
  visualization=Runtime.Safe(google.visualization);
  PieChart=Runtime.Safe(visualization.PieChart);
  Google=Runtime.Safe(WebSharper.Google);
  Visualization=Runtime.Safe(Google.Visualization);
  Visualizations=Runtime.Safe(Visualization.Visualizations);
  PieChartOptions=Runtime.Safe(Visualizations.PieChartOptions);
  DataTable=Runtime.Safe(visualization.DataTable);
  Validator=Runtime.Safe(OpenSEO.Validator);
  Clientb=Runtime.Safe(Validator.Client);
  Violations=Runtime.Safe(OpenSEO.Violations);
  return Clientc=Runtime.Safe(Violations.Client);
 });
 Runtime.OnLoad(function()
 {
 });
}());
