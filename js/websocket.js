//通过socket连接服务器
/*
Mysocket(websocket地址，发送方标志名)

Mysocket.openSocket(成功回调,失败回调);
Mysocket.Msg(接收方标志名,body);
Mysocket.sendMsg(Mysocket.Msg(接收方标志名,body),成功回调,失败回调);
**/
function Mysocket(url, myName){
  var msgId = 0;//0为注册回调id号
  var callbackArray = new Array();
  var errbackArray = new Array();
  var cacheArray = new Array();
  var isConnected = false;

  var socket = new WebSocket(url);
  //注册socket
  function openSocket(callback, errback){
      register(callback, errback);
      // socket.onopen = function(event) {
      //   console.log("socket已打开");
      //   //向服务器注册
      // };
  };
  //创建Msg
  function Msg(to,body){
    if(to === '')throw "目标名不可为空";
    if(!body.version===undefined||!body.cmd===undefined||!body.params instanceof Array)throw 'body格式不正确';
    var msg = {
        "from" : myName,    // @necessary - head
        "to" : to,      // @necessary - head
        "msgId": msgId++,       // @necessary - head
        "msgType": 1,     // @necessary - head
        "version": "2.0",  // @necessary - head
        "state": 1,       // @necessary - head
        "body": body
      };
    return JSON.stringify(msg);
  };
  //发送socket信息
  function sendMsg(msg,callback, errback) {
    if(isConnected != true){
      console.log("msg"+" puted in cacheArray")
      cacheArray.push(msg)
    }else {
      console.log("websocket sendmsg "+"=>" + msg);
      socket.send(msg);
    }
    callbackArray[msg.msgId] = callback;
    errbackArray[msg.msgId] = errback;
  }
  function waitForConnection(callback, interval) {
    if (socket.readyState === 1) {
        callback();
    } else {
        var that = this;
        // optional: implement backoff for interval here
        setTimeout(function () {
            waitForConnection(callback, interval);
        }, interval);
    }
  };

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
    var msg = Msg("server",{"version":"1.0","cmd":64,"params": [{"deviceType":"Web"}]});
    waitForConnection(function () {
      console.log("send register msg =>"+msg);
      socket.send(msg);
    }, 1000);

    callbackArray[0] = function(body){
      console.log("websocket register success");
      isConnected = true;
      callback(body);
      for(var i=0;i<cacheArray.length;i++){
      	socket.send(cacheArray[i]);
      	console.log("websocket sendmsg =>"+cacheArray[i]);
      }
      console.log('cacheArray is clear');

    };
    errbackArray[0] = errback;
  };
  // 监听消息
  socket.onmessage = function(event) {
    console.log('websocket client received a message',event);
    var msgData = event.data;
    var msgJson = JSON.parse(msgData);
    var getmsgId = msgJson.msgId;
    if(checkBody(msgJson.body)){
      //信息返回正确
      if(callbackArray[getmsgId] != null){
          callbackArray[getmsgId](msgJson.body);
      }
    }else{
      //信息返回错误
      if(errbackArray[getmsgId] != null){
        errbackArray[getmsgId](msgJson.body);
      }
    }
  };
  // 监听Socket的关闭
  socket.onclose = function(event) {
    console.log('websocket Client notified socket has closed');
    console.log(event.toString());
    isConnected = false;
    // this.openSocket(function(){
    //   console.log("服务器已重新注册成功");
    //   for(var msg_str in cacheArray){
    //     socket.send(msg_str);
    //     console.log("websocket sendmsg =>" + msg_str);
    //   }
    // },function(){
    //   console.log("还是失败了，[伤心](；′⌒`)");
    // });
  };
  this.url = url;
  this.myName = myName;
  this.openSocket = openSocket;
  this.Msg = Msg;
  this.sendMsg = sendMsg;
}
//实例
var socket = new Mysocket('ws://smartmattress.lesmarthome.com:4321','maxpup');
socket.openSocket(function(data){
  console.log("外部调用=》打开硬件成功"+data);
},function(data){
  console.log("打开硬件失败"+data);
})
var msg = socket.Msg('d8b04cb57dbc',{
  "version": "1.0",
  "cmd": 20,
  "params": [
      {
          "powerOn": 1
      }
  ]
});
socket.sendMsg(msg,function(data){
  console.log("外部调用=》发生信息成功"+data);
},function(){
  console.log("发生信息失败");
});
