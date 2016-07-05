(function() {
  'use strict';

  var dependencies = [
    'ui.router'
  ]
  angular.module('app', dependencies)
  .config(routes)

  routes.$inject = [
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    '$httpProvider'];

  function routes($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider){
   // $locationProvider.html5Mode(true);
  //  $urlRouterProvider.otherwise("/");
  //  $stateProvider
  //    .state('home', {
  //      url: "/",
  //      template: "<posts></posts>"
  //    })
   }

}());
