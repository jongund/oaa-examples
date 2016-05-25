var fs = require('fs')
var markdown = require( "node-markdown" ).Markdown;
var dir = "";
var fname = "";
// print process.argv
process.argv.forEach(function (val, index, array) {
  if (index === 2)  {
    dir = val;
  } 
});

fname = dir + 'description.md';

fs.open(fname, 'r', function(err1, fd) {
console.log('Open: ' + fname);
    if (!err1) {
        fs.readFile(fname, 'utf8', function (err2,data) {
            if (err2) {
                return console.log(err);
            }
            console.log(markdown(data));
            fs.close(fd);
        })
    }
})



