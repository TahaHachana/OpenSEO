(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,WebSharper,Google,Visualization,Events,Control,FSharpEvent,google;
 Runtime.Define(Global,{
  IntelliFactory:{
   WebSharper:{
    Google:{
     Visualization:{
      Events:{
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
        ev=FSharpEvent.New();
        google.visualization.events.addListener(target,eventName,function(arg00)
        {
         return ev.event.Trigger(arg00);
        });
        return ev.event;
       }
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
  Events=Runtime.Safe(Visualization.Events);
  Control=Runtime.Safe(WebSharper.Control);
  FSharpEvent=Runtime.Safe(Control.FSharpEvent);
  return google=Runtime.Safe(Global.google);
 });
 Runtime.OnLoad(function()
 {
  return;
 });
}());
