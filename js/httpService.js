angular.module('httpService', [])
//发送get请求
/*
getService(操作名字, 二级域名, 回调函数(params), 错误回调函数（data))
**/
.factory('getService',['$http', 'server', 'writeObj', function($http, server, writeObj){
    var getService = function(name, secondurl, callback, errback){
      var url = server.ip + secondurl;
      $http.get(url,{ cache: true })
        .success(function(data) {
          if(data.flag == 1){
            if (callback && typeof(callback) == "function") {
              if(data.params != null){
                if(data.params.length == 1){
                  callback(data.params[0]);
                }else{
                  callback(data.params);
                }
              }else{
                callback();
              }
            }
          }else{
            console.log(name + " fail err_code=>" + data.err_code + " cause=>" + writeObj(data.cause));
            if(errback && typeof(errback) == "function"){errback(data);}
          }
        })
        .error(function(data) {
          console.log(name + " connect fail "+writeObj(data));
          errback(data);
        });

    };
    return getService;
}])
//发送post请求
/*
  postService(操作名字, 二级域名 , 数据, 回调函数(params), 错误回调函数（data))
**/
.factory('postService',['$http', 'server', 'writeObj', function($http, server, writeObj){
    var postService = function(name, secondurl, data, callback, errback){
      var url = server.ip + secondurl;
      $http.post(url, data, { cache: true })
        .success(function(data) {
          if(data.flag == 1){
            if (callback && typeof(callback) == "function") {
              if(data.params != null){
                if(data.params.length == 1){
                  callback(data.params[0]);
                }else{
                  callback(data.params);
                }
              }else{
                callback();
              }
            }
          }else{
            console.log(name + " fail err_code=>" + data.err_code + " cause=>" + writeObj(data.cause));
            if(errback && typeof(errback) == "function"){errback(data);}
          }
        })
        .error(function(data) {
          console.log(name + " connect fail "+ writeObj(data));
          if(errback && typeof(errback) == "function"){errback(data);}
        });

    };
    return postService;
}])
.factory('writeObj',function(){
  return function(o){
      var r=[];
      if(typeof o=="string"){
      return "\""+o.replace(/([\'\"\\])/g,"\\$1").replace(/(\n)/g,"\\n").replace(/(\r)/g,"\\r").replace(/(\t)/g,"\\t")+"\"";
      }
      if(typeof o=="object"){
      if(!o.sort){
      for(var i in o){
      r.push(i+":"+ arguments.callee(o[i]));
      }
      if(!!document.all&&!/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)){
      r.push("toString:"+o.toString.toString());
      }
      r="{"+r.join()+"}";
      }else{
      for(var i=0;i<o.length;i++){
      r.push( arguments.callee(o[i]))
      }
      r="["+r.join()+"]";
      }
      return r;
      }
      return o.toString();
      }
});
