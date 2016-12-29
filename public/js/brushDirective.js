angular.module('zenPaintApp')
.directive('brushDirective', function(){

  return {
    templateUrl: './views/brushDirective.html',
    restrict: 'AE',
    link: function(scope, element, attr) {

      element.on('click', function(event){
        scope.brush(attr.brushDirective);
      })

    }
  }
})
