(function() {
  'use strict';

  angular.module('app')
  .directive('home', directive)
  function directive () {
    return {
      templateUrl: './homepage/homepage.dir.html',
      controller,
      controllerAs: 'vm',
    }

    function controller ($scope, musicData) {
      let vm = this
      musicData.musicList().then(function(data) {
        vm.list = data
        $scope.$apply()
      })
    }
  }
}());
