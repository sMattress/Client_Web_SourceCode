angular.module('switch_device',['diviceManager', 'starter.services'])
.directive('switchDevice', function(diviceCache){
  return{
    restrict:'AE',
    scope:{
      onSwitch:'='
    },
    link:function(scope, element, attrs){
      var devices = diviceCache.get('divices');
      var isWaiting = false;
      if(devices == null){
        var timer = setInterval(function(){
          if(diviceCache.get('divices') != null){
            updateList(diviceCache.get('divices'));
            var returnInt = clearInterval(timer);
          }
        },500)
      }else{
        updateList(devices);
      }
      function updateList(devicesArray){
        var htmlStr = '';
        for (var i = 0; i < devicesArray.length; i++) {
          if (devicesArray[i].alias) {
            //htmlStr += '<a onclick="'+scope.onSwitch+'('+i+')" >'+devicesArray[i].alias+'</a>'
            var newNode = document.createElement("a")
            newNode.innerHTML = devicesArray[i].alias;
            newNode.deviceName = devicesArray[i].device_name;
            newNode.addEventListener('click',function(event){
              var alias = event.target.innerHTML;
              var device_name = event.target.deviceName;
              scope.onSwitch(alias, device_name);
            });
            element[0].childNodes[0].appendChild(newNode);
          }
        }
        //element[0].childNodes[0].innerHTML = htmlStr;
      }


    },
    template: function(elem, attr){
      return '<div class="dropdown-content"></div>';
    }

  }
})
