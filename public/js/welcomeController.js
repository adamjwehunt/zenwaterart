angular.module('zenPaintApp')
.controller('welcomeController', function($scope){

  $scope.testAnimate  = [];
  var clicked = false;
  $scope.testAnim = function(){
    if(!clicked) {
      $scope.hidden = false;
      $scope.testAnimate.push('animated fadeInRight')
      clicked = true;
  } else {
      $scope.testAnimate.splice(0);
      $scope.testAnimate.push('animated fadeOutRight')
      clicked = false;
      setTimeout(function(){
        scope.hidden = true;
      }, 1500)
  }
}

})
