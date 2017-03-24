angular.module('maxpup.directive',[])
.directive('maxpupSideTabs', function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {},
    controller: ['$scope', function MyTabsController($scope) {
      var panes = $scope.panes = [];

      $scope.select = function(pane) {
        angular.forEach(panes, function(pane) {
          pane.selected = false;
        });
        pane.selected = true;
      };

      this.addPane = function(pane) {
        if (panes.length === 0) {
          $scope.select(pane);
        }
        panes.push(pane);
      };
    }],
    template: '<div class="maxpupSideContainer">'
              +'<ul class="nav nav-tabs maxpupsidetabs">'
              +'<li ng-repeat="pane in panes" ng-class="{active:pane.selected}" ng-style="pane.style" ng-click="select(pane)">'
              +'<a >{{pane.title}}'
              +'</a>'
              +'</li>'
              +'</ul>'
              +'<img src="img/background.png" style="position:relative;z-index:-1;width:100%;height:100%;position:fixed;">'
              +'<div class="tabBodyContainer" ng-transclude></div>'
              +'</div>'
  };
})
.directive('maxpupSidePane', function() {
  return {
    require: '^^maxpupSideTabs',
    restrict: 'E',
    transclude: true,
    scope: {
      title: '@',
      background: '@',
      paneView: '@'
    },
    link: function(scope, element, attrs, tabsCtrl) {
      scope.style = {'background-color': scope.background};
      element[0].childNodes[0].className += ' tabBodyContainer' ;
      element[0].childNodes[0].style.backgroundColor = scope.background;
      tabsCtrl.addPane(scope);
    },
    templateUrl: function(elem, attr) {
      return attr.url;
    }
    //templateUrl:'../templates/\pane1.html'
  };
})
