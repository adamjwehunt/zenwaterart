'use strict';

angular.module('zenPaintApp', ['ui.router']).config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider.state('welcome', {
    url: '/',
    controller: 'welcomeController',
    templateUrl: './views/welcome.html'

  }).state('home', {
    url: '/home',
    controller: 'homeController',
    templateUrl: './views/home.html'

  }).state('about', {
    url: '/about',
    controller: 'aboutController',
    templateUrl: './views/about.html'

  });

  $urlRouterProvider.otherwise('/');
});

angular.module('zenPaintApp').controller('aboutController', function ($scope) {});

angular.module('zenPaintApp').directive('brushDirective', function () {

  return {
    templateUrl: './views/brushDirective.html',
    restrict: 'AE',
    link: function link(scope, element, attr) {

      element.on('click', function (event) {
        scope.brush(attr.brushDirective);
      });
    }
  };
});

angular.module('zenPaintApp').controller('homeController', function ($scope, service) {

  $scope.canvasInit = function () {
    return service.canvasInit();
  };
  $scope.canvasInit();
  service.fadeOut();

  $(window).resize(function () {
    $scope.canvasInit();
  });

  $scope.brushes = service.brushes;

  $scope.brush = function (b) {
    return service[b]();
  };

  $scope.brush('brush1');
});

angular.module('zenPaintApp').controller('welcomeController', function ($scope) {

  $scope.testAnimate = [];
  var clicked = false;
  $scope.testAnim = function () {
    if (!clicked) {
      $scope.hidden = false;
      $scope.testAnimate.push('animated fadeInRight');
      clicked = true;
    } else {
      $scope.testAnimate.splice(0);
      $scope.testAnimate.push('animated fadeOutRight');
      clicked = false;
      setTimeout(function () {
        scope.hidden = true;
      }, 1500);
    }
  };
});

angular.module('zenPaintApp').service('service', function () {

  //Initialize Canvas Size//
  this.canvasInit = function () {
    var canvas = document.querySelector('#paint');
    var ctx = canvas.getContext('2d');
    var sketch = document.querySelector('#sketch');
    var sketch_style = getComputedStyle(sketch);
    canvas.width = parseInt(sketch_style.getPropertyValue('width'));
    canvas.height = parseInt(sketch_style.getPropertyValue('height'));

    var cavasWrap = document.querySelector('#paintWrap');
    cavasWrap.width = parseInt(sketch_style.getPropertyValue('width'));
    cavasWrap.height = parseInt(sketch_style.getPropertyValue('height'));
    document.body.addEventListener("touchstart", function (e) {
      if (e.target == canvas) {
        e.preventDefault();
      }
    }, false);
    document.body.addEventListener("touchend", function (e) {
      if (e.target == canvas) {
        e.preventDefault();
      }
    }, false);
    document.body.addEventListener("touchmove", function (e) {
      if (e.target == canvas) {
        e.preventDefault();
      }
    }, false);
  };

  //Canvas Fadeout//
  this.fadeOut = function () {
    var canvas = document.querySelector('#paint');
    var ctx = canvas.getContext('2d');
    function fade() {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = "rgba(227,227,227, 0.007)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setTimeout(fade, 150);
      ctx.globalCompositeOperation = 'source-over';
    }
    fade();
  };

  ///////////////////
  //Bush Styles//////
  ///////////////////

  //////////////////////brushes///////////////////

  this.brush1 = function () {

    var canvas = document.querySelector('#paint');
    var ctx = canvas.getContext('2d');
    var mouse = { x: 0, y: 0 };

    var img = new Image();
    img.src = 'https://raw.githubusercontent.com/crosspop/Croquispop/master/img/brush/b3.png';

    function distanceBetween(point1, point2) {
      return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
    }
    function angleBetween(point1, point2) {
      return Math.atan2(point2.x - point1.x, point2.y - point1.y);
    }

    ctx.lineJoin = ctx.lineCap = 'round';

    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    //
    var isDrawing, lastPoint;

    canvas.onmousedown = function (e) {
      isDrawing = true;
      lastPoint = { x: mouse.x, y: mouse.y };
      //   console.log('mousedown')
    };

    canvas.addEventListener('mousemove', function (e) {
      mouse.x = e.pageX - this.offsetLeft;
      mouse.y = e.pageY - this.offsetTop;
      if (!isDrawing) return;

      var currentPoint = { x: mouse.x, y: mouse.y };
      var dist = distanceBetween(lastPoint, currentPoint);
      var angle = angleBetween(lastPoint, currentPoint);

      for (var i = 0; i < dist; i++) {
        var x = lastPoint.x + Math.sin(angle) * i - 25;
        var y = lastPoint.y + Math.cos(angle) * i - 25;
        ctx.drawImage(img, x, y);
      }

      lastPoint = currentPoint;
      // console.log('mousemove');
    }, false);

    canvas.addEventListener('mouseup', function (e) {
      isDrawing = false;
      // console.log('mouseup')
    }, false);

    //////////////////////////////////
    /////////////////////////////////////

    var lastPos = mouse;
    // Set up touch events for mobile, etc
    canvas.addEventListener("touchstart", function (e) {
      mouse = getTouchPos(canvas, e);
      var touch = e.touches[0];
      var mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      canvas.dispatchEvent(mouseEvent);
    }, false);
    canvas.addEventListener("touchend", function (e) {
      var mouseEvent = new MouseEvent("mouseup", {});
      canvas.dispatchEvent(mouseEvent);
    }, false);
    canvas.addEventListener("touchmove", function (e) {
      var touch = e.touches[0];
      var mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      canvas.dispatchEvent(mouseEvent);
    }, false);

    // Get the position of a touch relative to the canvas
    function getTouchPos(canvasDom, e) {
      var rect = canvasDom.getBoundingClientRect();
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    //////////////////////////////////
    ///////////////////////////////////

  };

  //////////////////////////////////////////


  this.brush2 = function () {
    var canvas = document.querySelector('#paint');
    var ctx = canvas.getContext('2d');
    var mouse = { x: 0, y: 0 };

    canvas.addEventListener('mousemove', function (e) {
      mouse.x = e.pageX - this.offsetLeft;
      mouse.y = e.pageY - this.offsetTop;
    }, false);

    var img = new Image();
    img.src = 'https://raw.githubusercontent.com/crosspop/Croquispop/master/img/brush/b1.png';

    function distanceBetween(point1, point2) {
      return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
    }
    function angleBetween(point1, point2) {
      return Math.atan2(point2.x - point1.x, point2.y - point1.y);
    }

    ctx.lineJoin = ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';

    var isDrawing, lastPoint;

    canvas.onmousedown = function (e) {
      isDrawing = true;
      lastPoint = { x: mouse.x, y: mouse.y };
    };

    canvas.addEventListener('mousemove', function (e) {
      if (!isDrawing) return;

      var currentPoint = { x: mouse.x, y: mouse.y };
      var dist = distanceBetween(lastPoint, currentPoint);
      var angle = angleBetween(lastPoint, currentPoint);

      for (var i = 0; i < dist; i++) {
        var x = lastPoint.x + Math.sin(angle) * i - 25;
        var y = lastPoint.y + Math.cos(angle) * i - 25;
        ctx.drawImage(img, x, y);
      }

      lastPoint = currentPoint;
    }, false);

    canvas.addEventListener('mouseup', function (e) {
      isDrawing = false;
      // console.log('mouseup')
    }, false);

    var lastPos = mouse;
    // Set up touch events for mobile, etc
    canvas.addEventListener("touchstart", function (e) {
      mouse = getTouchPos(canvas, e);
      var touch = e.touches[0];
      var mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      canvas.dispatchEvent(mouseEvent);
    }, false);
    canvas.addEventListener("touchend", function (e) {
      var mouseEvent = new MouseEvent("mouseup", {});
      canvas.dispatchEvent(mouseEvent);
    }, false);
    canvas.addEventListener("touchmove", function (e) {
      var touch = e.touches[0];
      var mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      canvas.dispatchEvent(mouseEvent);
    }, false);

    // Get the position of a touch relative to the canvas
    function getTouchPos(canvasDom, e) {
      var rect = canvasDom.getBoundingClientRect();
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
  };

  //////////////////////////////////////////

  this.brush3 = function () {
    var canvas = document.querySelector('#paint');
    var ctx = canvas.getContext('2d');
    var mouse = { x: 0, y: 0 };

    canvas.addEventListener('mousemove', function (e) {
      mouse.x = e.pageX - this.offsetLeft;
      mouse.y = e.pageY - this.offsetTop;
    }, false);

    var img = new Image();
    img.src = 'https://raw.githubusercontent.com/triceam/HTML5-Canvas-Brush-Sketch/master/src/assets/brush2.png';

    function distanceBetween(point1, point2) {
      return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
    }
    function angleBetween(point1, point2) {
      return Math.atan2(point2.x - point1.x, point2.y - point1.y);
    }

    ctx.lineJoin = ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';

    var isDrawing, lastPoint;

    canvas.onmousedown = function (e) {
      isDrawing = true;
      lastPoint = { x: mouse.x, y: mouse.y };
    };

    canvas.addEventListener('mousemove', function (e) {
      if (!isDrawing) return;

      var currentPoint = { x: mouse.x, y: mouse.y };
      var dist = distanceBetween(lastPoint, currentPoint);
      var angle = angleBetween(lastPoint, currentPoint);

      for (var i = 0; i < dist; i++) {
        var x = lastPoint.x + Math.sin(angle) * i - 25;
        var y = lastPoint.y + Math.cos(angle) * i - 25;
        ctx.drawImage(img, x, y);
      }

      lastPoint = currentPoint;
    }, false);

    canvas.addEventListener('mouseup', function (e) {
      isDrawing = false;
    }, false);

    var lastPos = mouse;
    // Set up touch events for mobile, etc
    canvas.addEventListener("touchstart", function (e) {
      mouse = getTouchPos(canvas, e);
      var touch = e.touches[0];
      var mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      canvas.dispatchEvent(mouseEvent);
    }, false);
    canvas.addEventListener("touchend", function (e) {
      var mouseEvent = new MouseEvent("mouseup", {});
      canvas.dispatchEvent(mouseEvent);
    }, false);
    canvas.addEventListener("touchmove", function (e) {
      var touch = e.touches[0];
      var mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      canvas.dispatchEvent(mouseEvent);
    }, false);

    // Get the position of a touch relative to the canvas
    function getTouchPos(canvasDom, e) {
      var rect = canvasDom.getBoundingClientRect();
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
  };

  //////////////////////////////////////////

  this.brush4 = function () {
    var canvas = document.querySelector('#paint');
    var ctx = canvas.getContext('2d');
    var mouse = { x: 0, y: 0 };

    canvas.addEventListener('mousemove', function (e) {
      mouse.x = e.pageX - this.offsetLeft;
      mouse.y = e.pageY - this.offsetTop;
    }, false);

    ctx.lineWidth = 3;
    ctx.lineJoin = ctx.lineCap = 'round';

    var isDrawing,
        points = [];

    canvas.onmousedown = function (e) {
      points = [];
      isDrawing = true;
      points.push({ x: mouse.x, y: mouse.y });
    };

    canvas.onmousemove = function (e) {
      if (!isDrawing) return;

      points.push({ x: mouse.x, y: mouse.y });

      ctx.beginPath();
      ctx.moveTo(points[points.length - 2].x, points[points.length - 2].y);
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
      ctx.stroke();

      for (var i = 0, len = points.length; i < len; i++) {
        var dx = points[i].x - points[points.length - 1].x;
        var dy = points[i].y - points[points.length - 1].y;
        var d = dx * dx + dy * dy;

        if (d < 1000) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(0,0,0,0.3)';
          ctx.moveTo(points[points.length - 1].x + dx * 0.2, points[points.length - 1].y + dy * 0.2);
          ctx.lineTo(points[i].x - dx * 0.2, points[i].y - dy * 0.2);
          ctx.stroke();
        }
      }
    };

    canvas.onmouseup = function () {
      isDrawing = false;
      points.length = 0;
    };

    var lastPos = mouse;
    // Set up touch events for mobile, etc
    canvas.addEventListener("touchstart", function (e) {
      mouse = getTouchPos(canvas, e);
      var touch = e.touches[0];
      var mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      canvas.dispatchEvent(mouseEvent);
    }, false);
    canvas.addEventListener("touchend", function (e) {
      var mouseEvent = new MouseEvent("mouseup", {});
      canvas.dispatchEvent(mouseEvent);
    }, false);
    canvas.addEventListener("touchmove", function (e) {
      var touch = e.touches[0];
      var mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      canvas.dispatchEvent(mouseEvent);
    }, false);

    // Get the position of a touch relative to the canvas
    function getTouchPos(canvasDom, e) {
      var rect = canvasDom.getBoundingClientRect();
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
  };

  //////////////////////////////////////////

  this.brush5 = function () {
    var canvas = document.querySelector('#paint');
    var ctx = canvas.getContext('2d');
    var mouse = { x: 0, y: 0 };

    canvas.addEventListener('mousemove', function (e) {
      mouse.x = e.pageX - this.offsetLeft;
      mouse.y = e.pageY - this.offsetTop;
    }, false);

    ctx.lineWidth = 5;
    ctx.lineJoin = ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';

    var isDrawing,
        points = [];

    canvas.onmousedown = function (e) {
      points = [];
      isDrawing = true;
      points.push({ x: mouse.x, y: mouse.y });
    };

    canvas.onmousemove = function (e) {
      if (!isDrawing) return;

      points.push({ x: mouse.x, y: mouse.y });

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (var i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
        var nearPoint = points[i - 5];
        if (nearPoint) {
          ctx.moveTo(nearPoint.x, nearPoint.y);
          ctx.lineTo(points[i].x, points[i].y);
        }
      }
      ctx.stroke();
    };

    canvas.onmouseup = function () {
      isDrawing = false;
      points.length = 0;
    };

    var lastPos = mouse;
    // Set up touch events for mobile, etc
    canvas.addEventListener("touchstart", function (e) {
      mouse = getTouchPos(canvas, e);
      var touch = e.touches[0];
      var mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      canvas.dispatchEvent(mouseEvent);
    }, false);
    canvas.addEventListener("touchend", function (e) {
      var mouseEvent = new MouseEvent("mouseup", {});
      canvas.dispatchEvent(mouseEvent);
    }, false);
    canvas.addEventListener("touchmove", function (e) {
      var touch = e.touches[0];
      var mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      canvas.dispatchEvent(mouseEvent);
    }, false);

    // Get the position of a touch relative to the canvas
    function getTouchPos(canvasDom, e) {
      var rect = canvasDom.getBoundingClientRect();
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
  };

  ///////////////////////////////////////

  this.brush6 = function () {
    var canvas = document.querySelector('#paint');
    var ctx = canvas.getContext('2d');
    var mouse = { x: 0, y: 0 };

    canvas.addEventListener('mousemove', function (e) {
      mouse.x = e.pageX - this.offsetLeft;
      mouse.y = e.pageY - this.offsetTop;
    }, false);

    ctx.lineWidth = 4;

    var isDrawing,
        points = [];

    canvas.onmousedown = function (e) {
      points = [];
      isDrawing = true;
      points.push({ x: mouse.x, y: mouse.y });
    };

    canvas.onmousemove = function (e) {
      if (!isDrawing) return;

      points.push({ x: mouse.x, y: mouse.y });

      ctx.beginPath();
      ctx.moveTo(points[points.length - 2].x, points[points.length - 2].y);
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
      ctx.stroke();

      for (var i = 0, len = points.length; i < len; i++) {
        var dx = points[i].x - points[points.length - 1].x;
        var dy = points[i].y - points[points.length - 1].y;
        var d = dx * dx + dy * dy;

        if (d < 2000 && Math.random() > d / 2000) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(0,0,0,0.3)';
          ctx.moveTo(points[points.length - 1].x + dx * 0.5, points[points.length - 1].y + dy * 0.5);
          ctx.lineTo(points[points.length - 1].x - dx * 0.5, points[points.length - 1].y - dy * 0.5);
          ctx.stroke();
        }
      }
    };

    canvas.onmouseup = function () {
      isDrawing = false;
      points.length = 0;
    };

    var lastPos = mouse;
    // Set up touch events for mobile, etc
    canvas.addEventListener("touchstart", function (e) {
      mouse = getTouchPos(canvas, e);
      var touch = e.touches[0];
      var mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      canvas.dispatchEvent(mouseEvent);
    }, false);
    canvas.addEventListener("touchend", function (e) {
      var mouseEvent = new MouseEvent("mouseup", {});
      canvas.dispatchEvent(mouseEvent);
    }, false);
    canvas.addEventListener("touchmove", function (e) {
      var touch = e.touches[0];
      var mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      canvas.dispatchEvent(mouseEvent);
    }, false);

    // Get the position of a touch relative to the canvas
    function getTouchPos(canvasDom, e) {
      var rect = canvasDom.getBoundingClientRect();
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
  };

  /////////////////////////////
});

angular.module('zenPaintApp').directive('sliderDirective', function () {

  return {
    restrict: 'A',
    scope: {},
    controller: function controller($scope, service) {
      $scope.fadeOut = function (num) {
        service.fadeOut(num);
      };
      $(document).ready(function () {
        $('#slider').slider({
          change: function change(event, ui) {
            $scope.fadeOut(ui.value * 6);
          }
        });
      });
    }
  };
});