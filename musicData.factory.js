(function() {
  'use strict';

  var fs = require('fs')
  var audioMetaData = require('audio-metadata')
  var mm = require('musicmetadata');
  var root = '../../../Desktop/music/'
  var socketRoom = ''

  factory.$inject = ['$http'];

  angular.module('app')
  .factory('musicData', factory)

  function factory ($http) {
    var socket = io.connect('http://localhost:3000');

    return {
      musicList,
      setRoom,
    }

    function setRoom (roomName) {
      socketRoom = roomName
      socket.emit('server', {room: socketRoom, to: 'electron', info: 'electron connected'})
      socket.on(socketRoom + 'electron', function (data) {
        console.log(data);
        musicList().then(music => {
          var musicData = JSON.stringify(music)
          socket.emit('server', {info: music, room: socketRoom, to: 'client'})
        })
      })
    }

    function musicList () {
      return parse(readDir(root))
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
