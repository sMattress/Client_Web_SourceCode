angular.module('userInfoManger',['httpService', 'fromNodeJS', 'diviceManager'])
//账户信息缓存
/*
{
   "user_id": 1,
   "account": "xxx",
   "token": "xxx",
   "expires_in": 11232
}
**/
.factory('accountCache', function($cacheFactory){
  return $cacheFactory('accountCache');
})

//用户信息缓存
/*
{"user_id": 1.
 "name": "xxx",
 "brithday": "xxx",
 "sex": 1,
 "imgUrl": "xxx"}
**/
.factory('userinfoCache', function($cacheFactory){
  return $cacheFactory('userinfoCache');
})

/*登陆接口,获取账户信息、令牌、设备列表
  login(callback(设备列表),errback(报错)),
**/
.factory('login', ['getService', 'accountCache','getOpenid','getDivices', function (getService, accountCache, getOpenid, getDivices) {
  var login = function(callback, errback){
    var url = '/v1/platform/login?open_id='+getOpenid().openid+'&access_token='+getOpenid().access_token+'&type=WeChat';
    var successBack = function(param){
      accountCache.put("user_id",param.user_id);
      accountCache.put("account",param.account);
      accountCache.put("token",param.token);
      accountCache.put("expires_in",param.expires_in);
      //获取设备列表
      console.log("已自动登录");
      getDivices(callback);
    };
    var failBack = function(data){
      if(errback && typeof(errback) == "function"){errback(data);}
    };
    getService('login', url, successBack, failBack);

  }
  return login;
}])



/*绑定用户接口，然后登陆，获取令牌
  band(account,password,callback(设备列表), errback)
**/
.factory('band',['postService','getOpenid', 'login', function(postService,getOpenid, login){
  return function(account, password, callback, errback){
    var data = {"account": account,"open_id": getOpenid().openid,"type": 'WeChat',"password":password};
    var successBack = function(param){
      login(callback);
    };
    var failBack = function(data){
      if(errback && typeof(errback) == "function"){errback(data);}
    };
    postService('band', '/v1/platform/register', data, successBack, failBack);
  };
}])

//注册用户接口，然后绑定，最后登陆，获取用户令牌
/*
  register(account,password,callback(设备列表),errback(报错)),
  callback:回调函数
**/
.factory('register',['postService','getOpenid', 'band', function(postService, getOpenid, band){
  return function(account, password, callback){
    console.log("开始注册");
    var data = {"account":account, "password":password};
    var creatcallback = function(){
      alert("创建新用户成功！");
      band(account,password,callback);
    };
    var failBack = function(data){
      if(errback && typeof(errback) == "function"){errback(data);}
    };
    postService('createNewAccount', '/v1/user/register',data, creatcallback, failBack);

  }
}])
//解绑账户
/*
  register(callback(),errback(报错)),
**/

.factory('unbind', ['getService', 'getOpenid', 'accountCache', function(getService, getOpenid, accountCache){
   return function(callback,errback){
     accountCache.removeAll();
     callback();
   }
}])

//获取用户信息
/*
  register(callback(用户信息),errback(报错)),
**/
.factory('getUserInfo',['getService', 'accountCache', 'userinfoCache', function(getService, accountCache, userinfoCache){
  return function(callback,errback){
    var account = accountCache.get('account');
    var timestamp = Math.floor(new Date().getTime() / 1000);
    var token =  accountCache.get('token');
    if(account != null && token != null){
      var sign = CryptoJS.MD5(                                // 计算签名
            "/v1/user/get/base_info" +
            "?account=" +
            account +
            "&timestamp=" +
            timestamp +
            "&token=" +
            token);
      var url = '/v1/user/get/base_info?account='+account+'&timestamp='+timestamp+'&sign='+sign;
      var failBack = function(data){
        if(errback && typeof(errback) == "function"){errback(data);}
      }
      getService('getUserInfo', url, function(params){
        userinfoCache.put('user_id', params.user_id);
        userinfoCache.put('name', params.name);
        userinfoCache.put('birthday', params.birthday);
        userinfoCache.put('sex', params.sex);
        userinfoCache.put('imgUrl', params.imgUrl);
        callback(params);
      }, failBack);
    }
}
}])
//更新用户信息
/*
updateUserInfo(data,callback(), errback(报错))
data:{
    "name": "xxx",      // @option
    "brithday": "xxx",  // @option
    "sex": 1,           // @option
    "img_url": "xxx"     // @option
}
**/
.factory('updateUserInfo', function(postService, accountCache, userinfoCache){
  return function(data,callback, errback){
    var account = accountCache.get('account');
    var timestamp = Math.floor(new Date().getTime() / 1000 + 10);
    var token =  accountCache.get('token');
    if(account != null && token != null){
      var sign = CryptoJS.MD5(                                // 计算签名
            "/v1/user/update/base_info" +
            "?account=" +
            account +
            "&timestamp=" +
            timestamp +
            "&token=" +
            token);
      var url = '/v1/user/update/base_info?account='+account+'&timestamp='+timestamp+'&sign='+sign;
      var successBack = function(){
        userinfoCache.put('user_id', data.user_id);
        userinfoCache.put('name', data.name);
        userinfoCache.put('brithday', data.brithday);
        userinfoCache.put('sex', data.sex);
        userinfoCache.put('imgUrl', data.imgUrl);
        callback();
      }
      var failBack = function(data){
        if(errback && typeof(errback) == "function"){errback(data);}
      }
      postService('updateUserInfo', url, data, successBack, failBack);
  }
}
})
/*修改用户密码
updatePassword({ "new_password": "xxx","old_password": "xxx" }, callback(), errback(报错))
**/
.factory('updatePassword', function(postService, accountCache){
  return function(data, callback, errback){
    var account = accountCache.get('account');
    var timestamp = Math.floor(new Date().getTime() / 1000 + 10);
    var token =  accountCache.get('token');
    if(account != null && token != null){
      var sign = CryptoJS.MD5(                                // 计算签名
            "/v1/user/update/base_info" +
            "?account=" +
            account +
            "&timestamp=" +
            timestamp +
            "&token=" +
            token);
      var url = '/v1/user/update/secure_info?account='+account+'&timestamp='+timestamp+'&sign='+sign;
      var successBack = function(){
        callback();
      }
      var failBack = function(data){
        if(errback && typeof(errback) == "function"){errback(data);}
      }
      postService('updatePassword', url, data, successBack, failBack);
    }
  }
})
