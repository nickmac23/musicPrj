  (function() {
  'use strict';

  var fs = require('fs')
  var mm = require('musicmetadata');
  var socketRoom = '';
  var musicAll;
  var i = -1;
  var state = {}

  factory.$inject = ['$http', '$rootScope'];

  angular.module('app')
  .factory('musicData', factory)

  function factory ($http, $rootScope) {
    var socket = io.connect('https://fathomless-falls-33454.herokuapp.com/');
    var music = document.getElementById('audio');

    return {
      musicList,
      setRoom,
      playSong,
      stater,
      getAlbumArt,
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
      state.image = state.image
      state.volume = music.volume
      var listed = document.getElementById('nick').getAttribute('value')
      console.log(listed);
      if(command.path) i = command.pageIndex
      var play;
      switch (command.command) {
        case 'volume':
          state.volume = command.val
          music.volume = state.volume
          return
        break
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
              state.command = 'playing'
              socket.emit('server', {info: state, room: socketRoom, to: 'client'})
              music.play()
              return
              break;
            case false:
              state.command = 'pause'
              socket.emit('server', {info: state, room: socketRoom, to: 'client'})
              music.pause()
              return
              break;
          }
          break;

        case 'play':
          var index = command.index
          i = index
          music.src = command.path;
          music.play()
          play = 'playing'
          break;
      }
      if(command.command) {
        var index = index || i
        music.volume = state.volume;
        state.music = musicAll[index] || state.music
        state.command = play
        state.from = command.from
        state.order = !!command.order ? command.order : state.order
        if (command.fill === false) state.search = ''
        state.search = !!command.fill ? command.fill : state.search
        if (command.from === "socket") $rootScope.$apply()
        if(!!state.music){
          getAlbumArt(musicAll[index]).then(function (response){
            state.image = response;
            socket.emit('server', {info: state, room: socketRoom, to: 'client'})
            return state
          })
        } else {
          socket.emit('server', {info: state, room: socketRoom, to: 'client'})
          return state
        }
      }
    }


    function getAlbumArt(info){
      var pic = document.getElementsByClassName('pic')
      if(!!info){
        var url = `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=0f06a280b3ec1c6cfcc7b6acdda80248&artist=${info.artist[0]}&album=${info.album}&format=json`
        return $http({ method: 'GET', url: url}).then(function successCallback(response) {
          if (response.data.album.image[4]['#text']){
             pic[0].src = response.data.album.image[4]['#text']
             pic[1].src = response.data.album.image[2]['#text']
             return response.data.album.image[4]['#text']
           }
          })
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
            if (err) reject(err);
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
