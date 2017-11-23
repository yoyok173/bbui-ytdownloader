// Brandon Bui

// imports
const fs = require('fs');
const express = require('express');
const youtubedl = require('youtube-dl');
const ytdlcore = require('ytdl-core');
const bodyParser = require('body-parser');
const path = require('path');
const mime = require('mime');

// Setup the server
const server = express();
const port = process.env.PORT || 5000;
server.use(bodyParser.json());
server.use(express.static(__dirname + '/client/build'));



var main = function () {
  var filename = '';
  server.get('/api/info/:ytLink', (req, res) => {
      res.header('Access-Control-Allow-Credentials','true');
      var url = 'https://www.youtube.com/watch?v=' + req.params['ytLink'];
      if(ytdlcore.validateURL(url)){
        youtubedl.getInfo(url, [], function(err, info){
          if(err){
            res.status(500).send('There was an unknown error with the server.');
          }
          
          var ret = {
            "title": info.title,
            "thumbnail": info.thumbnail
          }
          console.log(ret);
          res.json(ret);
        })
      }
      else{
        res.status(500).send("The YouTube video doesn't exist");
      }
  });
  
  server.post('/api/download/audio/', (req, res) => {
      res.header('Access-Control-Allow-Credentials','true');
      var videoId = req.body['ytLink'];
      var url = 'https://www.youtube.com/watch?v=' + videoId;
      console.log(url);
      if(ytdlcore.validateURL(url)){
          youtubedl.getInfo(url, [], function(err, info) {
              if (err) {
                  console.log(err);
                  res.status(500).send('There was an unknown error with the server.');
              }
          });
        var audio = youtubedl('https://www.youtube.com/watch?v=' + videoId,
          // Optional arguments passed to youtube-dl.
          ['--format=bestaudio/best'],
          // Additional options can be given for calling `child_process.execFile()`.
          { cwd: __dirname, maxBuffer: Infinity });

        // // Will be called when the download starts.
        audio.on('info', function(info) {
          console.log('Download started');
          console.log('filename: ' + info._filename);
          console.log('size: ' + info.size);
          filename = info.title + '.mp3';
          audio.pipe(fs.createWriteStream(filename));
        })

        audio.on('end', function() {
          res.status(200).json({"filename": filename});
          console.log('finished downloading');
        })
      }
      else{
        res.status(500).send("The YouTube video doesn't exist");
      }
  });
  
  server.post('/api/download/video/', (req, res) => {
      res.header('Access-Control-Allow-Credentials','true');
      var videoId = req.body['ytLink'];
      var url = 'https://www.youtube.com/watch?v=' + videoId;
      console.log(url)
      if(ytdlcore.validateURL(url)){
        var video = youtubedl(url,
          // Optional arguments passed to youtube-dl.
          ['-f', '22'],
          // Additional options can be given for calling `child_process.execFile()`.
          { cwd: __dirname });

        // Will be called when the download starts.
        video.on('info', function(info) {
          console.log('Download started');
          console.log('filename: ' + info._filename);
          console.log('size: ' + info.size);
        });

        video.pipe(fs.createWriteStream('myvideo.mp4'));

        video.on('end', function() {
          console.log('finished downloading!');
          res.status(200).send("The video file has finished downloading!");
        });
      }
      else{
        res.status(500).send("The video doesn't exist");
      }
  });

  server.get('/api/file/:filename', (req, res) => {
      var file = req.params['filename'];
      var filename = path.basename(file);
      var mimetype = mime.lookup(file);
      res.setHeader('Content-disposition', 'attachment; filename=' + filename);
      res.setHeader('Content-type', mimetype);

      var filestream = fs.createReadStream(file);
      filestream.on('end', function() {
          fs.unlink(file);
      });
      filestream.pipe(res);

  });

  var parseHTML = function(url){
    fetch(url)
      .then(function (res) {
        return res.text();
      });
  }
  server.get('/api/searchquery/:query', (req, res) =>{
    var url = 'https://youtube.com/results?search_query=' + req.params['query'];
    var html = parseHTML(url);
    console.log(html)
  })



  server.listen(port);
  console.log(`Server listening on port: ${port}`);

}

module.exports = main;

if (require.main === module) {
    main();
}
