(function() {
  'use strict';

  var fs = require('fs')
  var audioMetaData = require('audio-metadata')
  var mm = require('musicmetadata');
  var root = '../../Desktop/music/'

  factory.$inject = [];

  angular.module('app')
  .factory('musicData', factory)

  function factory () {
    return {
      musicList,
    }

    function musicList () {
      return parse(readDir(root))
    }

    function parse (musicList) {
      var list = []
      for (let i = 0; i < musicList.length; i++) {
        var music = musicList[i]
        list.push(new Promise(function (resolve, reject) {
          mm(fs.createReadStream(musicList[i]), function (err, metadata) {
            if (err) return reject(err);
            var musicObj = {
              path: music,
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
