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
      vm.socketRoom = false
      vm.setRoom = setRoom;
      vm.playSong = playSong;

      musicData.musicList().then(function(data) {
        vm.list = data
        $scope.$apply()
      })

      function playSong (path) {
        musicData.playSong(path)
      }
      function setRoom (data) {
        vm.socketRoom = true
        musicData.setRoom(data)
      }
    }
  }
}());
