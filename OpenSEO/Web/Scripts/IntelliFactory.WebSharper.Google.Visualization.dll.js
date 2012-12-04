(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,WebSharper,Google,Visualization,Base,Cell,Events,Control,_FSharpEvent_1,google;
 Runtime.Define(Global,{
  IntelliFactory:{
   WebSharper:{
    Google:{
     Visualization:{
      Base:{
       Cell:Runtime.Class({},{
        Value:function(value)
        {
         var inputRecord;
         inputRecord=Cell.get_Empty();
         return Runtime.New(Cell,{
          v:value,
          f:inputRecord.f,
          p:inputRecord.p
         });
        },
        get_Empty:function()
        {
         return{};
        }
       }),
       Helpers:{
        X:function()
        {
        }
       }
      },
      Events:{
       AnnotatedTimeLine:Runtime.Class({},{
        RangeChange:function(visualization)
        {
         return Events.event(visualization,"rangechange");
        },
        Ready:function(visualization)
        {
         return Events.event(visualization,"ready");
        },
        Select:function(visualization)
        {
         return Events.event(visualization,"select");
        }
       }),
       AreaChart:Runtime.Class({},{
        OnMouseOut:function(visualization)
        {
         return Events.event(visualization,"onmouseout");
        },
        OnMouseOver:function(visualization)
        {
         return Events.event(visualization,"onmouseover");
        },
        Ready:function(visualization)
        {
         return Events.event(visualization,"ready");
        },
        Select:function(visualization)
        {
         return Events.event(visualization,"select");
        }
       }),
       BarChart:Runtime.Class({},{
        OnMouseOut:function(visualization)
        {
         return Events.event(visualization,"onmouseout");
        },
        OnMouseOver:function(visualization)
        {
         return Events.event(visualization,"onmouseover");
        },
        Ready:function(visualization)
        {
         return Events.event(visualization,"ready");
        },
        Select:function(visualization)
        {
         return Events.event(visualization,"select");
        }
       }),
       ColumnChart:Runtime.Class({},{
        OnMouseOut:function(visualization)
        {
         return Events.event(visualization,"onmouseout");
        },
        OnMouseOver:function(visualization)
        {
         return Events.event(visualization,"onmouseover");
        },
        Ready:function(visualization)
        {
         return Events.event(visualization,"ready");
        },
        Select:function(visualization)
        {
         return Events.event(visualization,"select");
        }
       }),
       GeoMap:Runtime.Class({},{
        DrawingDone:function(visualization)
        {
         return Events.event(visualization,"drawingDone");
        },
        RegionClick:function(visualization)
        {
         return Events.event(visualization,"regionClick");
        },
        Select:function(visualization)
        {
         return Events.event(visualization,"select");
        },
        ZoomOut:function(visualization)
        {
         return Events.event(visualization,"zoomOut");
        }
       }),
       IntensityMap:Runtime.Class({},{
        Ready:function(visualization)
        {
         return Events.event(visualization,"Ready");
        },
        Select:function(visualization)
        {
         return Events.event(visualization,"select");
        }
       }),
       LineChart:Runtime.Class({},{
        OnMouseOut:function(visualization)
        {
         return Events.event(visualization,"onmouseout");
        },
        OnMouseOver:function(visualization)
        {
         return Events.event(visualization,"onmouseover");
        },
        Ready:function(visualization)
        {
         return Events.event(visualization,"ready");
        },
        Select:function(visualization)
        {
         return Events.event(visualization,"select");
        }
       }),
       MotionChart:Runtime.Class({},{
        Ready:function(visualization)
        {
         return Events.event(visualization,"ready");
        },
        StateChange:function(visualization)
        {
         return Events.event(visualization,"statechange");
        }
       }),
       OrgChart:Runtime.Class({},{
        Collapse:function(visualization)
        {
         return Events.event(visualization,"collapse");
        },
        OnMouseOut:function(visualization)
        {
         return Events.event(visualization,"onmouseout");
        },
        OnMouseOver:function(visualization)
        {
         return Events.event(visualization,"onmouseover");
        },
        Ready:function(visualization)
        {
         return Events.event(visualization,"ready");
        },
        Select:function(visualization)
        {
         return Events.event(visualization,"select");
        }
       }),
       PieChart:Runtime.Class({},{
        OnMouseOut:function(visualization)
        {
         return Events.event(visualization,"onmouseout");
        },
        OnMouseOver:function(visualization)
        {
         return Events.event(visualization,"onmouseover");
        },
        Ready:function(visualization)
        {
         return Events.event(visualization,"ready");
        },
        Select:function(visualization)
        {
         return Events.event(visualization,"select");
        }
       }),
       ScatterChart:Runtime.Class({},{
        OnMouseOut:function(visualization)
        {
         return Events.event(visualization,"onmouseout");
        },
        OnMouseOver:function(visualization)
        {
         return Events.event(visualization,"onmouseover");
        },
        Ready:function(visualization)
        {
         return Events.event(visualization,"ready");
        },
        Select:function(visualization)
        {
         return Events.event(visualization,"select");
        }
       }),
       Table:Runtime.Class({},{
        Page:function(visualization)
        {
         return Events.event(visualization,"page");
        },
        Ready:function(visualization)
        {
         return Events.event(visualization,"ready");
        },
        Select:function(visualization)
        {
         return Events.event(visualization,"select");
        },
        Sort:function(visualization)
        {
         return Events.event(visualization,"sort");
        }
       }),
       TreeMap:Runtime.Class({},{
        OnMouseOut:function(visualization)
        {
         return Events.event(visualization,"onmouseout");
        },
        OnMouseOver:function(visualization)
        {
         return Events.event(visualization,"onmouseover");
        },
        Ready:function(visualization)
        {
         return Events.event(visualization,"ready");
        },
        Select:function(visualization)
        {
         return Events.event(visualization,"select");
        }
       }),
       event:function(target,eventName)
       {
        var ev;
        ev=_FSharpEvent_1.New();
        google.visualization.events.addListener(target,eventName,function(arg00)
        {
         return ev.event.Trigger(arg00);
        });
        return ev.event;
       }
      },
      Formatters:{
       BarFormatOptions:Runtime.Class({},{
        get_Default:function()
        {
         return{};
        }
       }),
       DateFormatOptions:Runtime.Class({},{
        get_Default:function()
        {
         return{};
        }
       })
      },
      Visualizations:{
       AnnotatedTimeLineOptions:Runtime.Class({},{
        get_Default:function()
        {
         return{};
        }
       }),
       AreaChartOptions:Runtime.Class({},{
        get_Default:function()
        {
         return{};
        }
       }),
       BarChartOptions:Runtime.Class({},{
        get_Default:function()
        {
         return{};
        }
       }),
       ColumnChartOptions:Runtime.Class({},{
        get_Default:function()
        {
         return{};
        }
       }),
       GaugeOptions:Runtime.Class({},{
        get_Default:function()
        {
         return{};
        }
       }),
       GeoMapOptions:Runtime.Class({},{
        get_Default:function()
        {
         return{};
        }
       }),
       IntensityMapOptions:Runtime.Class({},{
        get_Default:function()
        {
         return{};
        }
       }),
       LineChartOptions:Runtime.Class({},{
        get_Default:function()
        {
         return{};
        }
       }),
       MotionChartOptions:Runtime.Class({},{
        get_Default:function()
        {
         return{};
        }
       }),
       OrgChartOptions:Runtime.Class({},{
        get_Default:function()
        {
         return{};
        }
       }),
       PieChartOptions:Runtime.Class({},{
        get_Default:function()
        {
         return{};
        }
       }),
       ScatterChartOptions:Runtime.Class({},{
        get_Default:function()
        {
         return{};
        }
       }),
       TableCSSClasses:Runtime.Class({},{
        get_Default:function()
        {
         return{};
        }
       }),
       TableOptions:Runtime.Class({},{
        get_Default:function()
        {
         return{};
        }
       })
      }
     }
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  WebSharper=Runtime.Safe(Global.IntelliFactory.WebSharper);
  Google=Runtime.Safe(WebSharper.Google);
  Visualization=Runtime.Safe(Google.Visualization);
  Base=Runtime.Safe(Visualization.Base);
  Cell=Runtime.Safe(Base.Cell);
  Events=Runtime.Safe(Visualization.Events);
  Control=Runtime.Safe(WebSharper.Control);
  _FSharpEvent_1=Runtime.Safe(Control["FSharpEvent`1"]);
  return google=Runtime.Safe(Global.google);
 });
 Runtime.OnLoad(function()
 {
 });
}());
