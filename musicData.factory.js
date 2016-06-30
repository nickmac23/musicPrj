(function() {
  'use strict';

  var fs = require('fs')
  var audioMetaData = require('audio-metadata')
  var mm = require('musicmetadata');
  var socketRoom = '';
  var musicAll;
  var i = 0;

  factory.$inject = ['$rootScope'];

  angular.module('app')
  .factory('musicData', factory)

  function factory ($rootScope) {
    var socket = io.connect('https://fathomless-falls-33454.herokuapp.com/');
    var music = document.getElementById('audio');
    var state = {}

    return {
      musicList,
      setRoom,
      playSong,
      stater,
    }

    function stater () {
      return state
    }

    function setRoom (roomName) {
      socketRoom = roomName
      socket.on(socketRoom + 'electron', function (data) {
        if(data != 'client wants data!'){
          playSong(data)
        } else {
            socket.emit('server', {info: musicAll, room: socketRoom, to: 'client'})
        }
      })
    }


    function playSong (command) {
      var listed = document.getElementById('nick').getAttribute('value')
      if(command.path) i = command.pageIndex
      var play;
      switch (command.command) {
        case 'reset':
          i = -1
          return command.by
          break;
        case 'next':
          i++
          if (i > listed - 1) i = 0
          var next = document.getElementById(i)
          next.getAttribute('path')
          var index = next.getAttribute('index')
          music.src = next.getAttribute('path')
          music.play()
          play = 'playing'
          break;
        case 'back':
          i--
          if (i < 0) i = listed -1
          var back = document.getElementById(i)
          back.getAttribute('path')
          var index = back.getAttribute('index')
          music.src = back.getAttribute('path')
          music.play()
          play = 'playing'
          break;
        case 'space':
          switch (music.paused) {
            case true:
              if (!music.src) {
                var now = document.getElementById(0)
                music.src = now.getAttribute('path')
                var index = now.getAttribute('index')
              }
              music.play()
              play = 'playing'
              break;
            case false:
              music.pause()
              play = 'paused'
              break;
          }
          break;
        case 'play':
          var index = command.index
          music.src = command.path;
          music.play()
          play = 'playing'
          break;
      }
      if(command.command) {
        var index = index || i
        var obj = musicAll[index]
        state = obj;
        obj.command = play
        obj.from = command.from
        if (command.from === "socket") $rootScope.$apply()
          socket.emit('server', {info: obj, room: socketRoom, to: 'client'})
        return obj
      }
    }


    function musicList (root) {
      return parse(readDir(root)).then(music => musicAll = music)
    }

    function parse (musicList) {
      var list = []
      var music;

      for (let i = 0; i < musicList.length; i++) {
        list.push(new Promise(function (resolve, reject) {
          mm(fs.createReadStream(musicList[i]), function (err, metadata) {
            if (err) return reject(err);
            var musicObj = {
              path: musicList[i],
              index: i,
              title: metadata.title,
              genre: metadata.genre,
              album: metadata.album,
              artist: metadata.artist,
              year: metadata.year,
            }
            resolve(musicObj)
          })
        }))
      }
      return Promise.all(list)
    }

    function readDir(dir) {
      var musicList = []
      var list = fs.readdirSync(dir)
      for (var i = 0; i < list.length; i++) {
        if (list[i] != '.DS_Store') {
          if (fs.statSync(dir + list[i]).isDirectory()) {
            var nestedMusic = readDir(dir + list[i] +'/')
            if (nestedMusic) musicList = musicList.concat(nestedMusic)
          } else musicList.push( dir + list[i] )
        }
      }
      return musicList
    }
  }


}());
