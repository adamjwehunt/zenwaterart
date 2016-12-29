angular.module('zenPaintApp', ['ui.router'])
  .config(function($stateProvider, $urlRouterProvider) {


  $stateProvider
    .state('welcome', {
      url:'/',
      controller: 'welcomeController',
      templateUrl: './views/welcome.html'

    })

    .state('home', {
      url:'/home',
      controller: 'homeController',
      templateUrl: './views/home.html'

    })

    .state('about', {
      url:'/about',
      controller: 'aboutController',
      templateUrl: './views/about.html'

    })

    $urlRouterProvider
      .otherwise('/')

})
