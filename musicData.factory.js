(function() {
  'use strict';

  var fs = require('fs')
  var audioMetaData = require('audio-metadata')
  var mm = require('musicmetadata');
  var root = '../../../Desktop/music/'
  var socketRoom = '';
  var musicAll;
  var i = 0;

  factory.$inject = ['$http'];

  angular.module('app')
  .factory('musicData', factory)

  function factory ($http) {
    var socket = io.connect('https://fathomless-falls-33454.herokuapp.com/');
    var music = document.getElementById('audio');


    return {
      musicList,
      setRoom,
      playSong,
    }

    function setRoom (roomName) {
      socketRoom = roomName
      socket.on(socketRoom + 'electron', function (data) {
        if(data != 'client wants data!'){
          playSong(data)
          socket.emit('server', {info: 'song playing!', room: socketRoom, to: 'client'})
        } else {
            socket.emit('server', {info: musicAll, room: socketRoom, to: 'client'})
        }
      })
    }

    function playSong (command) {
      switch (command.command) {
        case 'next':
          i++
          if (i > musicAll.length - 1) i = 0
          music.src = musicAll[i].path
          music.play()
          break;
        case 'back':
          i--
          if (i < 0) i = musicAll.length -1
          music.src = musicAll[i].path
          music.play()
          break;
        case 'space':
          switch (music.paused) {
            case true:
              if (!music.src) {
                music.src = musicAll[i].path
              }
              music.play()
              break;
            case false:
              music.pause()
              break;
          }
          break;
        case 'play':
          if (command.index) i = command.index
          music.src = command.path;
          music.play()
          break;
      }
      console.log(i);
    }


    function musicList () {
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
