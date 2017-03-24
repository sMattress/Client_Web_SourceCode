angular.module('state_switch_btn',[])
.directive('switchBtn',function(){
  return {
    restrict: 'A',
    scope:{
      onimage: '@',
      offimage: '@',
      myValue:'=',
      isControl:'@'
    },
    link: function(scope, element, attrs){
      // 初始化
      element[0].onclick = function(){
        if(scope.isControl == "true"){
          scope.myValue = !scope.myValue;
        }

      }
      changeBackground(scope.myValue);
      function changeBackground(value){
        if(value == true){
          element[0].src = scope.onimage;
        }else{
          element[0].src = scope.offimage;
        }
      }

      scope.$watch("myValue", function(newValue){
        changeBackground(scope.myValue);
      });
    },

  }
})
