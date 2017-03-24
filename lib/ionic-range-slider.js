/**
 * @Author: Geoffrey Bauduin <bauduin.geo@gmail.com>
 */

angular.module("ion.rangeslider", []);

angular.module("ion.rangeslider").directive("ionRangeSlider", [
    function () {

        return {
            restrict: "E",
            scope: {
                min: "=",
                max: "=",
                from: "=",
                to: "=",
                disable: "=",

                type: "@",
                step: "@",
                minInterval: "@",
                maxInterval: "@",
                dragInterval: "@",
                values: "@",
                fromFixed: "@",
                fromMin: "@",
                fromMax: "@",
                fromShadow: "@",
                toFixed: "@",
                toMax: "@",
                toShadow: "@",
                prettifyEnabled: "@",
                prettifySeparator: "@",
                forceEdges: "@",
                keyboard: "@",
                keyboardStep: "@",
                grid: "@",
                gridMargin: "@",
                gridNum: "@",
                gridSnap: "@",
                hideMinMax: "@",
                hideFromTo: "@",
                prefix: "@",
                postfix: "@",
                maxPostfix: "@",
                decorateBoth: "@",
                valuesSeparator: "@",
                inputValuesSeparator: "@",

                prettify: "&",
                onChange: "&",
                onFinish: "&",
                update:'='
            },
            replace: true,
            link: function ($scope, $element, attrs) {
              $element.append('<input type="text" id="range" name="range_name" value=""/>');
              $('#range').ionRangeSlider({
                  min: $scope.min,
                  max: $scope.max,
                  from: $scope.from.value.valueOf(),
                  to: $scope.to.value,
                  type: 'double',
                  prefix: '',
                  grid: true,
                  grid_num: 10,
                  prettify:function(value){
                    var hours = parseInt(value/3600);
                    var minutes = parseInt(value%3600/60);
                    return hours + ":" + minutes;
                  },
                  onChange:function(value){
                    $scope.from.value = value.from;
                    $scope.to.value = value.to;
                    $scope.update(value.from, value.to);
                  }
              });
              var slider = $("#range").data("ionRangeSlider");
              $scope.$watch('from',function(obj){




              });
              setTimeout(function(){
                slider.update({
                    from:$scope.from.value,
                    to:$scope.to.value
                });
                slider.reset();
              },1000)
              //弄完还是懵逼中
              //scope的值变化的映射关系啊。。。。

            /*
              // Saving it's instance to var
              var slider = $("#range").data("ionRangeSlider");

                $element.data('ionRangeSlider',{
                    min: $scope.min,
                    max: $scope.max,
                    from: $scope.from,
                    to: $scope.to,
                    disable: $scope.disable,
                    type: $scope.type,
                    step: $scope.step,
                    minInterval: $scope.min_interval,
                    maxInterval: $scope.max_interval,
                    dragInterval: $scope.drag_interval,
                    values: $scope.values,
                    fromFixed: $scope.from_fixed,
                    fromMin: $scope.from_min,
                    fromMax: $scope.from_max,
                    fromShadow: $scope.from_shadow,
                    toFixed: $scope.to_fixed,
                    toMax: $scope.to_max,
                    toShadow: $scope.to_shadow,
                    prettifyEnabled: $scope.prettify_enabled,
                    prettifySeparator: $scope.prettify_separator,
                    forceEdges: $scope.force_edges,
                    keyboard: $scope.keyboard,
                    keyboardStep: $scope.keyboard_step,
                    grid: $scope.grid,
                    gridMargin: $scope.grid_margin,
                    gridNum: $scope.grid_num,
                    gridSnap: $scope.grid_snap,
                    hideMinMax: $scope.hide_min_max,
                    hideFromTo: $scope.hide_from_to,
                    prefix: $scope.prefix,
                    postfix: $scope.postfix,
                    maxPostfix: $scope.max_postfix,
                    decorateBoth: $scope.decorate_both,
                    valuesSeparator: $scope.values_separator,
                    inputValuesSeparator: $scope.input_values_separator,

                    prettify: function (value) {
                      if(!attrs.prettify) {
                        return value;
                      }
                      return $scope.prettify({value: value});
                    },
                    onChange: function (a) {
                        $scope.$apply(function () {
                            $scope.from = a.from;
                            $scope.to = a.to;
                            $scope.onChange && $scope.onChange({
                                a: a
                            });
                        });
                    },
                    onFinish: function () {
                        $scope.$apply($scope.onFinish);
                    },
                    update:function(value){
                      slider.update({
                          from: 300,
                          to: 400
                      });
                    }
                });
                var watchers = [];
                watchers.push($scope.$watch("min", function (value) {
                    $element.data("ionRangeSlider").update({
                        min: value
                    });
                }));
                watchers.push($scope.$watch('max', function (value) {
                    $element.data("ionRangeSlider").update({
                        max: value
                    });
                }));
                watchers.push($scope.$watch('from', function (value) {
                    var slider = $element.data("ionRangeSlider");
                    if (slider.old_from !== value) {

                        slider.update({
                            from: value
                        });
                    }
                }));
                watchers.push($scope.$watch('to', function (value) {
                    var slider = $element.data("ionRangeSlider");
                    if (slider.old_to !== value) {
                        slider.update({
                            to: value
                        });
                    }
                }));
                watchers.push($scope.$watch('disable', function (value) {
                    $element.data("ionRangeSlider").update({
                        disable: value
                    });
                }));
                **/
            }
        }

    }
])
