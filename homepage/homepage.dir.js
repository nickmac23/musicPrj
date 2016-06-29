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
      var music = document.getElementById('audio');

      music.addEventListener('ended', function() {
        console.log('here');
        musicData.playSong({command: 'next'})
      })

      document.addEventListener('keydown', function (e){
        var obj = {}
        switch (e.which) {
          case 39:
            obj.command = 'next'
            break;
          case 37:
            obj.command = 'back'
            break;
          case 32:
            obj.command = 'space'
            break;
        }
        musicData.playSong(obj)
      })

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
