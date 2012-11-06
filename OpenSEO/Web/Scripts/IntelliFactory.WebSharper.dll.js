(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,WebSharper,Arrays,Operators,Array,Seq,Unchecked,Enumerator,Number,Char,Util,Concurrency,setTimeout,Date,Scheduler,DateTime,Json,JavaScript,List,T,Error,Math,Remoting,XhrProvider,JSON,Enumerable,Strings,String,RegExp,Pervasives;
 Runtime.Define(Global,{
  IntelliFactory:{
   WebSharper:{
    Arrays:{
     blit:function(arr1,start1,arr2,start2,length)
     {
      var i;
      Arrays.checkRange(arr1,start1,length);
      Arrays.checkRange(arr2,start2,length);
      for(i=0;i<=length-1;i++){
       arr2[start2+i]=arr1[start1+i];
      }
     },
     checkLength:function(arr1,arr2)
     {
      if(arr1.length!==arr2.length)
       {
        return Operators.FailWith("Arrays differ in length.");
       }
      else
       {
        return null;
       }
     },
     checkRange:function(arr,start,size)
     {
      if((size<0?true:start<0)?true:arr.length<start+size)
       {
        return Operators.FailWith("Index was outside the bounds of the array.");
       }
      else
       {
        return null;
       }
     },
     choose:function(f,arr)
     {
      var q,i,matchValue,x;
      q=[];
      for(i=0;i<=arr.length-1;i++){
       matchValue=f(arr[i]);
       if(matchValue.$==0)
        {
        }
       else
        {
         x=matchValue.$0;
         q.push(x);
        }
      }
      return q;
     },
     collect:function(f,x)
     {
      return Array.prototype.concat.apply([],Arrays.map(f,x));
     },
     concat:function(xs)
     {
      return Array.prototype.concat.apply([],Arrays.ofSeq(xs));
     },
     create:function(size,value)
     {
      var r,i;
      r=Array(size);
      for(i=0;i<=size-1;i++){
       r[i]=value;
      }
      return r;
     },
     exists2:function(f,arr1,arr2)
     {
      Arrays.checkLength(arr1,arr2);
      return Seq.exists2(f,arr1,arr2);
     },
     fill:function(arr,start,length,value)
     {
      var i;
      Arrays.checkRange(arr,start,length);
      for(i=start;i<=start+length-1;i++){
       arr[i]=value;
      }
     },
     filter:function(f,arr)
     {
      var r,i;
      r=[];
      for(i=0;i<=arr.length-1;i++){
       if(f(arr[i]))
        {
         r.push(arr[i]);
        }
      }
      return r;
     },
     fold:function(f,zero,arr)
     {
      var acc,i;
      acc=[zero];
      for(i=0;i<=arr.length-1;i++){
       acc[0]=(f(acc[0]))(arr[i]);
      }
      return acc[0];
     },
     fold2:function(f,zero,arr1,arr2)
     {
      var accum,i;
      Arrays.checkLength(arr1,arr2);
      accum=[zero];
      for(i=0;i<=arr1.length-1;i++){
       accum[0]=((f(accum[0]))(arr1[i]))(arr2[i]);
      }
      return accum[0];
     },
     foldBack:function(f,arr,zero)
     {
      var acc,len,i;
      acc=[zero];
      len=arr.length;
      for(i=1;i<=len;i++){
       acc[0]=(f(arr[len-i]))(acc[0]);
      }
      return acc[0];
     },
     foldBack2:function(f,arr1,arr2,zero)
     {
      var len,accum,i;
      Arrays.checkLength(arr1,arr2);
      len=arr1.length;
      accum=[zero];
      for(i=1;i<=len;i++){
       accum[0]=((f(arr1[len-i]))(arr2[len-i]))(accum[0]);
      }
      return accum[0];
     },
     forall2:function(f,arr1,arr2)
     {
      Arrays.checkLength(arr1,arr2);
      return Seq.forall2(f,arr1,arr2);
     },
     init:function(size,f)
     {
      var r,i;
      if(size<0)
       {
        Operators.FailWith("Negative size given.");
       }
      r=Array(size);
      for(i=0;i<=size-1;i++){
       r[i]=f(i);
      }
      return r;
     },
     iter:function(f,arr)
     {
      var i;
      for(i=0;i<=arr.length-1;i++){
       f(arr[i]);
      }
     },
     iter2:function(f,arr1,arr2)
     {
      var i;
      Arrays.checkLength(arr1,arr2);
      for(i=0;i<=arr1.length-1;i++){
       (f(arr1[i]))(arr2[i]);
      }
     },
     iteri:function(f,arr)
     {
      var i;
      for(i=0;i<=arr.length-1;i++){
       (f(i))(arr[i]);
      }
     },
     iteri2:function(f,arr1,arr2)
     {
      var i;
      Arrays.checkLength(arr1,arr2);
      for(i=0;i<=arr1.length-1;i++){
       ((f(i))(arr1[i]))(arr2[i]);
      }
     },
     map:function(f,arr)
     {
      var r,i;
      r=Array(arr.length);
      for(i=0;i<=arr.length-1;i++){
       r[i]=f(arr[i]);
      }
      return r;
     },
     map2:function(f,arr1,arr2)
     {
      var r,i;
      Arrays.checkLength(arr1,arr2);
      r=Array(arr2.length);
      for(i=0;i<=arr2.length-1;i++){
       r[i]=(f(arr1[i]))(arr2[i]);
      }
      return r;
     },
     mapi:function(f,arr)
     {
      var y,i;
      y=Array(arr.length);
      for(i=0;i<=arr.length-1;i++){
       y[i]=(f(i))(arr[i]);
      }
      return y;
     },
     mapi2:function(f,arr1,arr2)
     {
      var res,i;
      Arrays.checkLength(arr1,arr2);
      res=Array(arr1.length);
      for(i=0;i<=arr1.length-1;i++){
       res[i]=((f(i))(arr1[i]))(arr2[i]);
      }
      return res;
     },
     max:function(x)
     {
      return Arrays.reduce(function(e1)
      {
       return function(e2)
       {
        return Operators.Max(e1,e2);
       };
      },x);
     },
     maxBy:function(f,arr)
     {
      return Arrays.reduce(function(x)
      {
       return function(y)
       {
        if(Unchecked.Compare(f(x),f(y))===1)
         {
          return x;
         }
        else
         {
          return y;
         }
       };
      },arr);
     },
     min:function(x)
     {
      return Arrays.reduce(function(e1)
      {
       return function(e2)
       {
        return Operators.Min(e1,e2);
       };
      },x);
     },
     minBy:function(f,arr)
     {
      return Arrays.reduce(function(x)
      {
       return function(y)
       {
        if(Unchecked.Compare(f(x),f(y))===-1)
         {
          return x;
         }
        else
         {
          return y;
         }
       };
      },arr);
     },
     nonEmpty:function(arr)
     {
      if(arr.length===0)
       {
        return Operators.FailWith("The input array was empty.");
       }
      else
       {
        return null;
       }
     },
     ofSeq:function(xs)
     {
      var q,_enum;
      q=[];
      _enum=Enumerator.Get(xs);
      while(_enum.MoveNext())
       {
        q.push(_enum.get_Current());
       }
      return q;
     },
     partition:function(f,arr)
     {
      var ret1,ret2,i;
      ret1=[];
      ret2=[];
      for(i=0;i<=arr.length-1;i++){
       if(f(arr[i]))
        {
         ret1.push(arr[i]);
        }
       else
        {
         ret2.push(arr[i]);
        }
      }
      return[ret1,ret2];
     },
     permute:function(f,arr)
     {
      var ret,i;
      ret=arr.slice(0);
      for(i=0;i<=arr.length-1;i++){
       ret[f(i)]=arr[i];
      }
      return ret;
     },
     reduce:function(f,arr)
     {
      var acc,i;
      Arrays.nonEmpty(arr);
      acc=[arr[0]];
      for(i=1;i<=arr.length-1;i++){
       acc[0]=(f(acc[0]))(arr[i]);
      }
      return acc[0];
     },
     reduceBack:function(f,arr)
     {
      var len,acc,i;
      Arrays.nonEmpty(arr);
      len=arr.length;
      acc=[arr[len-1]];
      for(i=2;i<=len;i++){
       acc[0]=(f(arr[len-i]))(acc[0]);
      }
      return acc[0];
     },
     reverse:function(array,offset,length)
     {
      var a,x;
      a=(x=Arrays.sub(array,offset,length),x.slice(0,x.length).reverse());
      return Arrays.blit(a,0,array,offset,a.length);
     },
     scan:function(f,zero,arr)
     {
      var ret,i;
      ret=Array(1+arr.length);
      ret[0]=zero;
      for(i=0;i<=arr.length-1;i++){
       ret[i+1]=(f(ret[i]))(arr[i]);
      }
      return ret;
     },
     scanBack:function(f,arr,zero)
     {
      var len,ret,i;
      len=arr.length;
      ret=Array(1+len);
      ret[len]=zero;
      for(i=0;i<=len-1;i++){
       ret[len-i-1]=(f(arr[len-i-1]))(ret[len-i]);
      }
      return ret;
     },
     sort:function(arr)
     {
      return Arrays.sortBy(function(x)
      {
       return x;
      },arr);
     },
     sortBy:function(f,arr)
     {
      var f1;
      f1=Runtime.Tupled(function(tupledArg)
      {
       var x,y;
       x=tupledArg[0];
       y=tupledArg[1];
       return Operators.Compare(f(x),f(y));
      });
      return arr.slice(0).sort(f1);
     },
     sortInPlace:function(arr)
     {
      return Arrays.sortInPlaceBy(function(x)
      {
       return x;
      },arr);
     },
     sortInPlaceBy:function(f,arr)
     {
      var f1;
      f1=Runtime.Tupled(function(tupledArg)
      {
       var x,y;
       x=tupledArg[0];
       y=tupledArg[1];
       return Operators.Compare(f(x),f(y));
      });
      return arr.sort(f1);
     },
     sortInPlaceWith:function(comparer,arr)
     {
      var f;
      f=Runtime.Tupled(function(tupledArg)
      {
       var x,y;
       x=tupledArg[0];
       y=tupledArg[1];
       return(comparer(x))(y);
      });
      return arr.sort(f);
     },
     sortWith:function(comparer,arr)
     {
      var f;
      f=Runtime.Tupled(function(tupledArg)
      {
       var x,y;
       x=tupledArg[0];
       y=tupledArg[1];
       return(comparer(x))(y);
      });
      return arr.slice(0).sort(f);
     },
     sub:function(arr,start,length)
     {
      Arrays.checkRange(arr,start,length);
      return arr.slice(start,start+length);
     },
     unzip:function(arr)
     {
      var x,y,i,patternInput,b,a;
      x=[];
      y=[];
      for(i=0;i<=arr.length-1;i++){
       patternInput=arr[i];
       b=patternInput[1];
       a=patternInput[0];
       x.push(a);
       y.push(b);
      }
      return[x,y];
     },
     unzip3:function(arr)
     {
      var x,y,z,i,matchValue,c,b,a;
      x=[];
      y=[];
      z=[];
      for(i=0;i<=arr.length-1;i++){
       matchValue=arr[i];
       c=matchValue[2];
       b=matchValue[1];
       a=matchValue[0];
       x.push(a);
       y.push(b);
       z.push(c);
      }
      return[x,y,z];
     },
     zip:function(arr1,arr2)
     {
      var res,i;
      Arrays.checkLength(arr1,arr2);
      res=Array(arr1.length);
      for(i=0;i<=arr1.length-1;i++){
       res[i]=[arr1[i],arr2[i]];
      }
      return res;
     },
     zip3:function(arr1,arr2,arr3)
     {
      var res,i;
      Arrays.checkLength(arr1,arr2);
      Arrays.checkLength(arr2,arr3);
      res=Array(arr1.length);
      for(i=0;i<=arr1.length-1;i++){
       res[i]=[arr1[i],arr2[i],arr3[i]];
      }
      return res;
     }
    },
    Char:Runtime.Class({},{
     GetNumericValue:function(c)
     {
      if(c>=48?c<=57:false)
       {
        return Number(c)-Number(48);
       }
      else
       {
        return-1;
       }
     },
     IsControl:function(c)
     {
      if(c>=0?c<=31:false)
       {
        return true;
       }
      else
       {
        if(c>=128)
         {
          return c<=159;
         }
        else
         {
          return false;
         }
       }
     },
     IsDigit:function(c)
     {
      if(c>=48)
       {
        return c<=57;
       }
      else
       {
        return false;
       }
     },
     IsLetter:function(c)
     {
      if(c>=65?c<=90:false)
       {
        return true;
       }
      else
       {
        if(c>=97)
         {
          return c<=122;
         }
        else
         {
          return false;
         }
       }
     },
     IsLetterOrDigit:function(c)
     {
      if(Char.IsLetter(c))
       {
        return true;
       }
      else
       {
        return Char.IsDigit(c);
       }
     },
     IsLower:function(c)
     {
      if(c>=97)
       {
        return c<=122;
       }
      else
       {
        return false;
       }
     },
     IsUpper:function(c)
     {
      if(c>=65)
       {
        return c<=90;
       }
      else
       {
        return false;
       }
     },
     IsWhiteSpace:function($c)
     {
      var $0=this,$this=this;
      return Global.String.fromCharCode($c).match(/\s/)!==null;
     }
    }),
    Concurrency:{
     AwaitEvent:function(e)
     {
      return{
       $:0,
       $0:function(k)
       {
        var sub;
        sub={
         contents:undefined
        };
        sub.contents=Util.subscribeTo(e,function(x)
        {
         sub.contents.Dispose();
         return k({
          $:0,
          $0:x
         });
        });
       }
      };
     },
     Bind:function(_arg2,f)
     {
      var r;
      r=_arg2.$0;
      return{
       $:0,
       $0:function(k)
       {
        return r(function(_arg5)
        {
         var e,x;
         if(_arg5.$==1)
          {
           e=_arg5.$0;
           return k({
            $:1,
            $0:e
           });
          }
         else
          {
           x=_arg5.$0;
           return Concurrency.fork(function()
           {
            var e1;
            try
            {
             return Concurrency.Run(f(x),k);
            }
            catch(e1)
            {
             return k({
              $:1,
              $0:e1
             });
            }
           });
          }
        });
       }
      };
     },
     Catch:function(_arg5)
     {
      var r;
      r=_arg5.$0;
      return{
       $:0,
       $0:function(k)
       {
        var e1;
        try
        {
         return r(function(_arg51)
         {
          var e,x;
          if(_arg51.$==1)
           {
            e=_arg51.$0;
            return k({
             $:0,
             $0:{
              $:1,
              $0:e
             }
            });
           }
          else
           {
            x=_arg51.$0;
            return k({
             $:0,
             $0:{
              $:0,
              $0:x
             }
            });
           }
         });
        }
        catch(e1)
        {
         return k({
          $:0,
          $0:{
           $:1,
           $0:e1
          }
         });
        }
       }
      };
     },
     Delay:function(mk)
     {
      return{
       $:0,
       $0:function(k)
       {
        var e;
        try
        {
         return Concurrency.Run(mk(null),k);
        }
        catch(e)
        {
         return k({
          $:1,
          $0:e
         });
        }
       }
      };
     },
     FromContinuations:function(subscribe)
     {
      return{
       $:0,
       $0:function(k)
       {
        return(subscribe(function(a)
        {
         return k({
          $:0,
          $0:a
         });
        }))(function(e)
        {
         return k({
          $:1,
          $0:e
         });
        });
       }
      };
     },
     Parallel:function(cs)
     {
      var cs1;
      cs1=Arrays.ofSeq(cs);
      return{
       $:0,
       $0:function(k)
       {
        var n,o,a,accept;
        n=cs1.length;
        o={
         contents:n
        };
        a=Arrays.create(n,undefined);
        accept=function(i)
        {
         return function(x)
         {
          var matchValue,e,n1,x1,e1,n2,x2,n3;
          matchValue=[o.contents,x];
          if(matchValue[0]===0)
           {
            return null;
           }
          else
           {
            if(matchValue[0]===1)
             {
              if(matchValue[1].$==1)
               {
                e=matchValue[1].$0;
                n1=matchValue[0];
                o.contents=0;
                return k({
                 $:1,
                 $0:e
                });
               }
              else
               {
                x1=matchValue[1].$0;
                a[i]=x1;
                o.contents=0;
                return k({
                 $:0,
                 $0:a
                });
               }
             }
            else
             {
              if(matchValue[1].$==1)
               {
                e1=matchValue[1].$0;
                n2=matchValue[0];
                o.contents=0;
                return k({
                 $:1,
                 $0:e1
                });
               }
              else
               {
                x2=matchValue[1].$0;
                n3=matchValue[0];
                a[i]=x2;
                o.contents=n3-1;
               }
             }
           }
         };
        };
        return Arrays.iteri(function(i)
        {
         return function(_arg1)
         {
          var run;
          run=_arg1.$0;
          return Concurrency.fork(function()
          {
           return run(accept(i));
          });
         };
        },cs1);
       }
      };
     },
     Return:function(x)
     {
      return{
       $:0,
       $0:function(k)
       {
        return k({
         $:0,
         $0:x
        });
       }
      };
     },
     Run:function(_arg1,x)
     {
      var run;
      run=_arg1.$0;
      return run(x);
     },
     Scheduler:Runtime.Class({
      Fork:function(action)
      {
       var _this=this;
       this.robin.push(action);
       if(this.idle)
        {
         this.idle=false;
         return setTimeout(function()
         {
          return _this.tick();
         },0);
        }
       else
        {
         return null;
        }
      },
      tick:function()
      {
       var t,loop,tm,_this=this,matchValue;
       t=(new Date()).getTime();
       loop=[true];
       while(loop[0])
        {
         tm=(new Date()).getTime()-t;
         if(tm>this.MAX_TIME)
          {
           setTimeout(function()
           {
            return _this.tick();
           },0);
           loop[0]=false;
          }
         else
          {
           matchValue=_this.robin.length;
           if(matchValue===0)
            {
             _this.idle=true;
             loop[0]=false;
            }
           else
            {
             (_this.robin.shift())(null);
            }
          }
        }
      }
     },{
      New:function()
      {
       var r;
       r={};
       r.MAX_TIME=40;
       r.idle=true;
       r.robin=[];
       return Runtime.New(this,r);
      }
     }),
     Sleep:function(ms)
     {
      return{
       $:0,
       $0:function(k)
       {
        var action;
        action=function()
        {
         return k({
          $:0,
          $0:null
         });
        };
        return setTimeout(action,ms);
       }
      };
     },
     Start:function(c)
     {
      return Concurrency.StartWithContinuations(c,function(value)
      {
       value;
      },function(exn)
      {
       return Operators.Raise(exn);
      });
     },
     StartChild:function(_arg6)
     {
      var r;
      r=_arg6.$0;
      return{
       $:0,
       $0:function(k)
       {
        var cached,queue,r2;
        cached={
         contents:{
          $:0
         }
        };
        queue=[];
        Concurrency.fork(function()
        {
         return r(function(res)
         {
          cached.contents={
           $:1,
           $0:res
          };
          while(queue.length>0)
           {
            (queue.shift())(res);
           }
         });
        });
        r2=function(k1)
        {
         var matchValue,x;
         matchValue=cached.contents;
         if(matchValue.$==0)
          {
           return queue.push(k1);
          }
         else
          {
           x=matchValue.$0;
           return k1(x);
          }
        };
        return k({
         $:0,
         $0:{
          $:0,
          $0:r2
         }
        });
       }
      };
     },
     StartWithContinuations:function(c,s,f)
     {
      return Concurrency.fork(function()
      {
       return Concurrency.Run(c,function(_arg1)
       {
        var exn,x;
        if(_arg1.$==1)
         {
          exn=_arg1.$0;
          return f(exn);
         }
        else
         {
          x=_arg1.$0;
          return s(x);
         }
       });
      });
     },
     TryFinally:function(_arg3,f)
     {
      var run;
      run=_arg3.$0;
      return{
       $:0,
       $0:function(k)
       {
        return run(function(r)
        {
         var e;
         try
         {
          f(null);
          return k(r);
         }
         catch(e)
         {
          return k({
           $:1,
           $0:e
          });
         }
        });
       }
      };
     },
     TryWith:function(_arg4,f)
     {
      var r;
      r=_arg4.$0;
      return{
       $:0,
       $0:function(k)
       {
        return r(function(_arg5)
        {
         var e,e1,x;
         if(_arg5.$==1)
          {
           e=_arg5.$0;
           try
           {
            return Concurrency.Run(f(e),k);
           }
           catch(e1)
           {
            return k({
             $:1,
             $0:e1
            });
           }
          }
         else
          {
           x=_arg5.$0;
           return k({
            $:0,
            $0:x
           });
          }
        });
       }
      };
     },
     fork:function(action)
     {
      return Concurrency.scheduler().Fork(action);
     },
     scheduler:Runtime.Field(function()
     {
      return Scheduler.New();
     })
    },
    DateTime:Runtime.Class({
     Add:function(t)
     {
      return DateTime.New4(this.epoch+t,this.kind);
     },
     AddDays:function(days)
     {
      return this.Add(days*24*60*60*1000);
     },
     AddHours:function(hours)
     {
      return this.Add(hours*60*60*1000);
     },
     AddMilliseconds:function(msec)
     {
      return this.Add(msec);
     },
     AddMinutes:function(minutes)
     {
      return this.Add(minutes*60*1000);
     },
     AddMonths:function(months)
     {
      return DateTime.New12(this.get_Year(),this.get_Month()+months,this.get_Day(),this.get_Hour(),this.get_Minute(),this.get_Second(),this.get_Millisecond(),this.get_Kind());
     },
     AddSeconds:function(seconds)
     {
      return this.Add(seconds*1000);
     },
     AddTicks:function(ticks)
     {
      return this.Add(ticks/10000);
     },
     AddYears:function(years)
     {
      return DateTime.New12(this.get_Year()+years,this.get_Month(),this.get_Day(),this.get_Hour(),this.get_Minute(),this.get_Second(),this.get_Millisecond(),this.get_Kind());
     },
     Subtract:function(t)
     {
      return DateTime.New4(this.epoch-t,this.kind);
     },
     ToLocalTime:function()
     {
      return DateTime.SpecifyKind(this,2);
     },
     ToUniversalTime:function()
     {
      return DateTime.SpecifyKind(this,1);
     },
     get_Date:function()
     {
      return DateTime.New2(this.get_Year(),this.get_Month(),this.get_Day(),0,0,0);
     },
     get_Day:function()
     {
      return DateTime.GetItem(this,"Date");
     },
     get_DayOfWeek:function()
     {
      return DateTime.GetItem(this,"Day");
     },
     get_Hour:function()
     {
      return DateTime.GetItem(this,"Hours");
     },
     get_Kind:function()
     {
      return this.kind;
     },
     get_Millisecond:function()
     {
      return DateTime.GetItem(this,"Milliseconds");
     },
     get_Minute:function()
     {
      return DateTime.GetItem(this,"Minutes");
     },
     get_Month:function()
     {
      return 1+DateTime.GetItem(this,"Month");
     },
     get_Second:function()
     {
      return DateTime.GetItem(this,"Seconds");
     },
     get_Ticks:function()
     {
      return this.get_Millisecond()*10000;
     },
     get_TimeOfDay:function()
     {
      return(((24*0+this.get_Hour())*60+this.get_Minute())*60+this.get_Second())*1000+this.get_Millisecond();
     },
     get_Year:function()
     {
      return DateTime.GetItem(this,"FullYear");
     },
     toString:function()
     {
      return Global.String(new Date(this.epoch));
     }
    },{
     GetItem:function(_this,key)
     {
      var kind,pfx,date,func,args;
      kind=_this.kind;
      pfx="get"+(Unchecked.Equals(kind,1)?"UTC":"");
      date=new Date(_this.epoch);
      func=pfx+key;
      args=[];
      return date[func].apply(date,args);
     },
     New:function(ticks,k)
     {
      var r;
      r=DateTime.New4(ticks/10000>>0,k);
      return Runtime.New(this,r);
     },
     New1:function(y,mo,d)
     {
      var r;
      r=DateTime.New12(y,mo,d,0,0,0,0,0);
      return Runtime.New(this,r);
     },
     New11:function(y,mo,d,h,m,s,k)
     {
      var r;
      r=DateTime.New12(y,mo,d,h,m,s,0,k);
      return Runtime.New(this,r);
     },
     New12:function(y,mo,d,h,m,s,ms,k)
     {
      var r;
      r=DateTime.New4(((((function(arg20)
      {
       return function(arg30)
       {
        return function(arg40)
        {
         return function(arg50)
         {
          return function(arg60)
          {
           return(new Date(y,mo-1,arg20,arg30,arg40,arg50,arg60)).getTime();
          };
         };
        };
       };
      }(d))(h))(m))(s))(ms),k);
      return Runtime.New(this,r);
     },
     New13:function()
     {
      var r;
      r=DateTime.New1(1,1,1);
      return Runtime.New(this,r);
     },
     New2:function(y,mo,d,h,m,s)
     {
      var r;
      r=DateTime.New12(y,mo,d,h,m,s,0,0);
      return Runtime.New(this,r);
     },
     New21:function(ticks)
     {
      var r;
      r=DateTime.New(ticks,0);
      return Runtime.New(this,r);
     },
     New3:function(y,mo,d,h,m,s,ms)
     {
      var r;
      r=DateTime.New12(y,mo,d,h,m,s,ms,0);
      return Runtime.New(this,r);
     },
     New4:function(epoch,kind)
     {
      var r;
      r={};
      r.epoch=epoch;
      r.kind=kind;
      return Runtime.New(this,r);
     },
     SpecifyKind:function(d,k)
     {
      return DateTime.New4(d.epoch,k);
     },
     get_Now:function()
     {
      return DateTime.New4((new Date()).getTime(),2);
     },
     get_Today:function()
     {
      var copyOfStruct;
      copyOfStruct=[DateTime.get_Now()];
      return copyOfStruct[0].get_Date();
     },
     get_UtcNow:function()
     {
      return DateTime.New4((new Date()).getTime(),1);
     }
    }),
    Enumerable:{
     Of:function(getEnumerator)
     {
      var r;
      r={};
      r.GetEnumerator=getEnumerator;
      return r;
     }
    },
    Enumerator:{
     Get:function(x)
     {
      if(x instanceof Global.Array)
       {
        return Enumerator.New(0,function(e)
        {
         var i;
         i=e.s;
         if(i<x.length)
          {
           e.c=x[i];
           e.s=i+1;
           return true;
          }
         else
          {
           return false;
          }
        });
       }
      else
       {
        if(Unchecked.Equals(typeof x,"string"))
         {
          return Enumerator.New(0,function(e)
          {
           var i;
           i=e.s;
           if(i<x.length)
            {
             e.c=x.charCodeAt(i);
             e.s=i+1;
             return true;
            }
           else
            {
             return false;
            }
          });
         }
        else
         {
          return x.GetEnumerator();
         }
       }
     },
     New:function(state,next)
     {
      var r;
      r={
       s:state,
       c:undefined
      };
      r.get_Current=function()
      {
       return r.c;
      };
      r.MoveNext=function()
      {
       return next(r);
      };
      return r;
     }
    },
    JavaScript:{
     Delete:function($x,$field)
     {
      var $0=this,$this=this;
      return delete $x[$field];
     },
     ForEach:function($x,$iter)
     {
      var $0=this,$this=this;
      for(var k in $x){
       if($iter(k))
        break;
      }
     },
     GetFields:function($o)
     {
      var $0=this,$this=this;
      var r=[];
      for(var k in $o)r.push([k,$o[k]]);
      return r;
     },
     Log:function($x)
     {
      var $0=this,$this=this;
      if(Global.console)
       Global.console.log($x);
     }
    },
    Json:{
     Activate:function(json)
     {
      var types,i,decode;
      types=json.$TYPES;
      for(i=0;i<=types.length-1;i++){
       types[i]=Json.lookup(types[i]);
      }
      decode=function(x)
      {
       var matchValue,o,ti;
       if(Unchecked.Equals(x,null))
        {
         return x;
        }
       else
        {
         matchValue=typeof x;
         if(matchValue==="object")
          {
           if(x instanceof Global.Array)
            {
             return Json.shallowMap(decode,x);
            }
           else
            {
             o=Json.shallowMap(decode,x.$V);
             ti=x.$T;
             if(Unchecked.Equals(typeof ti,"undefined"))
              {
               return o;
              }
             else
              {
               return Json.restore(types[ti],o);
              }
            }
          }
         else
          {
           return x;
          }
        }
      };
      return decode(json.$DATA);
     },
     lookup:function(x)
     {
      var k,r,i,n,rn;
      k=x.length;
      r=[Global];
      i=[0];
      while(i[0]<k)
       {
        n=x[i[0]];
        rn=r[0][n];
        if(!Unchecked.Equals(typeof rn,undefined))
         {
          r[0]=rn;
          i[0]=i[0]+1;
         }
        else
         {
          Operators.FailWith("Invalid server reply. Failed to find type: "+n);
         }
       }
      return r[0];
     },
     restore:function(ty,obj)
     {
      var r;
      r=new ty();
      JavaScript.ForEach(obj,function(k)
      {
       r[k]=obj[k];
       return false;
      });
      return r;
     },
     shallowMap:function(f,x)
     {
      var matchValue,r;
      if(x instanceof Global.Array)
       {
        return Arrays.map(f,x);
       }
      else
       {
        matchValue=typeof x;
        if(matchValue==="object")
         {
          r={};
          JavaScript.ForEach(x,function(y)
          {
           r[y]=f(x[y]);
           return false;
          });
          return r;
         }
        else
         {
          return x;
         }
       }
     }
    },
    Lazy:{
     Create:function(f)
     {
      var x,get;
      x={
       value:undefined,
       created:false,
       eval:f
      };
      get=function()
      {
       if(x.created)
        {
         return x.value;
        }
       else
        {
         x.created=true;
         x.value=f(null);
         return x.value;
        }
      };
      x.eval=get;
      return x;
     },
     CreateFromValue:function(v)
     {
      var x;
      x={
       value:v,
       created:true,
       eval:function()
       {
        return v;
       }
      };
      x.eval=function()
      {
       return v;
      };
      return x;
     },
     Force:function(x)
     {
      return x.eval.call(null,null);
     }
    },
    List:{
     T:Runtime.Class({
      GetEnumerator:function()
      {
       return Enumerator.New(this,function(e)
       {
        var matchValue,xs,x;
        matchValue=e.s;
        if(matchValue.$==0)
         {
          return false;
         }
        else
         {
          xs=matchValue.$1;
          x=matchValue.$0;
          e.c=x;
          e.s=xs;
          return true;
         }
       });
      },
      get_Item:function(x)
      {
       return Seq.nth(x,this);
      },
      get_Length:function()
      {
       return Seq.length(this);
      }
     },{
      Construct:function(head,tail)
      {
       return Runtime.New(T,{
        $:1,
        $0:head,
        $1:tail
       });
      },
      get_Nil:function()
      {
       return Runtime.New(T,{
        $:0
       });
      }
     }),
     append:function(x,y)
     {
      return List.ofSeq(Seq.append(x,y));
     },
     choose:function(f,l)
     {
      return List.ofSeq(Seq.choose(f,l));
     },
     collect:function(f,l)
     {
      return List.ofSeq(Seq.collect(f,l));
     },
     concat:function(s)
     {
      return List.ofSeq(Seq.concat(s));
     },
     exists2:function(p,l1,l2)
     {
      return Arrays.exists2(p,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
     },
     filter:function(p,l)
     {
      return List.ofSeq(Seq.filter(p,l));
     },
     fold2:function(f,s,l1,l2)
     {
      return Arrays.fold2(f,s,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
     },
     foldBack:function(f,l,s)
     {
      return Arrays.foldBack(f,Arrays.ofSeq(l),s);
     },
     foldBack2:function(f,l1,l2,s)
     {
      return Arrays.foldBack2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2),s);
     },
     forall2:function(p,l1,l2)
     {
      return Arrays.forall2(p,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
     },
     init:function(s,f)
     {
      return List.ofArray(Arrays.init(s,f));
     },
     iter2:function(f,l1,l2)
     {
      return Arrays.iter2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
     },
     iteri2:function(f,l1,l2)
     {
      return Arrays.iteri2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
     },
     map:function(f,l)
     {
      return List.ofSeq(Seq.map(f,l));
     },
     map2:function(f,l1,l2)
     {
      return List.ofArray(Arrays.map2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2)));
     },
     map3:function(f,l1,l2,l3)
     {
      var x,f1;
      x=Arrays.map2(function(func)
      {
       return func;
      },Arrays.map2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2)),Arrays.ofSeq(l3));
      f1=function(array)
      {
       return List.ofArray(array);
      };
      return f1(x);
     },
     mapi:function(f,l)
     {
      return List.ofSeq(Seq.mapi(f,l));
     },
     mapi2:function(f,l1,l2)
     {
      return List.ofArray(Arrays.mapi2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2)));
     },
     max:function(l)
     {
      return Seq.reduce(function(e1)
      {
       return function(e2)
       {
        return Operators.Max(e1,e2);
       };
      },l);
     },
     maxBy:function(f,l)
     {
      return Seq.reduce(function(x)
      {
       return function(y)
       {
        if(Unchecked.Compare(f(x),f(y))===1)
         {
          return x;
         }
        else
         {
          return y;
         }
       };
      },l);
     },
     min:function(l)
     {
      return Seq.reduce(function(e1)
      {
       return function(e2)
       {
        return Operators.Min(e1,e2);
       };
      },l);
     },
     minBy:function(f,l)
     {
      return Seq.reduce(function(x)
      {
       return function(y)
       {
        if(Unchecked.Compare(f(x),f(y))===-1)
         {
          return x;
         }
        else
         {
          return y;
         }
       };
      },l);
     },
     ofArray:function(arr)
     {
      var r,i;
      r=[Runtime.New(T,{
       $:0
      })];
      for(i=0;i<=arr.length-1;i++){
       r[0]=Runtime.New(T,{
        $:1,
        $0:arr[arr.length-i-1],
        $1:r[0]
       });
      }
      return r[0];
     },
     ofSeq:function(s)
     {
      var r,e,x;
      r=[];
      e=Enumerator.Get(s);
      while(e.MoveNext())
       {
        r.unshift(e.get_Current());
       }
      x=r.slice(0);
      x.reverse();
      return List.ofArray(x);
     },
     partition:function(p,l)
     {
      var patternInput,b,a;
      patternInput=Arrays.partition(p,Arrays.ofSeq(l));
      b=patternInput[1];
      a=patternInput[0];
      return[List.ofArray(a),List.ofArray(b)];
     },
     permute:function(f,l)
     {
      return List.ofArray(Arrays.permute(f,Arrays.ofSeq(l)));
     },
     reduceBack:function(f,l)
     {
      return Arrays.reduceBack(f,Arrays.ofSeq(l));
     },
     replicate:function(size,value)
     {
      return List.ofArray(Arrays.create(size,value));
     },
     rev:function(l)
     {
      var a;
      a=Arrays.ofSeq(l);
      a.reverse();
      return List.ofArray(a);
     },
     scan:function(f,s,l)
     {
      return List.ofSeq(Seq.scan(f,s,l));
     },
     scanBack:function(f,l,s)
     {
      return List.ofArray(Arrays.scanBack(f,Arrays.ofSeq(l),s));
     },
     sort:function(l)
     {
      var a;
      a=Arrays.ofSeq(l);
      Arrays.sortInPlace(a);
      return List.ofArray(a);
     },
     sortBy:function(f,l)
     {
      return List.sortWith(function(x)
      {
       return function(y)
       {
        return Operators.Compare(f(x),f(y));
       };
      },l);
     },
     sortWith:function(f,l)
     {
      var a;
      a=Arrays.ofSeq(l);
      Arrays.sortInPlaceWith(f,a);
      return List.ofArray(a);
     },
     unzip:function(l)
     {
      var x,y,enumerator,forLoopVar,b,a;
      x=[];
      y=[];
      enumerator=Enumerator.Get(l);
      while(enumerator.MoveNext())
       {
        forLoopVar=enumerator.get_Current();
        b=forLoopVar[1];
        a=forLoopVar[0];
        x.push(a);
        y.push(b);
       }
      return[List.ofArray(x.slice(0)),List.ofArray(y.slice(0))];
     },
     unzip3:function(l)
     {
      var x,y,z,enumerator,forLoopVar,c,b,a;
      x=[];
      y=[];
      z=[];
      enumerator=Enumerator.Get(l);
      while(enumerator.MoveNext())
       {
        forLoopVar=enumerator.get_Current();
        c=forLoopVar[2];
        b=forLoopVar[1];
        a=forLoopVar[0];
        x.push(a);
        y.push(b);
        z.push(c);
       }
      return[List.ofArray(x.slice(0)),List.ofArray(y.slice(0)),List.ofArray(z.slice(0))];
     },
     zip:function(l1,l2)
     {
      return List.ofArray(Arrays.zip(Arrays.ofSeq(l1),Arrays.ofSeq(l2)));
     },
     zip3:function(l1,l2,l3)
     {
      return List.ofArray(Arrays.zip3(Arrays.ofSeq(l1),Arrays.ofSeq(l2),Arrays.ofSeq(l3)));
     }
    },
    Operators:{
     Compare:function(a,b)
     {
      return Unchecked.Compare(a,b);
     },
     Decrement:function(x)
     {
      x.contents=x.contents-1;
     },
     DefaultArg:function(x,d)
     {
      var x1;
      if(x.$==0)
       {
        return d;
       }
      else
       {
        x1=x.$0;
        return x1;
       }
     },
     FailWith:function(msg)
     {
      return Operators.Raise(new Error(msg));
     },
     Increment:function(x)
     {
      x.contents=x.contents+1;
     },
     KeyValue:function(kvp)
     {
      return[kvp.K,kvp.V];
     },
     Max:function(a,b)
     {
      if(Unchecked.Compare(a,b)===1)
       {
        return a;
       }
      else
       {
        return b;
       }
     },
     Min:function(a,b)
     {
      if(Unchecked.Compare(a,b)===-1)
       {
        return a;
       }
      else
       {
        return b;
       }
     },
     Pown:function(a,n)
     {
      var p;
      p=function(n1)
      {
       var b;
       if(n1===1)
        {
         return a;
        }
       else
        {
         if(n1%2===0)
          {
           b=p(n1/2>>0);
           return b*b;
          }
         else
          {
           return a*p(n1-1);
          }
        }
      };
      return p(n);
     },
     Raise:function($e)
     {
      var $0=this,$this=this;
      throw $e;
     },
     Sign:function(x)
     {
      if(x===0)
       {
        return 0;
       }
      else
       {
        if(x<0)
         {
          return-1;
         }
        else
         {
          return 1;
         }
       }
     },
     Truncate:function(x)
     {
      if(x<0)
       {
        return Math.ceil(x);
       }
      else
       {
        return Math.floor(x);
       }
     },
     Using:function(t,f)
     {
      try
      {
       return f(t);
      }
      finally
      {
       t.Dispose();
      }
     },
     range:function(min,max)
     {
      return Seq.init(1+max-min,function(x)
      {
       return x+min;
      });
     },
     step:function(min,step,max)
     {
      var s,x,x1,f,predicate,f1;
      s=Operators.Sign(step);
      x=(x1=Seq.initInfinite(function(k)
      {
       return min+k*step;
      }),(f=(predicate=function(k)
      {
       return s*(max-k)>=0;
      },function(source)
      {
       return Seq.takeWhile(predicate,source);
      }),f(x1)));
      f1=function(x2)
      {
       return x2;
      };
      return f1(x);
     }
    },
    Option:{
     bind:function(f,x)
     {
      var x1;
      if(x.$==0)
       {
        return{
         $:0
        };
       }
      else
       {
        x1=x.$0;
        return f(x1);
       }
     },
     exists:function(p,x)
     {
      var x1;
      if(x.$==0)
       {
        return false;
       }
      else
       {
        x1=x.$0;
        return p(x1);
       }
     },
     fold:function(f,s,x)
     {
      var x1;
      if(x.$==0)
       {
        return s;
       }
      else
       {
        x1=x.$0;
        return(f(s))(x1);
       }
     },
     foldBack:function(f,x,s)
     {
      var x1;
      if(x.$==0)
       {
        return s;
       }
      else
       {
        x1=x.$0;
        return(f(x1))(s);
       }
     },
     forall:function(p,x)
     {
      var x1;
      if(x.$==0)
       {
        return true;
       }
      else
       {
        x1=x.$0;
        return p(x1);
       }
     },
     iter:function(p,x)
     {
      var x1;
      if(x.$==0)
       {
        return null;
       }
      else
       {
        x1=x.$0;
        return p(x1);
       }
     },
     map:function(f,x)
     {
      var x1;
      if(x.$==0)
       {
        return{
         $:0
        };
       }
      else
       {
        x1=x.$0;
        return{
         $:1,
         $0:f(x1)
        };
       }
     },
     toArray:function(x)
     {
      var x1;
      if(x.$==0)
       {
        return[];
       }
      else
       {
        x1=x.$0;
        return[x1];
       }
     },
     toList:function(x)
     {
      var x1;
      if(x.$==0)
       {
        return Runtime.New(T,{
         $:0
        });
       }
      else
       {
        x1=x.$0;
        return List.ofArray([x1]);
       }
     }
    },
    Pervasives:{
     New:function(fields)
     {
      var r,enumerator,forLoopVar,v,k;
      r={};
      enumerator=Enumerator.Get(fields);
      while(enumerator.MoveNext())
       {
        forLoopVar=enumerator.get_Current();
        v=forLoopVar[1];
        k=forLoopVar[0];
        r[k]=v;
       }
      return r;
     }
    },
    Queue:{
     Clear:function(a)
     {
      return a.splice(0,a.length);
     },
     Contains:function(a,el)
     {
      return Seq.exists(function(y)
      {
       return Unchecked.Equals(el,y);
      },a);
     },
     CopyTo:function(a,array,index)
     {
      return Arrays.blit(a,0,array,index,a.length);
     }
    },
    Remoting:{
     AjaxProvider:Runtime.Field(function()
     {
      return XhrProvider.New();
     }),
     Async:function(m,data)
     {
      var headers,payload,callback;
      headers=Remoting.makeHeaders(m);
      payload=Remoting.makePayload(data);
      callback=Runtime.Tupled(function(tupledArg)
      {
       var ok,err,_arg1,ok1,arg00;
       ok=tupledArg[0];
       err=tupledArg[1];
       _arg1=tupledArg[2];
       ok1=function(x)
       {
        return ok(Json.Activate(JSON.parse(x)));
       };
       arg00=Remoting.EndPoint();
       return((function(arg20)
       {
        return function(arg30)
        {
         return function(arg40)
         {
          return Remoting.AjaxProvider().Async(arg00,headers,arg20,arg30,arg40);
         };
        };
       }(payload))(ok1))(err);
      });
      return Concurrency.FromContinuations(function(ok)
      {
       return function(no)
       {
        return callback([ok,no,function(value)
        {
         value;
        }]);
       };
      });
     },
     Call:function(m,data)
     {
      var data1,arg00,arg10;
      data1=(arg00=Remoting.EndPoint(),(arg10=Remoting.makeHeaders(m),function(arg20)
      {
       return Remoting.AjaxProvider().Sync(arg00,arg10,arg20);
      })(Remoting.makePayload(data)));
      return Json.Activate(JSON.parse(data1));
     },
     EndPoint:Runtime.Field(function()
     {
      return"?";
     }),
     Send:function(m,data)
     {
      var computation,computation1,t;
      computation=(computation1=Remoting.Async(m,data),Concurrency.Bind(computation1,function()
      {
       return Concurrency.Return(null);
      }));
      t={
       $:0
      };
      return Concurrency.Start(computation);
     },
     XhrProvider:Runtime.Class({
      Async:function(url,headers,data,ok,err)
      {
       return Remoting.ajax(true,url,headers,data,ok,err);
      },
      Sync:function(url,headers,data)
      {
       var res;
       res={
        contents:undefined
       };
       Remoting.ajax(false,url,headers,data,function(x)
       {
        res.contents=x;
       },function(e)
       {
        return Operators.Raise(e);
       });
       return res.contents;
      }
     },{
      New:function()
      {
       var r;
       r={};
       return Runtime.New(this,r);
      }
     }),
     ajax:function($async,$url,$headers,$data,$ok,$err)
     {
      var $0=this,$this=this;
      var xhr=new Global.XMLHttpRequest();
      xhr.open("POST",$url,$async);
      for(var h in $headers){
       xhr.setRequestHeader(h,$headers[h]);
      }
      function k()
      {
       if(xhr.status==200)
        {
         $ok(xhr.responseText);
        }
       else
        {
         var msg="Response status is not 200: ";
         $err(new Global.Error(msg+xhr.status));
        }
      }
      if("onload"in xhr)
       {
        xhr.onload=xhr.onerror=xhr.onabort=k;
       }
      else
       {
        xhr.onreadystatechange=function()
        {
         if(xhr.readyState==4)
          {
           k();
          }
        };
       }
      xhr.send($data);
     },
     makeHeaders:function(m)
     {
      var headers;
      headers={};
      headers["content-type"]="application/json";
      headers["x-websharper-rpc"]=m;
      return headers;
     },
     makePayload:function(data)
     {
      return JSON.stringify(data);
     }
    },
    Seq:{
     append:function(s1,s2)
     {
      return Enumerable.Of(function()
      {
       var e1;
       e1=Enumerator.Get(s1);
       return Enumerator.New(e1,function(x)
       {
        var e2;
        if(x.s.MoveNext())
         {
          x.c=x.s.get_Current();
          return true;
         }
        else
         {
          if(x.s===e1)
           {
            e2=Enumerator.Get(s2);
            x.s=e2;
            if(e2.MoveNext())
             {
              x.c=e2.get_Current();
              return true;
             }
            else
             {
              return false;
             }
           }
          else
           {
            return false;
           }
         }
       });
      });
     },
     average:function(s)
     {
      var patternInput,sum,count;
      patternInput=Seq.fold(Runtime.Tupled(function(tupledArg)
      {
       var n,s1;
       n=tupledArg[0];
       s1=tupledArg[1];
       return function(x)
       {
        return[n+1,s1+x];
       };
      }),[0,0],s);
      sum=patternInput[1];
      count=patternInput[0];
      return sum/count;
     },
     averageBy:function(f,s)
     {
      var patternInput,sum,count;
      patternInput=Seq.fold(Runtime.Tupled(function(tupledArg)
      {
       var n,s1;
       n=tupledArg[0];
       s1=tupledArg[1];
       return function(x)
       {
        return[n+1,s1+f(x)];
       };
      }),[0,0],s);
      sum=patternInput[1];
      count=patternInput[0];
      return sum/count;
     },
     cache:function(s)
     {
      var cache,_enum,getEnumerator;
      cache=[];
      _enum=Enumerator.Get(s);
      getEnumerator=function()
      {
       var next;
       next=function(e)
       {
        if(e.s+1<cache.length)
         {
          e.s=e.s+1;
          e.c=cache[e.s];
          return true;
         }
        else
         {
          if(_enum.MoveNext())
           {
            e.s=e.s+1;
            e.c=_enum.get_Current();
            cache.push(e.c);
            return true;
           }
          else
           {
            return false;
           }
         }
       };
       return Enumerator.New(0,next);
      };
      return Enumerable.Of(getEnumerator);
     },
     choose:function(f,s)
     {
      var f1,mapping;
      f1=(mapping=function(x)
      {
       var matchValue,v;
       matchValue=f(x);
       if(matchValue.$==0)
        {
         return Runtime.New(T,{
          $:0
         });
        }
       else
        {
         v=matchValue.$0;
         return List.ofArray([v]);
        }
      },function(source)
      {
       return Seq.collect(mapping,source);
      });
      return f1(s);
     },
     collect:function(f,s)
     {
      return Seq.concat(Seq.map(f,s));
     },
     compareWith:function(f,s1,s2)
     {
      var e1,e2,r,loop,matchValue;
      e1=Enumerator.Get(s1);
      e2=Enumerator.Get(s2);
      r=[0];
      loop=[true];
      while(loop[0]?r[0]===0:false)
       {
        matchValue=[e1.MoveNext(),e2.MoveNext()];
        if(matchValue[0])
         {
          if(matchValue[1])
           {
            r[0]=(f(e1.get_Current()))(e2.get_Current());
           }
          else
           {
            r[0]=1;
           }
         }
        else
         {
          if(matchValue[1])
           {
            r[0]=-1;
           }
          else
           {
            loop[0]=false;
           }
         }
       }
      return r[0];
     },
     concat:function(ss)
     {
      return Seq.fold(function(source1)
      {
       return function(source2)
       {
        return Seq.append(source1,source2);
       };
      },Seq.empty(),ss);
     },
     countBy:function(f,s)
     {
      var generator;
      generator=function()
      {
       var d,e,keys,k,h,x,x1,f1,mapping,f2;
       d={};
       e=Enumerator.Get(s);
       keys=[];
       while(e.MoveNext())
        {
         k=f(e.get_Current());
         h=Unchecked.Hash(k);
         if(d.hasOwnProperty(h))
          {
           d[h]=d[h]+1;
          }
         else
          {
           keys.push(k);
           d[h]=1;
          }
        }
       x=(x1=keys.slice(0),(f1=(mapping=function(k1)
       {
        return[k1,d[Unchecked.Hash(k1)]];
       },function(array)
       {
        return Arrays.map(mapping,array);
       }),f1(x1)));
       f2=function(x2)
       {
        return x2;
       };
       return f2(x);
      };
      return Seq.delay(generator);
     },
     delay:function(f)
     {
      return Enumerable.Of(function()
      {
       return Enumerator.Get(f(null));
      });
     },
     distinct:function(s)
     {
      return Seq.distinctBy(function(x)
      {
       return x;
      },s);
     },
     distinctBy:function(f,s)
     {
      var getEnumerator;
      getEnumerator=function()
      {
       var _enum,seen,next;
       _enum=Enumerator.Get(s);
       seen={};
       next=function(e)
       {
        var cur,h,check,has;
        if(_enum.MoveNext())
         {
          cur=[_enum.get_Current()];
          h=function(c)
          {
           var x;
           x=f(c);
           return Unchecked.Hash(x);
          };
          check=function(c)
          {
           return seen.hasOwnProperty(h(c));
          };
          has=[check(cur[0])];
          while(has[0]?_enum.MoveNext():false)
           {
            cur[0]=_enum.get_Current();
            has[0]=check(cur[0]);
           }
          if(has[0])
           {
            return false;
           }
          else
           {
            seen[h(cur[0])]=null;
            e.c=cur[0];
            return true;
           }
         }
        else
         {
          return false;
         }
       };
       return Enumerator.New(null,next);
      };
      return Enumerable.Of(getEnumerator);
     },
     empty:function()
     {
      return[];
     },
     enumFinally:function(s,f)
     {
      return Enumerable.Of(function()
      {
       var e;
       e=Runtime.Try(function()
       {
        return Enumerator.Get(s);
       },function(e1)
       {
        f(null);
        return Operators.Raise(e1);
       });
       return Enumerator.New(null,function(x)
       {
        var e1;
        try
        {
         if(e.MoveNext())
          {
           x.c=e.get_Current();
           return true;
          }
         else
          {
           f(null);
           return false;
          }
        }
        catch(e1)
        {
         f(null);
         return Operators.Raise(e1);
        }
       });
      });
     },
     enumUsing:function(x,f)
     {
      return f(x);
     },
     enumWhile:function(f,s)
     {
      return Enumerable.Of(function()
      {
       var next;
       next=function(en)
       {
        var matchValue,e;
        matchValue=en.s;
        if(matchValue.$==1)
         {
          e=matchValue.$0;
          if(e.MoveNext())
           {
            en.c=e.get_Current();
            return true;
           }
          else
           {
            en.s={
             $:0
            };
            return next(en);
           }
         }
        else
         {
          if(f(null))
           {
            en.s={
             $:1,
             $0:Enumerator.Get(s)
            };
            return next(en);
           }
          else
           {
            return false;
           }
         }
       };
       return Enumerator.New({
        $:0
       },next);
      });
     },
     exists:function(p,s)
     {
      var e,r;
      e=Enumerator.Get(s);
      r=[false];
      while(!r[0]?e.MoveNext():false)
       {
        r[0]=p(e.get_Current());
       }
      return r[0];
     },
     exists2:function(p,s1,s2)
     {
      var e1,e2,r;
      e1=Enumerator.Get(s1);
      e2=Enumerator.Get(s2);
      r=[false];
      while((!r[0]?e1.MoveNext():false)?e2.MoveNext():false)
       {
        r[0]=(p(e1.get_Current()))(e2.get_Current());
       }
      return r[0];
     },
     filter:function(f,s)
     {
      var getEnumerator;
      getEnumerator=function()
      {
       var _enum,next;
       _enum=Enumerator.Get(s);
       next=function(e)
       {
        var loop,c,res;
        loop=[_enum.MoveNext()];
        c=[_enum.get_Current()];
        res=[false];
        while(loop[0])
         {
          if(f(c[0]))
           {
            e.c=c[0];
            res[0]=true;
            loop[0]=false;
           }
          else
           {
            if(_enum.MoveNext())
             {
              c[0]=_enum.get_Current();
             }
            else
             {
              loop[0]=false;
             }
           }
         }
        return res[0];
       };
       return Enumerator.New(null,next);
      };
      return Enumerable.Of(getEnumerator);
     },
     find:function(p,s)
     {
      var matchValue,x;
      matchValue=Seq.tryFind(p,s);
      if(matchValue.$==0)
       {
        return Operators.FailWith("KeyNotFoundException");
       }
      else
       {
        x=matchValue.$0;
        return x;
       }
     },
     findIndex:function(p,s)
     {
      var matchValue,x;
      matchValue=Seq.tryFindIndex(p,s);
      if(matchValue.$==0)
       {
        return Operators.FailWith("KeyNotFoundException");
       }
      else
       {
        x=matchValue.$0;
        return x;
       }
     },
     fold:function(f,x,s)
     {
      var r,e;
      r=[x];
      e=Enumerator.Get(s);
      while(e.MoveNext())
       {
        r[0]=(f(r[0]))(e.get_Current());
       }
      return r[0];
     },
     forall:function(p,s)
     {
      return!Seq.exists(function(x)
      {
       return!p(x);
      },s);
     },
     forall2:function(p,s1,s2)
     {
      return!Seq.exists2(function(x)
      {
       return function(y)
       {
        return!(p(x))(y);
       };
      },s1,s2);
     },
     groupBy:function(f,s)
     {
      return Seq.delay(function()
      {
       var d,d1,keys,e,c,k,h;
       d={};
       d1={};
       keys=[];
       e=Enumerator.Get(s);
       while(e.MoveNext())
        {
         c=e.get_Current();
         k=f(c);
         h=Unchecked.Hash(k);
         if(!d.hasOwnProperty(h))
          {
           keys.push(k);
          }
         d1[h]=k;
         if(d.hasOwnProperty(h))
          {
           d[h].push(c);
          }
         else
          {
           d[h]=[c];
          }
        }
       return Arrays.map(function(k1)
       {
        return[k1,d[Unchecked.Hash(k1)]];
       },keys);
      });
     },
     head:function(s)
     {
      var e;
      e=Enumerator.Get(s);
      if(e.MoveNext())
       {
        return e.get_Current();
       }
      else
       {
        return Seq.insufficient();
       }
     },
     init:function(n,f)
     {
      return Seq.take(n,Seq.initInfinite(f));
     },
     initInfinite:function(f)
     {
      var getEnumerator;
      getEnumerator=function()
      {
       var next;
       next=function(e)
       {
        e.c=f(e.s);
        e.s=e.s+1;
        return true;
       };
       return Enumerator.New(0,next);
      };
      return Enumerable.Of(getEnumerator);
     },
     insufficient:function()
     {
      return Operators.FailWith("The input sequence has an insufficient number of elements.");
     },
     isEmpty:function(s)
     {
      var e;
      e=Enumerator.Get(s);
      return!e.MoveNext();
     },
     iter:function(p,s)
     {
      return Seq.iteri(function()
      {
       return p;
      },s);
     },
     iter2:function(p,s1,s2)
     {
      var e1,e2;
      e1=Enumerator.Get(s1);
      e2=Enumerator.Get(s2);
      while(e1.MoveNext()?e2.MoveNext():false)
       {
        (p(e1.get_Current()))(e2.get_Current());
       }
     },
     iteri:function(p,s)
     {
      var i,e;
      i=[0];
      e=Enumerator.Get(s);
      while(e.MoveNext())
       {
        (p(i[0]))(e.get_Current());
        i[0]=i[0]+1;
       }
     },
     length:function(s)
     {
      var i,e;
      i=[0];
      e=Enumerator.Get(s);
      while(e.MoveNext())
       {
        i[0]=i[0]+1;
       }
      return i[0];
     },
     map:function(f,s)
     {
      var getEnumerator;
      getEnumerator=function()
      {
       var en,next;
       en=Enumerator.Get(s);
       next=function(e)
       {
        if(en.MoveNext())
         {
          e.c=f(en.get_Current());
          return true;
         }
        else
         {
          return false;
         }
       };
       return Enumerator.New(null,next);
      };
      return Enumerable.Of(getEnumerator);
     },
     mapi:function(f,s)
     {
      return Seq.mapi2(f,Seq.initInfinite(function(x)
      {
       return x;
      }),s);
     },
     mapi2:function(f,s1,s2)
     {
      var getEnumerator;
      getEnumerator=function()
      {
       var e1,e2,next;
       e1=Enumerator.Get(s1);
       e2=Enumerator.Get(s2);
       next=function(e)
       {
        if(e1.MoveNext()?e2.MoveNext():false)
         {
          e.c=(f(e1.get_Current()))(e2.get_Current());
          return true;
         }
        else
         {
          return false;
         }
       };
       return Enumerator.New(null,next);
      };
      return Enumerable.Of(getEnumerator);
     },
     max:function(s)
     {
      return Seq.reduce(function(x)
      {
       return function(y)
       {
        if(Unchecked.Compare(x,y)>=0)
         {
          return x;
         }
        else
         {
          return y;
         }
       };
      },s);
     },
     maxBy:function(f,s)
     {
      return Seq.reduce(function(x)
      {
       return function(y)
       {
        if(Unchecked.Compare(f(x),f(y))>=0)
         {
          return x;
         }
        else
         {
          return y;
         }
       };
      },s);
     },
     min:function(s)
     {
      return Seq.reduce(function(x)
      {
       return function(y)
       {
        if(Unchecked.Compare(x,y)<=0)
         {
          return x;
         }
        else
         {
          return y;
         }
       };
      },s);
     },
     minBy:function(f,s)
     {
      return Seq.reduce(function(x)
      {
       return function(y)
       {
        if(Unchecked.Compare(f(x),f(y))<=0)
         {
          return x;
         }
        else
         {
          return y;
         }
       };
      },s);
     },
     nth:function(index,s)
     {
      var pos,e;
      if(index<0)
       {
        Operators.FailWith("negative index requested");
       }
      pos=[-1];
      e=Enumerator.Get(s);
      while(pos[0]<index)
       {
        if(!e.MoveNext())
         {
          Seq.insufficient();
         }
        pos[0]=pos[0]+1;
       }
      return e.get_Current();
     },
     pairwise:function(s)
     {
      var x,f,mapping;
      x=Seq.windowed(2,s);
      f=(mapping=function(x1)
      {
       return[x1[0],x1[1]];
      },function(source)
      {
       return Seq.map(mapping,source);
      });
      return f(x);
     },
     pick:function(p,s)
     {
      var matchValue,x;
      matchValue=Seq.tryPick(p,s);
      if(matchValue.$==0)
       {
        return Operators.FailWith("KeyNotFoundException");
       }
      else
       {
        x=matchValue.$0;
        return x;
       }
     },
     readOnly:function(s)
     {
      return Enumerable.Of(function()
      {
       return Enumerator.Get(s);
      });
     },
     reduce:function(f,source)
     {
      var e,r;
      e=Enumerator.Get(source);
      if(!e.MoveNext())
       {
        Operators.FailWith("The input sequence was empty");
       }
      r=[e.get_Current()];
      while(e.MoveNext())
       {
        r[0]=(f(r[0]))(e.get_Current());
       }
      return r[0];
     },
     scan:function(f,x,s)
     {
      var getEnumerator;
      getEnumerator=function()
      {
       var en,next;
       en=Enumerator.Get(s);
       next=function(e)
       {
        if(e.s)
         {
          if(en.MoveNext())
           {
            e.c=(f(e.c))(en.get_Current());
            return true;
           }
          else
           {
            return false;
           }
         }
        else
         {
          e.c=x;
          e.s=true;
          return true;
         }
       };
       return Enumerator.New(false,next);
      };
      return Enumerable.Of(getEnumerator);
     },
     skip:function(n,s)
     {
      return Enumerable.Of(function()
      {
       var e,i;
       e=Enumerator.Get(s);
       for(i=1;i<=n;i++){
        if(!e.MoveNext())
         {
          Seq.insufficient();
         }
       }
       return e;
      });
     },
     skipWhile:function(f,s)
     {
      return Enumerable.Of(function()
      {
       var e,empty,_this;
       e=Enumerator.Get(s);
       empty=[true];
       while(e.MoveNext()?f(e.get_Current()):false)
        {
         empty[0]=false;
        }
       if(empty[0])
        {
         _this=Seq.empty();
         return Enumerator.Get(_this);
        }
       else
        {
         return Enumerator.New(true,function(x)
         {
          var r;
          if(x.s)
           {
            x.s=false;
            x.c=e.get_Current();
            return true;
           }
          else
           {
            r=e.MoveNext();
            x.c=e.get_Current();
            return r;
           }
         });
        }
      });
     },
     sort:function(s)
     {
      return Seq.sortBy(function(x)
      {
       return x;
      },s);
     },
     sortBy:function(f,s)
     {
      return Seq.delay(function()
      {
       var array;
       array=Arrays.ofSeq(s);
       Arrays.sortInPlaceBy(f,array);
       return array;
      });
     },
     sum:function(s)
     {
      return Seq.fold(function(s1)
      {
       return function(x)
       {
        return s1+x;
       };
      },0,s);
     },
     sumBy:function(f,s)
     {
      return Seq.fold(function(s1)
      {
       return function(x)
       {
        return s1+f(x);
       };
      },0,s);
     },
     take:function(n,s)
     {
      return Enumerable.Of(function()
      {
       var e;
       e=Enumerator.Get(s);
       return Enumerator.New(0,function(_enum)
       {
        if(_enum.s>=n)
         {
          return false;
         }
        else
         {
          if(e.MoveNext())
           {
            _enum.s=_enum.s+1;
            _enum.c=e.get_Current();
            return true;
           }
          else
           {
            e.Dispose();
            _enum.s=n;
            return false;
           }
         }
       });
      });
     },
     takeWhile:function(f,s)
     {
      return Seq.delay(function()
      {
       return Seq.enumUsing(Enumerator.Get(s),function(e)
       {
        return Seq.enumWhile(function()
        {
         if(e.MoveNext())
          {
           return f(e.get_Current());
          }
         else
          {
           return false;
          }
        },Seq.delay(function()
        {
         return[e.get_Current()];
        }));
       });
      });
     },
     toArray:function(s)
     {
      var q,enumerator,e;
      q=[];
      enumerator=Enumerator.Get(s);
      while(enumerator.MoveNext())
       {
        e=enumerator.get_Current();
        q.push(e);
       }
      return q.slice(0);
     },
     toList:function(s)
     {
      return List.ofSeq(s);
     },
     truncate:function(n,s)
     {
      return Seq.delay(function()
      {
       return Seq.enumUsing(Enumerator.Get(s),function(e)
       {
        var i;
        i={
         contents:0
        };
        return Seq.enumWhile(function()
        {
         if(e.MoveNext())
          {
           return i.contents<n;
          }
         else
          {
           return false;
          }
        },Seq.delay(function()
        {
         Operators.Increment(i);
         return[e.get_Current()];
        }));
       });
      });
     },
     tryFind:function(ok,s)
     {
      var e,r,x;
      e=Enumerator.Get(s);
      r=[{
       $:0
      }];
      while(r[0].$==0?e.MoveNext():false)
       {
        x=e.get_Current();
        if(ok(x))
         {
          r[0]={
           $:1,
           $0:x
          };
         }
       }
      return r[0];
     },
     tryFindIndex:function(ok,s)
     {
      var e,loop,i,x;
      e=Enumerator.Get(s);
      loop=[true];
      i=[0];
      while(loop[0]?e.MoveNext():false)
       {
        x=e.get_Current();
        if(ok(x))
         {
          loop[0]=false;
         }
        else
         {
          i[0]=i[0]+1;
         }
       }
      if(loop[0])
       {
        return{
         $:0
        };
       }
      else
       {
        return{
         $:1,
         $0:i[0]
        };
       }
     },
     tryPick:function(f,s)
     {
      var e,r;
      e=Enumerator.Get(s);
      r=[{
       $:0
      }];
      while(Unchecked.Equals(r[0],{
       $:0
      })?e.MoveNext():false)
       {
        r[0]=f(e.get_Current());
       }
      return r[0];
     },
     unfold:function(f,s)
     {
      var getEnumerator;
      getEnumerator=function()
      {
       var next;
       next=function(e)
       {
        var matchValue,t,s1;
        matchValue=f(e.s);
        if(matchValue.$==0)
         {
          return false;
         }
        else
         {
          t=matchValue.$0[0];
          s1=matchValue.$0[1];
          e.c=t;
          e.s=s1;
          return true;
         }
       };
       return Enumerator.New(s,next);
      };
      return Enumerable.Of(getEnumerator);
     },
     windowed:function(windowSize,s)
     {
      if(windowSize<=0)
       {
        Operators.FailWith("The input must be non-negative.");
       }
      return Seq.delay(function()
      {
       return Seq.enumUsing(Enumerator.Get(s),function(e)
       {
        var q;
        q=[];
        return Seq.append(Seq.enumWhile(function()
        {
         if(q.length<windowSize)
          {
           return e.MoveNext();
          }
         else
          {
           return false;
          }
        },Seq.delay(function()
        {
         q.push(e.get_Current());
         return Seq.empty();
        })),Seq.delay(function()
        {
         if(q.length===windowSize)
          {
           return Seq.append([q.slice(0)],Seq.delay(function()
           {
            return Seq.enumWhile(function()
            {
             return e.MoveNext();
            },Seq.delay(function()
            {
             q.shift();
             q.push(e.get_Current());
             return[q.slice(0)];
            }));
           }));
          }
         else
          {
           return Seq.empty();
          }
        }));
       });
      });
     },
     zip:function(s1,s2)
     {
      return Seq.mapi2(function(x)
      {
       return function(y)
       {
        return[x,y];
       };
      },s1,s2);
     },
     zip3:function(s1,s2,s3)
     {
      return Seq.mapi2(function(x)
      {
       return Runtime.Tupled(function(tupledArg)
       {
        var y,z;
        y=tupledArg[0];
        z=tupledArg[1];
        return[x,y,z];
       });
      },s1,Seq.zip(s2,s3));
     }
    },
    Stack:{
     Clear:function(stack)
     {
      return stack.splice(0,stack.length);
     },
     Contains:function(stack,el)
     {
      return Seq.exists(function(y)
      {
       return Unchecked.Equals(el,y);
      },stack);
     },
     CopyTo:function(stack,array,index)
     {
      return Arrays.blit(array,0,array,index,stack.length);
     }
    },
    Strings:{
     Compare:function(x,y)
     {
      return Operators.Compare(x,y);
     },
     CopyTo:function(s,o,d,off,ct)
     {
      return Arrays.blit(Strings.ToCharArray(s),o,d,off,ct);
     },
     EndsWith:function($x,$s)
     {
      var $0=this,$this=this;
      return $x.substring($x.length-$s.length)==$s;
     },
     IndexOf:function($s,$c,$i)
     {
      var $0=this,$this=this;
      return $s.indexOf(Global.String.fromCharCode($c),$i);
     },
     Insert:function($x,$index,$s)
     {
      var $0=this,$this=this;
      return $x.substring(0,$index-1)+$s+$x.substring($index);
     },
     IsNullOrEmpty:function($x)
     {
      var $0=this,$this=this;
      return $x==null||$x=="";
     },
     Join:function($sep,$values)
     {
      var $0=this,$this=this;
      return $values.join($sep);
     },
     LastIndexOf:function($s,$c,$i)
     {
      var $0=this,$this=this;
      return $s.lastIndexOf(Global.String.fromCharCode($c),$i);
     },
     PadLeft:function(s,n)
     {
      return Strings.PadLeftWith(s,n,32);
     },
     PadLeftWith:function(s,n,c)
     {
      return String.fromCharCode.apply(undefined,Arrays.create(n-s.length,c))+s;
     },
     PadRight:function(s,n)
     {
      return Strings.PadRightWith(s,n,32);
     },
     PadRightWith:function(s,n,c)
     {
      return s+String.fromCharCode.apply(undefined,Arrays.create(n-s.length,c));
     },
     RegexEscape:function($s)
     {
      var $0=this,$this=this;
      return $s.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&");
     },
     Remove:function($x,$ix,$ct)
     {
      var $0=this,$this=this;
      return $x.substring(0,$ix)+$x.substring($ix+$ct);
     },
     Replace:function(subject,search,replace)
     {
      var loop,matchValue;
      loop=[];
      loop[1]=subject;
      loop[0]=1;
      while(loop[0])
       {
        matchValue=Strings.ReplaceOnce(loop[1],search,replace);
        if(matchValue===loop[1])
         {
          loop[0]=0;
          loop[1]=matchValue;
         }
        else
         {
          loop[1]=matchValue;
          loop[0]=1;
         }
       }
      return loop[1];
     },
     ReplaceChar:function(s,oldC,newC)
     {
      return Strings.Replace(s,String.fromCharCode(oldC),String.fromCharCode(newC));
     },
     ReplaceOnce:function($string,$search,$replace)
     {
      var $0=this,$this=this;
      return $string.replace($search,$replace);
     },
     Split:function(s,pat,opts)
     {
      var res;
      res=Strings.SplitWith(s,pat);
      if(opts===1)
       {
        return Arrays.filter(function(x)
        {
         return x!=="";
        },res);
       }
      else
       {
        return res;
       }
     },
     SplitChars:function(s,sep,opts)
     {
      var re;
      re="["+Strings.RegexEscape(String.fromCharCode.apply(undefined,sep))+"]";
      return Strings.Split(s,new RegExp(re),opts);
     },
     SplitStrings:function(s,sep,opts)
     {
      var re;
      re=Strings.concat("|",Arrays.map(function(s1)
      {
       return Strings.RegexEscape(s1);
      },sep));
      return Strings.Split(s,new RegExp(re),opts);
     },
     SplitWith:function($str,$pat)
     {
      var $0=this,$this=this;
      return $str.split($pat);
     },
     StartsWith:function($t,$s)
     {
      var $0=this,$this=this;
      return $t.substring(0,$s.length)==$s;
     },
     Substring:function($s,$ix,$ct)
     {
      var $0=this,$this=this;
      return $s.substring($ix,$ix+$ct);
     },
     ToCharArray:function(s)
     {
      return Arrays.init(s.length,function(x)
      {
       return s.charCodeAt(x);
      });
     },
     ToCharArrayRange:function(s,startIndex,length)
     {
      return Arrays.init(length,function(i)
      {
       return s.charCodeAt(startIndex+i);
      });
     },
     Trim:function($s)
     {
      var $0=this,$this=this;
      return $s.replace(/^\s+/,"").replace(/\s+$/,"");
     },
     collect:function(f,s)
     {
      return"".concat.apply("",Arrays.init(s.length,function(i)
      {
       return f(s.charCodeAt(i));
      }));
     },
     concat:function(separator,strings)
     {
      return Seq.toArray(strings).join(separator);
     },
     exists:function(f,s)
     {
      return Seq.exists(f,Strings.protect(s));
     },
     forall:function(f,s)
     {
      return Seq.forall(f,Strings.protect(s));
     },
     init:function(count,f)
     {
      return"".concat.apply("",Arrays.init(count,f));
     },
     iter:function(f,s)
     {
      return Seq.iter(f,Strings.protect(s));
     },
     iteri:function(f,s)
     {
      return Seq.iteri(f,Strings.protect(s));
     },
     length:function(s)
     {
      return Strings.protect(s).length;
     },
     map:function(f,s)
     {
      return Strings.collect(function(x)
      {
       return String.fromCharCode(f(x));
      },Strings.protect(s));
     },
     mapi:function(f,s)
     {
      return"".concat.apply("",Seq.toArray(Seq.mapi(function(i)
      {
       return function(x)
       {
        return String.fromCharCode((f(i))(x));
       };
      },s)));
     },
     protect:function(s)
     {
      if(s===null)
       {
        return"";
       }
      else
       {
        return s;
       }
     },
     replicate:function(count,s)
     {
      return Strings.init(count,function()
      {
       return s;
      });
     }
    },
    Unchecked:{
     Compare:function(a,b)
     {
      var matchValue,matchValue1;
      if(a===b)
       {
        return 0;
       }
      else
       {
        matchValue=typeof a;
        if(matchValue==="undefined")
         {
          matchValue1=typeof b;
          if(matchValue1==="undefined")
           {
            return 0;
           }
          else
           {
            return-1;
           }
         }
        else
         {
          if(matchValue==="function")
           {
            return Operators.FailWith("Cannot compare function values.");
           }
          else
           {
            if(matchValue==="boolean")
             {
              if(a<b)
               {
                return-1;
               }
              else
               {
                return 1;
               }
             }
            else
             {
              if(matchValue==="number")
               {
                if(a<b)
                 {
                  return-1;
                 }
                else
                 {
                  return 1;
                 }
               }
              else
               {
                if(matchValue==="string")
                 {
                  if(a<b)
                   {
                    return-1;
                   }
                  else
                   {
                    return 1;
                   }
                 }
                else
                 {
                  if(a===null)
                   {
                    return-1;
                   }
                  else
                   {
                    if(b===null)
                     {
                      return 1;
                     }
                    else
                     {
                      if("CompareTo"in a)
                       {
                        return a.CompareTo(b);
                       }
                      else
                       {
                        if(a instanceof Array?b instanceof Array:false)
                         {
                          return Unchecked.compareArrays(a,b);
                         }
                        else
                         {
                          return Unchecked.compareArrays(JavaScript.GetFields(a),JavaScript.GetFields(b));
                         }
                       }
                     }
                   }
                 }
               }
             }
           }
         }
       }
     },
     Equals:function(a,b)
     {
      var matchValue;
      if(a===b)
       {
        return true;
       }
      else
       {
        matchValue=typeof a;
        if(matchValue==="object")
         {
          if(a===null)
           {
            return false;
           }
          else
           {
            if(b===null)
             {
              return false;
             }
            else
             {
              if("Equals"in a)
               {
                return a.Equals(b);
               }
              else
               {
                if(a instanceof Array?b instanceof Array:false)
                 {
                  return Unchecked.arrayEquals(a,b);
                 }
                else
                 {
                  return Unchecked.arrayEquals(JavaScript.GetFields(a),JavaScript.GetFields(b));
                 }
               }
             }
           }
         }
        else
         {
          return false;
         }
       }
     },
     Hash:function(o)
     {
      var matchValue;
      matchValue=typeof o;
      if(matchValue==="function")
       {
        return 0;
       }
      else
       {
        if(matchValue==="boolean")
         {
          if(o)
           {
            return 1;
           }
          else
           {
            return 0;
           }
         }
        else
         {
          if(matchValue==="number")
           {
            return o;
           }
          else
           {
            if(matchValue==="string")
             {
              return Unchecked.hashString(o);
             }
            else
             {
              if(matchValue==="object")
               {
                if(o==null)
                 {
                  return 0;
                 }
                else
                 {
                  if(o instanceof Array)
                   {
                    return Unchecked.hashArray(o);
                   }
                  else
                   {
                    return Unchecked.hashObject(o);
                   }
                 }
               }
              else
               {
                return 0;
               }
             }
           }
         }
       }
     },
     arrayEquals:function(a,b)
     {
      var eq,i;
      if(a.length===b.length)
       {
        eq=[true];
        i=[0];
        while(eq[0]?i[0]<a.length:false)
         {
          if(!Unchecked.Equals(a[i[0]],b[i[0]]))
           {
            eq[0]=false;
           }
          i[0]=i[0]+1;
         }
        return eq[0];
       }
      else
       {
        return false;
       }
     },
     compareArrays:function(a,b)
     {
      var cmp,i;
      if(a.length<b.length)
       {
        return-1;
       }
      else
       {
        if(a.length>b.length)
         {
          return 1;
         }
        else
         {
          cmp=[0];
          i=[0];
          while(cmp[0]===0?i[0]<a.length:false)
           {
            cmp[0]=Unchecked.Compare(a[i[0]],b[i[0]]);
            i[0]=i[0]+1;
           }
          return cmp[0];
         }
       }
     },
     hashArray:function(o)
     {
      var h,i;
      h=[-34948909];
      for(i=0;i<=o.length-1;i++){
       h[0]=Unchecked.hashMix(h[0],Unchecked.Hash(o[i]));
      }
      return h[0];
     },
     hashMix:function(x,y)
     {
      return(x<<5)+x+y;
     },
     hashObject:function(o)
     {
      var op_PlusPlus,h;
      if("GetHashCode"in o)
       {
        return o.GetHashCode();
       }
      else
       {
        op_PlusPlus=function(x,y)
        {
         return Unchecked.hashMix(x,y);
        };
        h={
         contents:0
        };
        JavaScript.ForEach(o,function(key)
        {
         h.contents=op_PlusPlus(op_PlusPlus(h.contents,Unchecked.hashString(key)),Unchecked.Hash(o[key]));
         return false;
        });
        return h.contents;
       }
     },
     hashString:function(s)
     {
      var hash,i;
      if(s===null)
       {
        return 0;
       }
      else
       {
        hash=[5381];
        for(i=0;i<=s.length-1;i++){
         hash[0]=Unchecked.hashMix(hash[0],s.charCodeAt(i)<<0);
        }
        return hash[0];
       }
     }
    },
    Util:{
     addListener:function(event,h)
     {
      event.Subscribe(Util.observer(h));
     },
     observer:function(h)
     {
      return Pervasives.New(List.ofArray([["OnCompleted",function(value)
      {
       value;
      }],["OnError",function(value)
      {
       value;
      }],["OnNext",h]]));
     },
     subscribeTo:function(event,h)
     {
      return event.Subscribe(Util.observer(h));
     }
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  WebSharper=Runtime.Safe(Global.IntelliFactory.WebSharper);
  Arrays=Runtime.Safe(WebSharper.Arrays);
  Operators=Runtime.Safe(WebSharper.Operators);
  Array=Runtime.Safe(Global.Array);
  Seq=Runtime.Safe(WebSharper.Seq);
  Unchecked=Runtime.Safe(WebSharper.Unchecked);
  Enumerator=Runtime.Safe(WebSharper.Enumerator);
  Number=Runtime.Safe(Global.Number);
  Char=Runtime.Safe(WebSharper.Char);
  Util=Runtime.Safe(WebSharper.Util);
  Concurrency=Runtime.Safe(WebSharper.Concurrency);
  setTimeout=Runtime.Safe(Global.setTimeout);
  Date=Runtime.Safe(Global.Date);
  Scheduler=Runtime.Safe(Concurrency.Scheduler);
  DateTime=Runtime.Safe(WebSharper.DateTime);
  Json=Runtime.Safe(WebSharper.Json);
  JavaScript=Runtime.Safe(WebSharper.JavaScript);
  List=Runtime.Safe(WebSharper.List);
  T=Runtime.Safe(List.T);
  Error=Runtime.Safe(Global.Error);
  Math=Runtime.Safe(Global.Math);
  Remoting=Runtime.Safe(WebSharper.Remoting);
  XhrProvider=Runtime.Safe(Remoting.XhrProvider);
  JSON=Runtime.Safe(Global.JSON);
  Enumerable=Runtime.Safe(WebSharper.Enumerable);
  Strings=Runtime.Safe(WebSharper.Strings);
  String=Runtime.Safe(Global.String);
  RegExp=Runtime.Safe(Global.RegExp);
  return Pervasives=Runtime.Safe(WebSharper.Pervasives);
 });
 Runtime.OnLoad(function()
 {
  Remoting.EndPoint();
  Remoting.AjaxProvider();
  Concurrency.scheduler();
 });
}());
