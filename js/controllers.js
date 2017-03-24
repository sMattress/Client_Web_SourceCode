angular.module('starter.controllers', ['ionic-timepicker','ui.bootstrap.progressCircle','ion.rangeslider', 'userInfoManger','diviceManager'])
//登录事务
.controller('loginCtrl', function($scope, band, login, $state, getDivices, $ionicPopup) {
  $scope.autoLogin = true;
  //自动登陆，获取account、设备信息
  // login(function(divices){
  //   //$state.go('tab.setting');
  //   $scope.autoLogin = true;
  //
  //   if(divices == null){
  //     $state.go('addDivice');
  //   }else{
  //     console.dir(divices);
  //   }
  // });
  $scope.account = {'value':''};
  $scope.isAccountNull = false;
  $scope.isAccountFalsePattern = false;
  $scope.password = {'value':''};
  $scope.isPasswordNull = false;
  $scope.isPasswordFalsePattern = false;
  var regx1 = /^1[34578]\d{9}$/;
  var regx2 = /^[a-zA-Z][\w\^]{7,32}$/;
  $scope.$watch('account.value',function(newValue, oldValue){
    if(newValue != oldValue){
      if($scope.account.value == ''){
        $scope.isAccountNull = true;
      }else {
        $scope.isAccountNull = false;
      }
      if(!regx1.test($scope.account.value)){
        $scope.isAccountFalsePattern = true;
      }else{
        $scope.isAccountFalsePattern = false;
      }
    }
  });
  $scope.$watch('password.value',function(newValue, oldValue){
    if(newValue != oldValue){
      if($scope.password.value == ''){
        $scope.isPasswordNull = true;
      }else {
        $scope.isPasswordNull = false;
      }
      if(!regx2.test($scope.password.value)){
        $scope.isPasswordFalsePattern = true;
      }else{
        $scope.isPasswordFalsePattern = false;
      }
    }
  });

  $scope.loginbtn_click = function(){
    band($scope.account.value, $scope.password.value, function(data){
      alert("绑定用户成功！");
      $state.go('tab.setting');
    });
  }

})
//注册事务
.controller('registerCtrl', function($scope, register) {
  $scope.account = {'value':''};
  $scope.isAccountNull = false;
  $scope.isAccountFalsePattern = false;
  $scope.password = {'value':''};
  $scope.isPasswordNull = false;
  $scope.isPasswordFalsePattern = false;
  var regx1 = /^1[34578]\d{9}$/;
  var regx2 = /^[a-zA-Z][\w\^]{7,32}$/;
  $scope.$watch('account.value',function(newValue, oldValue){
    if(newValue != oldValue){
      if($scope.account.value == ''){
        $scope.isAccountNull = true;
      }else {
        $scope.isAccountNull = false;
      }
      if(!regx1.test($scope.account.value)){
        $scope.isAccountFalsePattern = true;
      }else{
        $scope.isAccountFalsePattern = false;
      }
    }
  });
  $scope.$watch('password.value',function(newValue, oldValue){
    if(newValue != oldValue){
      if($scope.password.value == ''){
        $scope.isPasswordNull = true;
      }else {
        $scope.isPasswordNull = false;
      }
      if(!regx2.test($scope.password.value)){
        $scope.isPasswordFalsePattern = true;
      }else{
        $scope.isPasswordFalsePattern = false;
      }
    }
  });
  $scope.registerbtn_click = function() {
    register($scope.account.value, $scope.password.value, function(data){
      $state.go('tab.setting');
    });
  }
})
//温度控制总
.controller('settingCtrl', function($scope, diviceCache) {

})
//即时加热
.controller('instantController', function($scope, mySocket, register, $interval, diviceCache, $rootScope) {
  $scope.power = false;
  $scope.left_temper = 37;
  $scope.right_temper = 37;
  $scope.left_state = "待机";
  $scope.right_state = "待机";
  $scope.left_heat_state = false;
  $scope.left_treat_state = false;
  $scope.right_heat_state = false;
  $scope.right_treat_state = false;
  $scope.isTemperNumberChange = false;
  $scope.msg = "待机中....";
  $scope.instantSwitchDevice = function(alias, divice_name) {
    mySocket.switchDevice(divice_name);
    $scope.device_alias = alias;
    $scope.msg = "切换设备中....";
    getInstant();
    $scope.$apply();
  };
  $scope.temper_click = function(index){
    switch (index) {
      case 0: //左温度加
        if($scope.left_heat_state == true){
          $scope.left_temper++;
        };
        break;
        case 1: //左温度减
          if($scope.left_heat_state == true){
            $scope.left_temper--;
          };
          break;
        case 2: //右温度加
          if($scope.right_heat_state == true){
            $scope.right_temper++;
          };
          break;
        case 3: //右温度减
          if($scope.right_heat_state == true){
            $scope.right_temper--;
          };
          break;
        case 4: //左加热
          $scope.left_heat_state = !$scope.left_heat_state;
          if($scope.left_treat_state == true && $scope.left_heat_state==true){
            $scope.left_treat_state = false;
          }
          break;
        case 5: //右加热
          $scope.right_heat_state = !$scope.right_heat_state;
          if($scope.right_treat_state == true && $scope.right_heat_state==true){
            $scope.right_treat_state = false;
          }
          break;
        case 6: //左理疗
          $scope.left_treat_state = !$scope.left_treat_state;
          if($scope.left_treat_state == true && $scope.left_heat_state==true){
            $scope.left_heat_state = false;
          }
          break;
        case 7: //右理疗
          $scope.right_treat_state = !$scope.right_treat_state;
          if($scope.right_treat_state == true && $scope.right_heat_state==true){
            $scope.right_heat_state = false;
          }
          break;
      default:
    }
    if($scope.left_temper>= 25 && $scope.left_temper<=45 && $scope.right_temper>=25 && $scope.right_temper<=45){
      updateState(2);
    }else if ($scope.left_temper>= 25 && $scope.left_temper<=45) {
      updateState(1);
    }else if ($scope.right_temper>=25 && $scope.right_temper<=45) {
      updateState(0);
    }else{
      $scope.msg = "加热温度必须在25℃~45℃之间";
    }
  }
  $scope.$watch('left_heat_state', function(newValue, oldValue){
    if(newValue != oldValue){
      if(newValue == true){
        $scope.left_state = "加热";
      }else{
        $scope.left_state = "待机";
      }
    }
  });
  $scope.$watch('left_treat_state', function(newValue, oldValue){

    if(newValue != oldValue){
      if(newValue == true){
        $scope.left_state = "理疗";
      }else{
        $scope.left_state = "待机";
      }
    }
  });
  $scope.$watch('right_heat_state', function(newValue, oldValue){
    if(newValue != oldValue){
      if(newValue == true){
        $scope.right_state = "加热";
      }else{
        $scope.right_state = "待机";
      }
    }
  });
  $scope.$watch('right_treat_state', function(newValue, oldValue){
    if(newValue != oldValue){
      if(newValue == true){
        $scope.right_state = "理疗";
      }else{
        $scope.right_state = "待机";
      }
    }
  });
  $scope.$watch('power',function(newValue, oldValue){
  });
  // var callback = function(data){
  //   console.log('注册成功');
  // }
  // register('18215609686','tt123456', callback);
  //设置温度progress circle
  $scope.size = 130;
  $scope.progress = 37;
  //查看最新状态
  $scope.msg = "服务器已注册，数据获取中...";
  $scope.device_alias = diviceCache.get('divices')?diviceCache.get('divices')[0].alias:'无设备';
  getInstant();

  function getInstant(){
      var params = [{"side":2}];
      mySocket.sendMsg( 32, params, function(body){
        //更新数据
        console.log("已获取即时控制最新数据");
        $scope.right_temper = body.params[0].currentTemperature;
        $scope.left_temper = body.params[1].currentTemperature;
        if(body.params[0].mode == 1){
          $scope.right_heat_state = true;
        }else if(body.params[0].mode == 2){
          $scope.right_treat_state = true;
        }
        if(body.params[1].mode == 1){
          $scope.left_heat_state = true;
        }else if(body.params[1].mode == 2){
          $scope.left_treat_state = true;
        }
        $scope.msg = "数据已更新...";
        $scope.$apply();//需要手动刷新
      });
    };




  var updateState = function(index){
    $scope.msg = "数据发送中...";
    var left_mode = $scope.left_heat_state? 1:($scope.left_treat_state? 2:0);
    var right_mode = $scope.right_heat_state? 1:($scope.right_treat_state? 2:0);
    var params = [];
    switch (index) {
      case 0: //发送右侧数据
        params.push({
            "side": 0,
            "mode": right_mode,
            "targetTemperature": $scope.right_temper,
            "currentTemperature": 0
          });
        break;
        case 1: //发送左侧数据
          params.push({
            "side": 1,
            "mode": left_mode,
            "targetTemperature": $scope.left_temper,
            "currentTemperature": 0
            });
          break;
        case 2://发送两侧数据
        params = [
          {
            "side": 0,
            "mode": right_mode,
            "targetTemperature": $scope.right_temper,
            "currentTemperature": 0
          },
          {
            "side": 1,
            "mode": left_mode,
            "targetTemperature": $scope.left_temper,
            "currentTemperature": 0
          }
        ];
      default:
    }

    var callback = function(body){
      $scope.msg = "数据发送成功";
      $scope.$apply();
    };
    mySocket.sendMsg( 16, params, callback);
  }

})
//加热预约
.controller('heatController', function($scope, ionicTimePicker, mySocket, $rootScope, diviceCache) {
  $scope.modeSwitch = false; //功能开关
  $scope.changModeSwitch = function(){ //切换模式
    $scope.modeSwitch = !$scope.modeSwitch;
  };
  $scope.side_str = '左';
  $scope.switchSide = function() { //切换左右床
    $scope.side_str = ($scope.side_str == '左')? '右':'左';
    getWarm();
  }
  $scope.targetTemperature = 30; //目标温度
  $scope.startTime = '点击设置时间'; //加热开始时间
  $scope.startTime_int = 0; //加热开始时间值
  $scope.autoTemperatureControl = false;
  $scope.heatSwitchDevice = function(alias, device_name){
    $scope.device_alias = alias;
    mySocket.switchDevice(device_name);
    getWarm();
    $scope.$apply();
  }
  //查询加热状态
  var getWarm = function(){
    var sideId = ($scope.side_str=='右')?0:1;
    var params = [{"side":sideId}];
    var successBack = function(body){
      console.log("已获取加热数据");
      loadData(body.params[0]); //更新数据

    };
    mySocket.sendMsg(33, params, successBack);
  };
  //更新加热状态
  $scope.updateWarm = function(){
    var params = [{
            "modeSwitch": (($scope.modeSwitch==true)?1:0),
            "side": (($scope.side_str=='右')?0:1),
            "targetTemperature": $scope.targetTemperature,
            "protectTime": 2100,
            "startTime": $scope.startTime_int,
            "autoTemperatureControl": $scope.autoTemperatureControl==true?1:0
        }];
    var successBack = function(body){
      if(body.flag==1){
        alert("更新加热预约成功！");
      }else{
        alert("更新加热预约失败！");
      }
    }
    mySocket.sendMsg(17, params, successBack);
  }
  //刷新界面数据
  var loadData = function(body){
    $scope.modeSwitch = body.modeSwitch;
    $scope.targetTemperature = body.targetTemperature;
    $scope.startTime = formatTime(body.startTime);
    $scope.autoTemperatureControl = body.autoTemperatureControl;

  }
  //获取数据
	$scope.device_alias = diviceCache.get('divices')?diviceCache.get('divices')[0].alias:'无设备';
   	getWarm();

  //设置 Timepicker
  $scope.showTimePicker = function(){
  var ipObj1 = {
   callback: function (val) {      //Mandatory
     if (typeof (val) === 'undefined') {
       console.log('Time not selected');
     } else {
       $scope.startTime = formatTime(val);
       $scope.startTime_int = val;
     }
   },
   inputTime: 50400,   //Optional
   format: 12,         //Optional
   step: 15,           //Optional
   setLabel: '确定'    //Optional
  };
  ionicTimePicker.openTimePicker(ipObj1);
  }
  //转换时间格式
  var formatTime = function(val){
      var selectedTime = new Date(val * 1000);
      var hours = 9, minutes = "00", state = "PM";
      if(selectedTime.getUTCHours()>13){
        state = "PM";hours = selectedTime.getUTCHours()-12;
      }else{
        state = "AM";hours = selectedTime.getUTCHours();
      }
      if(selectedTime.getUTCMinutes()<10){
        minutes = "0" + selectedTime.getUTCMinutes();
      }else {
        minutes = selectedTime.getUTCMinutes();
      }
      return hours + ":" + minutes + " " + state;
    };
})
.controller('therapyController', function($scope, mySocket, $rootScope, diviceCache) {
  $scope.modeSwitch = false; //功能开关
  $scope.changModeSwitch = function(){ //切换模式
    $scope.modeSwitch = !$scope.modeSwitch;
  };
  $scope.side_str = '左';
  $scope.device_alias = '';
  $scope.workTime = 10;
  $scope.startTime = {'value':0};
  $scope.overTime = {'value':0};
  //设备切换
  $scope.therepySwitchDevice = function(alias, device_name){
    $scope.device_alias = alias;
    mySocket.switchDevice(device_name);
    getTherapy();
    $scope.$apply();
  };
  $scope.$watch('therapy_time', function(newValue, oldValue){
    if(newValue != oldValue){
      console.dir(newValue);
    }

  });
  $scope.switchSide = function() { //切换左右床
    $scope.side_str = ($scope.side_str == '左')? '右':'左';
    getTherapy();
  }
  $scope.updateSlider = function(from, to) {
    $scope.startTime.value = from;
    $scope.overTime.value = to;
  }
  //查询理疗预约单
  function getTherapy(){
    var sideId = ($scope.side_str=='右')?0:1;
    var params = [{"side":sideId}];
    var callback = function(body){
        console.log("已取得理疗预约数据");
        loadData(body.params[0])
      }
      mySocket.sendMsg(34, params, callback);
    };
    var loadData = function(data){
      $scope.workTime = data.workTime/60;
      $scope.startTime.value = data.startTime;
      $scope.overTime.value = data.overTime;
      $scope.modeSwitch = data.modeSwitch==1?true:false;
      $scope.$apply();
    };
    $scope.updateTherapy = function(){
      var param = {
        "modeSwitch": $scope.modeSwitch?1:0,
        "side": (($scope.side_str=='右')?0:1),
        "workTime": $scope.workTime*60,
        "startTime":$scope.startTime.value,
        "overTime": $scope.overTime.value,
      };
      var params = [param];
      mySocket.sendMsg(18,params,function(body){
        if(body.flag==1){
          alert("更新数据成功！");
        }else{
          alert("更新数据失败！");
        }
      });
    }
    //获取最新数据
    $scope.device_alias = diviceCache.get('divices')?diviceCache.get('divices')[0].alias:'无设备';
    getTherapy();

})
//账户
.controller('accountCtrl', function($scope, $ionicPopup, $timeout, login, getUserInfo, $state){
  // //$scope.userImg = "../img/userImg.png";
  // //调试专用
  // login(function(){
  //   console.log("登陆成功");
  //   getUserInfo(function(params){
  //     $scope.userImg = params.imgUrl? params.imgUrl : "../img/userImg.png";
  //     $scope.userName = params.name!='NOName'? params.name : '我';
  //   });
  // });
  getUserInfo(function(params){
      $scope.userImg = params.imgUrl? params.imgUrl : "img/userImg.png";
      $scope.userName = params.name!='NOName'? params.name : '我';
  });
  $scope.showLogoutPop = function(){
    var myPopup = $ionicPopup.show({
    template: '确认登出账户？',
    title: '登出账户',
    scope: $scope,
    buttons: [
      { text: '取消' },
      {
        text: '<b>确定</b>',
        type: 'button-positive',
        onTap: function(e) {

        }
      },
    ]
  });
  myPopup.then(function(res) {
    $state.go('login');
  });
  $timeout(function() {
     myPopup.close(); //由于某种原因3秒后关闭弹出
  }, 3000);
  }
})
//个人信息事务
.controller('personCtrl', function($scope, userinfoCache){
  $scope.userImg = userinfoCache.get('imgUrl')? params.imgUrl : "img/userImg.png";
  $scope.userName = userinfoCache.get('name');
  $scope.birthday = userinfoCache.get('birthday');
  $scope.sex = userinfoCache.get('sex') == 1? '男':'女';

})
//编辑个人信息
.controller('editPersonCtrl', function($scope, userinfoCache, updateUserInfo){
  $scope.userImg = {'value':userinfoCache.get('imgUrl')? params.imgUrl : "img/userImg.png"} ;
  $scope.userName = {'value':userinfoCache.get('name')};
  var arr1 = userinfoCache.get('birthday').split("-");
  var date1 = new Date(arr1[0],parseInt(arr1[1])-1,arr1[2]);
  $scope.birthday = date1;
  $scope.sex = {'value':userinfoCache.get('sex')=='0'? '女' : '男'};
  $scope.updateUserInfo = function(){
    var data = {
       "name": $scope.userName.value,      // @option
       "birthday": $scope.birthday.value,  // @option
       "sex": $scope.sex.value == '女'?0:1,           // @option
       "img_url": userinfoCache.imgUrl     // @option
    };
    updateUserInfo(data,function(){
      alert('成功');
    })
  }
})
//设备信息事务
.controller('divicesCtrl', function($scope, diviceCache, $ionicPopup, updataDiviceAlias){
  $scope.divices = diviceCache.get('divices');
  $scope.changeAlias = function(divice_name){
    $scope.data={"device_name":divice_name};
    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="data.alias">',
      title: '输入设备别名',
      subTitle: '设备别名为您的个性标志',
      scope: $scope,
      buttons: [
        { text: '取消' },
        {
          text: '<b>修改</b>',
          type: 'button-positive',
          onTap: function(e) {
            //e为mouseEvent
            if (!$scope.data.alias) {
              //不允许用户关闭，除非输入设备名
              e.preventDefault();
            } else {
              return $scope.data.alias;
            }
          }
        },
      ]
    });
    myPopup.then(function(alias) {
      console.dir($scope.data);
      var successBack = function() {
        for (var divice in $scope.divices) {
          if (divice.device_name == divice_name) {
            divice.alias = alias;
          }
        }
      }
      var failBack = function(data){
        alert('服务器网络连接失败');
      }
      updataDiviceAlias($scope.data, successBack, failBack);

    });

  };
})
//绑定设备事务
.controller('addDiviceCtrl', function($scope, bindDivice, $ionicPopup, writeObj,$ionicPlatform,$cordovaBarcodeScanner){
  $scope.loading = {
    'show':false,
    'msg':'loading...'
  }
  $scope.hint={"msg":'您现在还没有设备，请添加'}
  $scope.divices = [];
  $scope.ng_show = {"goTC":false};
  $scope.deviceWifi = function(){
    console.log("开始配网-ios");
//    window.broadcaster.fireNativeEvent( "test.event", { item:'test data' }, function() {
//    console.log( "event fired!" );
//    } );
            var extraInfo = cordova.require('com.maxpup.wificonnect.OpenActivity');
            extraInfo.wifiConnect('测试',function(msg){
                                     alert(msg);
                                     },function(msg){
                                     alert(msg);
                                     });
  }

  $scope.addDivice = function(){
    $scope.data = {}

    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="data.divice_name">',
      title: '输入设备名',
      subTitle: '设备名为设备的唯一标志',
      scope: $scope,
      buttons: [
        { text: '取消' },
        {
          text: '<b>绑定</b>',
          type: 'button-positive',
          onTap: function(e) {
            //e为mouseEvent
            if (!$scope.data.divice_name) {
              //不允许用户关闭，除非输入设备名
              e.preventDefault();
            } else {
              return $scope.data.divice_name;
            }
          }
        },
      ]
    });
    myPopup.then(function(divice_name) {
      $scope.loading = {
        'show':true,
        'msg':'正在绑定设备'
      };
      bindDivice(divice_name, function(divices){
        $scope.loading = {
          'show':false,
          'msg':'绑定成功！'
        };
        $scope.divices = divices;
        $scope.ng_show.goTC = true;
        $scope.hint.msg = '添加设备成功';
        $scope.$apply();

      }, function(data){
        $scope.hint.msg = '报错：' + writeObj(data.cause);
        $scope.loading = {
          'show':false,
          'msg':'绑定成功！'
        };
      });
    });
  };
  $scope.scanQRcode = function(){
    console.log('开始扫描二维码');
    $ionicPlatform.ready(function() {
        $cordovaBarcodeScanner
            .scan()
            .then(function(result) {
                // Success! Barcode data is here
                if(result.cancelled == false && result.format == 'QR_CODE'){
                  console.log(result.text +'=>' + result.format);
                  bindDivice(result.text, function(divices){
                    $scope.divices = divices;
                    $scope.ng_show.goTC = true;
                    $scope.hint.msg = '添加设备成功';
                    $scope.$apply();

                  }, function(data){
                    $scope.hint.msg = '报错：' + writeObj(data.cause);
                    $scope.loading = {
                      'show':false,
                      'msg':'绑定成功！'
                    };
                  });
                }else{
                  console.log("二维码出错");
                }

            }, function(error) {
                // An error occurred
                console.log("An error happened -> " + error);
            });
    });

  };
})
