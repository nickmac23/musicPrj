(function() {
  'use strict';

  var fs = require('fs')

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
      vm.reset = reset;

      function reset () {
        fs.writeFileSync('./dataStorage.txt', '')
        vm.list = {};
        root = document.getElementById('file');
        // root.file = null
        getMusic(root);
      }


      $scope.$watch(function(){
          return musicData.stater()
        },
        function (newState) {
          vm.state = newState;
        }, true);

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
            e.preventDefault();
            break;
        }
        vm.playing = musicData.playSong(obj)
        $scope.$apply();
      })

      var root = fs.readFileSync('./dataStorage.txt', 'utf8') || document.getElementById('file');
      getMusic(root)
      function getMusic(root){
        if (typeof root === 'string') {
          musicData.musicList(root).then(function(data) {
            vm.list = data
            $scope.$apply()
          })
        } else {
          root.addEventListener('change', function () {
            var dir = root.files[0].path +  '/'
            musicData.musicList(dir).then(function(data) {
              fs.writeFileSync('./dataStorage.txt', root.files[0].path + '/')
              vm.list = data
              $scope.$apply()
            })
          })
        }
      }

      function orderby (by) {
        console.log('!!!!!!', by);
        vm.state.order = by
      }

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
