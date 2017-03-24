//socket连接、判断设备
angular.module('starter.services', [])

//通过socket连接服务器
/*
openSocket(callback, errback); 打开socket连接
sendMsg(cmd, params, callback, errback); 向socket服务器发送信息
**/
.factory('mySocket', function ($rootScope ) {
  var socket = new WebSocket('ws://smartmattress.lesmarthome.com:4321');
  //var socket = new WebSocket('ws://192.168.1.113:4321');
  var msgId = 0;
  var device_name_ing = '';
  var callbackArray = new Array();
  var errbackArray = new Array();
  var cacheArray = new Array();
  $rootScope.isConnected = false;

  /*分析返回数据
  成功=>"body":{"version": 1.0,"flag": 1,}
  失败=>"body":{"version": 1.0,"flag": 0,"errCode": 16}
  */
  var checkBody = function(body){
    //check flag
    if(body.flag == 1)return true;
    console.log("websocket error code=>"+ body.errCode +"-cause=>" + body.cause);
    return false;
  };

  //注册方法
  var register = function(callback, errback){
    console.log("websocket register to server....");
    var msg = '{"from":"maxpup","to":"server","msgId":0,"msgType":1,"version":"2.0","state":1,"body":{"version":"1.0","cmd":64,"params": [{"deviceType":"Web"}]}}\r\n';
    socket.send(msg);
    callbackArray[0] = function(body){
      $rootScope.isConnected = true;
      callback(body);
      for(var msg_str in cacheArray){
      	socket.send(msg_str);
      	console.log("websocket sendmsg =>" + msg_str);
      }
      console.log('cacheArray is clear');
      
    };
    errbackArray[0] = errback;
  }
  // 监听消息
  socket.onmessage = function(event) {
    console.log('websocket client received a message',event);
    var msgData = event.data;
    var msgJson = JSON.parse(msgData);
    var getmsgId = msgJson.msgId;
    console.log("websocket接收到信息=》" + getmsgId);
    if(checkBody(msgJson.body)){
      //信息返回正确
      if(callbackArray[getmsgId] != null){
          callbackArray[getmsgId](msgJson.body);
      }
    }else{
      //信息返回错误
      if(errback[getmsgId] != null){
        errback[getmsgId](msgJson.body);
      }
    }
  };
  // 监听Socket的关闭
  socket.onclose = function(event) {
    console.log('websocket Client notified socket has closed');
    console.log(event.toString());
    $rootScope.isConnected = false;
    openSocket(function(){
      console.log("服务器已重新注册成功");
      for(var msg_str in cacheArray){
      	socket.send(msg_str);
      	console.log("websocket sendmsg =>" + msg_str);
      }
    },function(){
      console.log("还是失败了，[伤心](；′⌒`)");
    });
  };
  // 关闭Socket....
  //socket.close()
  // 打开Socket
  var openSocket = function(callback, errback){
      register(callback, errback);
      socket.onopen = function(event) {
        console.log("socket已打开");
        //向服务器注册
      };
}
  //发送信息
  var sendMsg = function(cmd, params, callback, errback){
    if(device_name_ing != ''){ //设备名不可为空
      var msg = {
          "from" : "maxpup",    // @necessary - head
          "to" : device_name_ing,      // @necessary - head
          "msgId": ++msgId,       // @necessary - head
          "msgType": 1,     // @necessary - head
          "version": "2.0",  // @necessary - head
          "state": 1,       // @necessary - head
          "body": {
            "version": "1.0",
            "cmd": 16,
            "params": []
          }
      };
      msg.body.cmd = cmd;
      msg.body.params = params;
      var str_msg = JSON.stringify(msg) + '\r\n';
      if($rootScope.isConnected != true){
		console.log("msg"+msg.msgId+" puted in cacheArray")    
        cacheArray.push(str_msg)
      }else {
        console.log("websocket sendmsg "+msg.msgId+"=>" + str_msg);
        socket.send(str_msg);
      }
      callbackArray[msgId] = callback;
      errbackArray[msgId] = errback;
    }else {
      alert("设备名为空");
    }

  };
  var switchDevice = function(device_name){
    console.log("切换设备名=>" + device_name);
    device_name_ing = device_name;
  }
  return {
    openSocket:openSocket,
    sendMsg:sendMsg,
    switchDevice:switchDevice
  };
})

  //判断访问终端
.factory('identifyDivice',function() {
var browser={
    versions:function(){
        var u = navigator.userAgent, app = navigator.appVersion;
        return {
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
            weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
            qq: u.match(/\sQQ/i) == " qq" //是否QQ
        };
    }(),
    language:(navigator.browserLanguage || navigator.language).toLowerCase()
  }
})
