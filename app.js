document.write('heelllo' + process.version)

var fs = require('fs')

var contents = fs.readFileSync('./package.json')

alert(contents)
