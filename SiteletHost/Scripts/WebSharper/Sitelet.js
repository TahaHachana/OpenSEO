(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Sitelet,Review,Js,UriPiglet,Details,jQuery,WebSharper,Html,Default,List,HTML5,Operators,Seq,document,google,visualization,DataTable,Hyperlinks,T,PieChart,Keywords,Operators1,Table,Speed,Piglets,Piglet1,Validation,Pervasives,Controls,EventsPervasives,Violations,Headers,Concurrency,$,Remoting,options,String,Strings;
 Runtime.Define(Global,{
  Sitelet:{
   Review:{
    Control:Runtime.Class({
     get_Body:function()
     {
      return UriPiglet.main();
     }
    }),
    Js:{
     Details:{
      displayDetail:function(detail,id,_id_)
      {
       var patternInput,x,length;
       if(detail.$==1)
        {
         x=detail.$0;
         patternInput=[x,x.length];
        }
       else
        {
         patternInput=["NA",0];
        }
       length=patternInput[1];
       Details.setText(id,patternInput[0]);
       return length>0?Details.setText(_id_,"("+Global.String(length)+" characters)"):null;
      },
      displayDetails:function(uriDetails)
      {
       Details.setText("request-uri",uriDetails.RequestUri);
       Details.setText("response-time",Global.String(uriDetails.ResponseTime)+" ms");
       Details.setText("text-html-ratio",Global.String(uriDetails.TextHtmlRatio)+" %");
       Details.displayTitle(uriDetails.Title);
       Details.displayMetaDesc(uriDetails.MetaDescription);
       return Details.displayHeadings(uriDetails.Headings);
      },
      displayHeadings:function(headings)
      {
       var navTabs,tabPanes;
       if(headings.get_Length()===0)
        {
         return Details.setText("headings","NA");
        }
       else
        {
         navTabs=Details.navTabs(headings);
         tabPanes=Details.tabPanes(headings);
         return jQuery("#headings").append(navTabs.Body).append(tabPanes.Body);
        }
      },
      displayMetaDesc:function(metaDescription)
      {
       return Details.displayDetail(metaDescription,"meta-description","meta-description-length");
      },
      displayTitle:function(title)
      {
       return Details.displayDetail(title,"title","title-length");
      },
      navTab:function(isActive,idxString,level)
      {
       var elt,arg10;
       arg10="#headings-tab-"+idxString;
       elt=Default.LI(List.ofArray([Default.A(List.ofArray([Default.Attr().NewAttr("href",arg10),HTML5.Attr().NewAttr("data-"+"toggle","tab"),Default.Text("H"+level)]))]));
       return isActive?Operators.add(elt,List.ofArray([Default.Attr().Class("active")])):elt;
      },
      navTabs:function(headings)
      {
       var x,lis;
       x=Seq.groupBy(function(x1)
       {
        return x1.Level;
       },headings);
       lis=Seq.mapi(function(idx)
       {
        return Runtime.Tupled(function(tupledArg)
        {
         var level,idxString,level1;
         level=tupledArg[0];
         idxString=Global.String(idx+1);
         level1=Global.String(level);
         return idx===0?Details.navTab(true,idxString,level1):Details.navTab(false,idxString,level1);
        });
       },Seq.sortBy(Runtime.Tupled(function(tupledArg)
       {
        return tupledArg[0];
       }),x));
       return Operators.add(Default.UL(List.ofArray([Default.Attr().Class("nav nav-tabs")])),lis);
      },
      setText:function(id,text)
      {
       document.getElementById(id).textContent=text;
      },
      tabPane:function(isActive,idxString,headings)
      {
       var elt,arg10;
       elt=Default.Div(List.ofArray([Operators.add(Default.UL(List.ofArray([Default.Attr().Class("list-group")])),Seq.toList(Seq.delay(function()
       {
        return Seq.map(function(x)
        {
         return Default.LI(List.ofArray([Default.Attr().Class("list-group-item"),Default.Text(x.Text)]));
        },headings);
       })))]));
       arg10="headings-tab-"+idxString;
       return Operators.add(isActive?Operators.add(elt,List.ofArray([Default.Attr().Class("tab-pane fade in active")])):Operators.add(elt,List.ofArray([Default.Attr().Class("tab-pane fade")])),List.ofArray([Default.Attr().NewAttr("id",arg10)]));
      },
      tabPanes:function(headings)
      {
       var x,divs;
       x=Seq.groupBy(function(x1)
       {
        return x1.Level;
       },headings);
       divs=Seq.mapi(function(idx)
       {
        return Runtime.Tupled(function(tupledArg)
        {
         var headings1,idxString;
         headings1=tupledArg[1];
         idxString=Global.String(idx+1);
         return idx===0?Details.tabPane(true,idxString,headings1):Details.tabPane(false,idxString,headings1);
        });
       },Seq.sortBy(Runtime.Tupled(function(tupledArg)
       {
        return tupledArg[0];
       }),x));
       return Operators.add(Default.Div(List.ofArray([Default.Attr().Class("tab-content")])),divs);
      }
     },
     Headers:{
      displayHeaders:function(headers)
      {
       var elt;
       elt=Operators.add(Default.Table(List.ofArray([Default.Attr().Class("table table-hover")])),Seq.toList(Seq.delay(function()
       {
        return Seq.append([Default.TR(List.ofArray([Default.TH(List.ofArray([Default.Text("Key")])),Default.TH(List.ofArray([Default.Text("Value")]))]))],Seq.delay(function()
        {
         return Seq.collect(function(x)
         {
          return Seq.map(function(y)
          {
           return Default.TR(List.ofArray([Default.TD(List.ofArray([Default.Text(x.Key)])),Default.TD(List.ofArray([Default.Text(y)]))]));
          },x.Values);
         },headers);
        }));
       })));
       document.getElementById("headers-panel-body").appendChild(elt.Body);
       return;
      }
     },
     Hyperlinks:{
      dataTable:function(column,_column_,rows)
      {
       var table;
       table=new DataTable();
       table.addColumn("string",column);
       table.addColumn("number",_column_);
       table.addRows(rows.get_Length());
       Seq.iteri(function(idx)
       {
        return Runtime.Tupled(function(tupledArg)
        {
         var y;
         y=tupledArg[1];
         table.setCell(idx,0,tupledArg[0]);
         return table.setCell(idx,1,y);
        });
       },rows);
       return table;
      },
      displayHyperlinks:function(hyperlinks)
      {
       var patternInput,internal,external,patternInput1,nofollow,follow;
       patternInput=List.partition(function(x)
       {
        return x.Type==="External";
       },hyperlinks);
       internal=patternInput[1];
       external=patternInput[0];
       patternInput1=List.partition(function(x)
       {
        return x.Rel==="Follow";
       },hyperlinks);
       nofollow=patternInput1[1];
       follow=patternInput1[0];
       Hyperlinks.updateTabHeader("internal-links",Global.String(internal.get_Length()));
       Hyperlinks.updateTabHeader("external-links",Global.String(external.get_Length()));
       document.getElementById("internal-links-table").appendChild(Hyperlinks.table(internal).Body);
       document.getElementById("external-links-table").appendChild(Hyperlinks.table(external).Body);
       Hyperlinks.displayStats("Hyperlinks Type","Count",List.ofArray([["External",external.get_Length()],["Internal",internal.get_Length()]]),"external-internal-tab");
       return Hyperlinks.displayStats("Hyperlinks Rel","Count",List.ofArray([["Follow",follow.get_Length()],["NoFollow",nofollow.get_Length()]]),"follow-nofollow-tab");
      },
      displayStats:function(column,_column_,rows,id)
      {
       var x;
       x=Hyperlinks.drawPie(Hyperlinks.dataTable(column,_column_,rows));
       document.getElementById(id).appendChild(x.Body);
       return;
      },
      drawPie:function(dataTable)
      {
       var div;
       div=Default.Div(Runtime.New(T,{
        $:0
       }));
       (new PieChart(div.Body)).draw(dataTable,{
        height:600,
        width:600
       });
       return div;
      },
      table:function(hyperlinks)
      {
       return Operators.add(Default.Table(List.ofArray([Default.Attr().Class("table table-hover")])),Seq.toList(Seq.delay(function()
       {
        return Seq.append([Default.TR(List.ofArray([Default.TH(List.ofArray([Default.Text("URL")])),Default.TH(List.ofArray([Default.Text("Anchor")])),Default.TH(List.ofArray([Default.Text("Rel")]))]))],Seq.delay(function()
        {
         return Seq.map(function(x)
         {
          return Default.TR(List.ofArray([Default.TD(List.ofArray([Default.A(List.ofArray([Default.HRef(x.UriString),Default.Text(x.UriString)]))])),Default.TD(List.ofArray([Default.Text(x.Anchor)])),Default.TD(List.ofArray([Default.Text(x.Rel)]))]));
         },hyperlinks);
        }));
       })));
      },
      updateTabHeader:function(tabId,str)
      {
       var elt;
       elt=document.getElementById(tabId);
       elt.textContent=elt.textContent+" ("+str+")";
       return;
      }
     },
     Keywords:{
      dataTable:function(keywords)
      {
       var table;
       table=new DataTable();
       table.addColumn("string","Combination");
       table.addColumn("number","Occurrence");
       table.addColumn("number","Density");
       table.addRows(keywords.get_Length());
       Seq.iteri(function(idx)
       {
        return function(x)
        {
         table.setCell(idx,0,x.Combination);
         table.setCell(idx,1,x.Occurrence);
         return table.setCell(idx,2,x.Density);
        };
       },keywords);
       return table;
      },
      displayKeywords:function(keywords)
      {
       return Seq.iter(function(x)
       {
        return Keywords.keywordsTable(Keywords.filterCount(keywords,x),"keywords-tab-"+Global.String(x));
       },Seq.toList(Operators1.range(1,3)));
      },
      filterCount:function(keywords,count)
      {
       return List.filter(function(x)
       {
        return x.WordsCount===count;
       },keywords);
      },
      keywordsTable:function(keywords,divId)
      {
       var data,tableElt;
       data=Keywords.dataTable(keywords);
       tableElt=Default.Div(Runtime.New(T,{
        $:0
       }));
       (new Table(tableElt.Body)).draw(data,{
        sortAscending:false,
        sortColumn:1,
        width:"600px"
       });
       document.getElementById(divId).appendChild(tableElt.Body);
       return;
      }
     },
     Speed:{
      displayBytesStats:function(stats)
      {
       return Hyperlinks.displayStats("Bytes","Size",List.ofArray([["CSS",stats.CssBytes],["Flash",stats.FlashBytes],["HTML",stats.HtmlBytes],["Image",stats.ImageBytes],["Other",stats.OtherBytes],["Text",stats.TextBytes]]),"bytes-stats");
      },
      displayResourcesStats:function(stats)
      {
       Details.setText("hosts",Global.String(stats.Hosts));
       Details.setText("css-resources",Global.String(stats.CssResources));
       Details.setText("js-resources",Global.String(stats.JsResources));
       Details.setText("static-resources",Global.String(stats.StaticResources));
       return Details.setText("total-resources",Global.String(stats.TotalResources));
      },
      displayScore:function(speedReview)
      {
       return Details.setText("speed-score",Global.String(speedReview.Score)+" / 100");
      },
      displayScreenshot:function(review)
      {
       var elt,arg10,arg101;
       arg10=review.Uri;
       arg101=review.Screenshot;
       elt=Operators.add(Default.A(List.ofArray([Default.Attr().NewAttr("href",arg10),Default.Attr().NewAttr("target","_blank")])),List.ofArray([Default.Img(List.ofArray([Default.Attr().Class("img-responsive img-thumbnail"),Default.Attr().NewAttr("src",arg101)]))]));
       document.getElementById("screenshot").appendChild(elt.Body);
       return;
      },
      displaySuggestions:function(suggestions)
      {
       var accordion,lst;
       accordion=document.getElementById("suggestions-accordion");
       lst=List.filter(function(x)
       {
        return x.Impact>0;
       },suggestions);
       Hyperlinks.updateTabHeader("suggestions-nav-tab",Global.String(lst.get_Length()));
       return Seq.iteri(function(idx)
       {
        return function(x)
        {
         accordion.appendChild(Speed.suggestionPanel(x,idx).Body);
        };
       },lst);
      },
      suggestionPanel:function(suggestion,idx)
      {
       var idxString,arg10;
       idxString=Global.String(idx);
       arg10="suggestion-"+Global.String(idx);
       return Operators.add(Default.Div(List.ofArray([Default.Attr().Class("panel panel-default")])),List.ofArray([Operators.add(Default.Div(List.ofArray([Default.Attr().Class("panel-heading")])),List.ofArray([Operators.add(Default.H4(List.ofArray([Default.Attr().Class("panel-title")])),List.ofArray([Default.A(List.ofArray([Default.HRef("#suggestion-"+idxString),HTML5.Attr().NewAttr("data-"+"toggle","collapse"),HTML5.Attr().NewAttr("data-"+"parent","#suggestions-accordion"),Default.Text(suggestion.Name)]))]))])),Operators.add(Default.Div(List.ofArray([Default.Attr().Class("panel-collapse collapse"),Default.Attr().NewAttr("id",arg10)])),List.ofArray([Operators.add(Default.Div(List.ofArray([Default.Attr().Class("panel-body")])),Seq.toList(Seq.delay(function()
       {
        return Seq.map(function(x)
        {
         return Default.Div(List.ofArray([Default.Div(Seq.toList(Seq.delay(function()
         {
          var matchValue,arg101;
          matchValue=x.Hyperlink;
          if(matchValue.$==1)
           {
            arg101=matchValue.$0;
            return[Default.A(List.ofArray([Default.Attr().NewAttr("href",arg101),Default.Attr().NewAttr("target","_blank"),Default.Text(x.Header)]))];
           }
          else
           {
            return[Default.Text(x.Header)];
           }
         }))),Default.UL(Seq.toList(Seq.delay(function()
         {
          return Seq.map(function(url)
          {
           return Default.LI(List.ofArray([Default.Text(url)]));
          },x.Urls);
         })))]));
        },suggestion.Details);
       })))]))]));
      }
     },
     UriPiglet:{
      main:function()
      {
       return Piglet1.Render(function(uri)
       {
        return function(submit)
        {
         return UriPiglet.view(uri,submit);
        };
       },Piglet1.Run(function(uriString)
       {
        return Js.review(uriString);
       },UriPiglet.piglet("")));
      },
      piglet:function(init)
      {
       return Piglet1.WithSubmit(Validation.Is(function(value)
       {
        return Validation.NotEmpty(value);
       },"Please enter a valid URL.",Pervasives.op_LessMultiplyGreater(Piglet1.Return(function(x)
       {
        return x;
       }),Piglet1.Yield(init))));
      },
      view:function(uri,submit)
      {
       var x,arg00;
       x=Operators.add(Controls.input("text",function(x1)
       {
        return x1;
       },function(x1)
       {
        return x1;
       },uri),List.ofArray([Default.Attr().Class("form-control"),Default.Attr().NewAttr("id","uri"),HTML5.Attr().NewAttr("autofocus","autofocus"),HTML5.Attr().NewAttr("placeholder","example.com")]));
       arg00=function()
       {
        return function(key)
        {
         if(key.KeyCode===13)
          {
           jQuery("#uri").blur();
           return jQuery("#review-btn").click();
          }
         else
          {
           return null;
          }
        };
       };
       EventsPervasives.Events().OnKeyUp(arg00,x);
       return Operators.add(Default.Div(List.ofArray([Default.Attr().Class("input-group input-group-lg"),Default.Attr().NewAttr("id","uri-input")])),List.ofArray([x,Operators.add(Default.Span(List.ofArray([Default.Attr().Class("input-group-btn")])),List.ofArray([Operators.add(Controls.SubmitValidate(submit),List.ofArray([Default.Attr().Class("btn btn-primary"),Default.Attr().NewAttr("id","review-btn"),Default.Attr().NewAttr("value","Review"),HTML5.Attr().NewAttr("data-"+"loading-text","Please wait...")]))]))]));
      }
     },
     Violations:{
      displayErrors:function(errors)
      {
       return Violations["displayViolations'"]("errors-nav-tab",errors,"errors-accordion");
      },
      displayViolations:function(violations,id)
      {
       var accordion;
       accordion=document.getElementById(id);
       return Seq.iteri(function(idx)
       {
        return function(x)
        {
         var matchValue,patternInput,p;
         matchValue=x.Position;
         if(matchValue.$==1)
          {
           p=matchValue.$0;
           patternInput=[Global.String(p.Line),Global.String(p.Column)];
          }
         else
          {
           patternInput=["NA","NA"];
          }
         accordion.appendChild(Violations.violationPanel(x,idx,id,patternInput[0],patternInput[1]).Body);
         return;
        };
       },violations);
      },
      "displayViolations'":function(tabId,violations,accordion)
      {
       Hyperlinks.updateTabHeader(tabId,Global.String(violations.get_Length()));
       return Violations.displayViolations(violations,accordion);
      },
      displayWarnings:function(warnings)
      {
       return Violations["displayViolations'"]("warnings-nav-tab",warnings,"warnings-accordion");
      },
      seoInfo:function(heading,text)
      {
       return Operators.add(Default.Div(List.ofArray([Default.Attr().Class("row seo-info")])),List.ofArray([Default.Div(List.ofArray([Default.Attr().Class("col-md-3 row-heading"),Default.Text(heading)])),Default.Div(List.ofArray([Default.Attr().Class("col-md-9"),Default.Text(text)]))]));
      },
      violationPanel:function(violation,idx,id,line,column)
      {
       var idxString,arg10,arg101;
       idxString=Global.String(idx);
       arg10="#"+id;
       arg101="error-"+idxString;
       return Operators.add(Default.Div(List.ofArray([Default.Attr().Class("panel panel-default")])),List.ofArray([Operators.add(Default.Div(List.ofArray([Default.Attr().Class("panel-heading")])),List.ofArray([Operators.add(Default.H4(List.ofArray([Default.Attr().Class("panel-title")])),List.ofArray([Default.A(List.ofArray([Default.HRef("#error-"+idxString),HTML5.Attr().NewAttr("data-"+"toggle","collapse"),HTML5.Attr().NewAttr("data-"+"parent",arg10),Default.Text(violation.Heading)]))]))])),Operators.add(Default.Div(List.ofArray([Default.Attr().Class("panel-collapse collapse"),Default.Attr().NewAttr("id",arg101)])),List.ofArray([Operators.add(Default.Div(List.ofArray([Default.Attr().Class("panel-body")])),List.ofArray([Violations.seoInfo("Line",line),Violations.seoInfo("Column",column),Violations.seoInfo("Description",violation.Description),Violations.seoInfo("Recommendation",violation.Recommendation)]))]))]));
      }
     },
     displayReview:function(review)
     {
      var uriDetails,matchValue;
      uriDetails=review.Details;
      Details.displayDetails(uriDetails);
      Keywords.displayKeywords(review.Keywords);
      Hyperlinks.displayHyperlinks(review.Hyperlinks);
      Violations.displayErrors(review.Errors);
      Violations.displayWarnings(review.Warnings);
      Headers.displayHeaders(review.Headers);
      matchValue=review.Speed;
      if(matchValue.$==1)
       {
        Js.displaySpeedReview(matchValue.$0);
       }
      return Js.showReview(uriDetails.RequestUri);
     },
     displaySpeedReview:function(speedReview)
     {
      var stats;
      Speed.displayScreenshot(speedReview);
      Speed.displayScore(speedReview);
      Speed.displaySuggestions(speedReview.Rules);
      stats=speedReview.Stats;
      Speed.displayResourcesStats(stats);
      return Speed.displayBytesStats(stats);
     },
     review:function(uriString)
     {
      return Concurrency.Start(Concurrency.Delay(function()
      {
       jQuery("#alert").hide();
       $("#review-btn").button("loading");
       return Concurrency.Bind(Remoting.Async("Sitelet:0",[uriString]),function(_arg1)
       {
        if(_arg1.$==1)
         {
          Js.showAlert("Downloading the URL failed.");
          return Concurrency.Return(null);
         }
        else
         {
          if(_arg1.$==2)
           {
            Js.showAlert("The URL is not a HTML page.");
            return Concurrency.Return(null);
           }
          else
           {
            if(_arg1.$==3)
             {
              Js.displayReview(_arg1.$0);
              return Concurrency.Return(null);
             }
            else
             {
              Js.showAlert("The URL is invalid.");
              return Concurrency.Return(null);
             }
           }
         }
       });
      }));
     },
     showAlert:function(alert)
     {
      var elt,btn;
      $("#review-btn").button("reset");
      btn=Default.Button(List.ofArray([Default.Attr().Class("close"),Default.Attr().NewAttr("aria-hidden","true"),Default.Attr().NewAttr("type","button"),HTML5.Attr().NewAttr("data-"+"dismiss","alert")]));
      btn.set_Html("&times;");
      elt=Operators.add(Default.Div(List.ofArray([Default.Attr().Class("alert alert-danger"),Default.Attr().NewAttr("id","alert")])),List.ofArray([btn,Default.Div(List.ofArray([Default.Text(alert)]))]));
      return jQuery(".jumbotron").append(elt.Body);
     },
     showReview:function(requestUri)
     {
      var pageHeaderJq;
      pageHeaderJq=jQuery("#page-header");
      if(requestUri.length<=30)
       {
        pageHeaderJq.text("Review of "+requestUri);
       }
      else
       {
        pageHeaderJq.text("Review of "+Js.trimUri(requestUri)).attr("title",requestUri);
        $("#page-header").tooltip(options);
       }
      jQuery("#jumbotron").remove();
      jQuery("#review").fadeIn();
      return $("body").scrollspy({
       target:"#affix-nav"
      });
     },
     substring:function(str,length)
     {
      var mapping;
      mapping=function(value)
      {
       return String.fromCharCode(value);
      };
      return Strings.concat("",Seq.map(function(value)
      {
       return String.fromCharCode(value);
      },Seq.take(15,str)))+"..."+Strings.concat("",Seq.map(mapping,Seq.skip(length-15,str)));
     },
     trimUri:function(uriString)
     {
      var length;
      length=uriString.length;
      return length<=30?uriString:Js.substring(uriString,length);
     }
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Sitelet=Runtime.Safe(Global.Sitelet);
  Review=Runtime.Safe(Sitelet.Review);
  Js=Runtime.Safe(Review.Js);
  UriPiglet=Runtime.Safe(Js.UriPiglet);
  Details=Runtime.Safe(Js.Details);
  jQuery=Runtime.Safe(Global.jQuery);
  WebSharper=Runtime.Safe(Global.IntelliFactory.WebSharper);
  Html=Runtime.Safe(WebSharper.Html);
  Default=Runtime.Safe(Html.Default);
  List=Runtime.Safe(WebSharper.List);
  HTML5=Runtime.Safe(Default.HTML5);
  Operators=Runtime.Safe(Html.Operators);
  Seq=Runtime.Safe(WebSharper.Seq);
  document=Runtime.Safe(Global.document);
  google=Runtime.Safe(Global.google);
  visualization=Runtime.Safe(google.visualization);
  DataTable=Runtime.Safe(visualization.DataTable);
  Hyperlinks=Runtime.Safe(Js.Hyperlinks);
  T=Runtime.Safe(List.T);
  PieChart=Runtime.Safe(visualization.PieChart);
  Keywords=Runtime.Safe(Js.Keywords);
  Operators1=Runtime.Safe(WebSharper.Operators);
  Table=Runtime.Safe(visualization.Table);
  Speed=Runtime.Safe(Js.Speed);
  Piglets=Runtime.Safe(WebSharper.Piglets);
  Piglet1=Runtime.Safe(Piglets.Piglet1);
  Validation=Runtime.Safe(Piglet1.Validation);
  Pervasives=Runtime.Safe(Piglets.Pervasives);
  Controls=Runtime.Safe(Piglets.Controls);
  EventsPervasives=Runtime.Safe(Html.EventsPervasives);
  Violations=Runtime.Safe(Js.Violations);
  Headers=Runtime.Safe(Js.Headers);
  Concurrency=Runtime.Safe(WebSharper.Concurrency);
  $=Runtime.Safe(Global.$);
  Remoting=Runtime.Safe(WebSharper.Remoting);
  options=Runtime.Safe(Global.options);
  String=Runtime.Safe(Global.String);
  return Strings=Runtime.Safe(WebSharper.Strings);
 });
 Runtime.OnLoad(function()
 {
  return;
 });
}());
