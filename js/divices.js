angular.module('diviceManager',['userInfoManger'])
/*设备缓存
数据类型-Array ，
divices:[ {"device_id":1,
  "device_name":"MockHardware_0",
  "alias": "nickName"}]
**/
.factory('diviceCache', function ($cacheFactory) {
        return $cacheFactory("diviceCache");
})

/*获取设备列表
  getDivices(callback(设备列表),errback(data));
**/
.factory('getDivices',['getService', 'diviceCache', 'accountCache', 'mySocket',  function(getService, diviceCache, accountCache){
  return function(callback, errback){
      var account = accountCache.get('account');
      var timestamp = Math.floor(new Date().getTime() / 1000);
      var token =  accountCache.get('token');
      if(account != null && token != null){
        var sign = CryptoJS.MD5(                                // 计算签名
              "/v1/user/device/list" +
              "?account=" +
              account +
              "&timestamp=" +
              timestamp +
              "&token=" +
              token);
        var url = '/v1/user/device/list?account='+account+'&timestamp='+timestamp+'&sign='+sign;
        var successBack = function(params){
          var divices = new Array();
          if(params != null){
            if(params instanceof Array){
              diviceCache.put('divices', params);
            }else{
              divices.push(params);
              diviceCache.put('divices', divices);
            }
          }
          console.log("已获取设备信息");
          callback(params);
        };
        var failBack = function(data){
          if(errback && typeof(errback) == "function"){errback(data);}
        };
        getService('getDivices', url,successBack, failBack);
      }

  }
}])
/*添加设备,先绑定，在获取设备列表，存入缓存
  bindDivice(device_name, callback(设备列表),errback(报错));
**/
.factory('bindDivice',['postService', 'diviceCache', 'accountCache', 'getDivices', function(postService, diviceCache, accountCache, getDivices){
  return function(device_name, callback, errback){
      var account = accountCache.get('account');
      var timestamp = Math.floor(new Date().getTime() / 1000);
      var token =  accountCache.get('token');
      if(account != null && token != null){
        var sign = CryptoJS.MD5(                                // 计算签名
              "/v1/user/device/bind" +
              "?account=" +
              account +
              "&timestamp=" +
              timestamp +
              "&token=" +
              token);
        var url = '/v1/user/device/bind?account='+account+'&timestamp='+timestamp+'&sign='+sign;
        var data = {
          "device_name": device_name // @necessary
        };
        var successBack = function(){
          getDivices(callback);
        }
        var failBack = function(data){
          if(errback && typeof(errback) == "function"){errback(data);}
        };
        postService('bindDivices', url, data,successBack, failBack);
      }

  }
}])
/*解绑设备
  unbindDivice(device_name, callback(),errback(data));
**/
.factory('unbindDivice', function(postService, diviceCache, accountCache){
  return function(divice_name, callback, errback){
    var account = accountCache.get('account');
    var timestamp = Math.floor(new Date().getTime() / 1000 + 10);
    var token =  accountCache.get('token');
    if(account != null && token != null){
      var sign = CryptoJS.MD5(                                // 计算签名
            "/v1/user/device/unbind" +
            "?account=" +
            account +
            "&timestamp=" +
            timestamp +
            "&token=" +
            token);
      var url = '/v1/user/device/unbind?account='+account+'&timestamp='+timestamp+'&sign='+sign;
      var successBack = function(){
        var divices = diviceCache.get('divices');
        for (var i = 0; i < divices.length; i++) {
          if (divices[i].device_name == divice_name) {
            divices.splice(i,1);
          }
        }
        diviceCache.put('divices', divices);
        callback();
      }
      var failBack = function(data){
        if(errback && typeof(errback) == "function"){errback(data);}
      }
      postService('updatePassword', url, data, successBack, failBack);
    }
  }
})
/*更新设备别名
  undataDiviceAlias({ "device_name": "MockHardware_0","alias": "xxx" }, callback(),errback(data));
**/
.factory('updataDiviceAlias', function(postService, diviceCache, accountCache){
  return function(data, callback, errback){
    var account = accountCache.get('account');
    var timestamp = Math.floor(new Date().getTime() / 1000 + 10);
    var token =  accountCache.get('token');
    if(account != null && token != null){
      var sign = CryptoJS.MD5(                                // 计算签名
            "/v1/user/device/update" +
            "?account=" +
            account +
            "&timestamp=" +
            timestamp +
            "&token=" +
            token);
      var url = '/v1/user/device/update?account='+account+'&timestamp='+timestamp+'&sign='+sign;
      var successBack = function(){
        var divices = diviceCache.get('divices');
        for (var i = 0; i < divices.length; i++) {
          if (divices[i].device_name == data.device_name) {
            divices[i].alias = data.alias;
          }
        }
        diviceCache.put('divices', divices);
        callback();
      };
      var failBack = function(data){
        if(errback && typeof(errback) == "function"){errback(data);}
      };
      postService('updataDiviceAlias', url, data, successBack, failBack);
    }
  }
})
