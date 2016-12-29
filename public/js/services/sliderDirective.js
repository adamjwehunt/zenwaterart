angular.module('zenPaintApp')
.directive('sliderDirective', function(){

  return {
    restrict: 'A',
    scope: {},
    controller: function ($scope, service){
      $scope.fadeOut = function(num){
        service.fadeOut(num);
      }
      $(document).ready(function() {
        $('#slider').slider({
          change: function(event, ui) {
            $scope.fadeOut(ui.value *  6);
          },
        });
      });
    }
  };
})
