// Brandon Bui
// Aaron Massey
// HW 2

// Requirements
// [X] 5 User Scenarios
// [X] Use fetch to retrieve data set from a remote web service
//    [X] Data should be cached
// [X] Declare at least two classes
// [X] 5 endpoints using route parameters
// [X] 5 resources offering GET endpoints
// [X] 1 resource offering PUT endpoint
// [X] 1 resource offering POST endpoint
// [X] 1 resource offering DELETE endpoint
// [\] Invalid requests return appropriate error message

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
        });

        var audioFile = 'test.mp3';

        audio.pipe(fs.createWriteStream(audioFile));

        audio.on('end', () => {
          res.status(200).send("The audio file has finished downloading!");
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

  server.get('/api/getfile/:filetype', (req, res) => {
      var file = 'test.' + req.params['filetype'];
      var filename = path.basename(file);
      var mimetype = mime.getType(file);
      res.setHeader('Content-disposition', 'attachment; filename=' + filename);
      res.setHeader('Content-type', mimetype);

      var filestream = fs.createReadStream(file);
      filestream.on('end', function() {
          fs.unlink(file);
      });
      filestream.pipe(res);

  });



  server.listen(port);
  console.log(`Server listening on port: ${port}`);

}

module.exports = main;

if (require.main === module) {
    main();
}
