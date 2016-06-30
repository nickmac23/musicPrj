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
      vm.orderby = orderby;
      // vm.dirUpload = dirUpload;
      var music = document.getElementById('audio');

      music.addEventListener('ended', function() {
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
        vm.playing = musicData.playSong(obj)
        $scope.$apply();
      })

      var root = document.getElementById('file')
      root.addEventListener('change', function () {

        var dir = root.files[0].path +  '/'
        console.log(dir);
        musicData.musicList(dir).then(function(data) {
          vm.list = data
          $scope.$apply()
        })
      })

      function orderby (by) {
        vm.order = by;
      }

      function playSong (path) {
        vm.playing = musicData.playSong(path)
      }
      function setRoom (data) {
        vm.socketRoom = true
        musicData.setRoom(data)
      }
    }
  }
}());
