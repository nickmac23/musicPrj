(function() {
  'use strict';

  angular.module('app')
  .filter('test', filter)

  function filter () {
    return function (music) {
      console.log(music);
      return music
    }
  }
}());
