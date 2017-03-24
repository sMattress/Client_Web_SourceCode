// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ionic-native-transitions','ngCordova','starter.controllers', 'starter.services', 'maxpup.directive','state_switch_btn','userInfoManger','switch_device'])

.value('server', {"ip":"https://smartmattress.lesmarthome.com"})
//.value('server', {"ip":"http://192.168.1.114:4567"})

.run(function($ionicPlatform, login, $state, mySocket) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
  //调试时用,自动登陆，获取account、设备信息
  login(function(divices){
    console.log("自动登陆成功");
    mySocket.switchDevice(divices[0].device_name);
    mySocket.openSocket(function(){
      console.log("socket已注册");
    }, function(){
      console.log("socket注册失败");
    })
    $state.go('tab.setting');

    // if(divices == null){
    //   $state.go('addDivice');
    // }else{
    //   console.dir(divices);
    // }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider,$ionicNativeTransitionsProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('login',{
    url:'/login',
    templateUrl:'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('register',{
    url:'/register',
    templateUrl:'templates/register.html',
    controller: 'registerCtrl'
  })
  .state('addDivice',{
    url:'/addDivice',
    templateUrl:'templates/addDivice.html',
    controller:'addDiviceCtrl'
  })
  .state('person',{
    url:'/person',
    templateUrl:'templates/personInfo.html',
    controller: 'personCtrl'
  })
  .state('editPerson',{
    url:'/editPerson',
    templateUrl:'templates/editPersonInfo.html',
    controller: 'editPersonCtrl'
  })
  .state('divices',{
    url:'/divices',
    templateUrl:'templates/divices.html',
    controller: 'divicesCtrl'
  })

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.setting', {
    url: '/setting',
    views: {
      'tab-setting': {
        templateUrl: 'templates/tab-setting.html',
        controller: 'settingCtrl'
      }
    }
  })

  .state('tab.knowledge', {
      url: '/knowledge',
      views: {
        'tab-knowledge': {
          templateUrl: 'templates/tab-knowledge.html',
          controller: ''
        }
      }
    })
    .state('tab.knowledge-detail', {
      url: '/knowledge/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: ''
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'accountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  //$urlRouterProvider.otherwise('/tab/setting');
  $urlRouterProvider.otherwise('/login')


  //设置导航条
  $ionicConfigProvider.platform.ios.tabs.style('standard');
  $ionicConfigProvider.platform.ios.tabs.position('bottom');
  $ionicConfigProvider.platform.android.tabs.style('standard');
  $ionicConfigProvider.platform.android.tabs.position('bottom');

  $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
  $ionicConfigProvider.platform.android.navBar.alignTitle('left');

  $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
  $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

  $ionicConfigProvider.platform.ios.views.transition('ios');
  $ionicConfigProvider.platform.android.views.transition('android');

  $ionicConfigProvider.views.transition('no');
  //解决打包app界面切换卡顿
  $ionicNativeTransitionsProvider.setDefaultOptions({
    duration: 400, // in milliseconds (ms), default 400,
    slowdownfactor: 4, // overlap views (higher number is more) or no overlap (1), default 4
    iosdelay: -1, // ms to wait for the iOS webview to update before animation kicks in, default -1
    androiddelay: -1, // same as above but for Android, default -1
    winphonedelay: -1, // same as above but for Windows Phone, default -1,
    fixedPixelsTop: 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
    fixedPixelsBottom: 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
    triggerTransitionEvent: '$ionicView.afterEnter', // internal ionic-native-transitions option
    backInOppositeDirection: false // Takes over default back transition and state back transition to use the opposite direction transition to go back
});
});
