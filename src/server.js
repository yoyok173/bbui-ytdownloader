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
var URL = require('url');

// Setup the server
const server = express();
const port = process.env.PORT || 5000;
server.use(bodyParser.json());




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
      res.setHeader('Content-disposition', 'attachment; filename=' + 'test.mp3');
			res.setHeader('Content-Type', 'application/audio/mpeg3')
      var videoId = req.body['ytLink'];
      var url = 'https://www.youtube.com/watch?v=' + videoId;
      console.log(url);
      if(ytdlcore.validateURL(url)){
        var audio = youtubedl(url,
          // Optional arguments passed to youtube-dl.
          ['--format=bestaudio/best'],
          // Additional options can be given for calling `child_process.execFile()`.
          { cwd: __dirname });
        // // Will be called when the download starts.
        // audio.on('info', function(info) {
          // console.log('Download started');
          // console.log('filename: ' + info._filename);
          // console.log('size: ' + info.size);
        // });

        audio.pipe(fs.createWriteStream('test.mp3'));
        audio.on('end', function() {
          console.log('finished downloading!');
          var rstream = fs.createReadStream(__dirname + '/../test.mp3');
          rstream.pipe(res);
        });
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



  server.listen(port);
  console.log(`Server listening on port: ${port}`);

}

module.exports = main;

if (require.main === module) {
    main();
}
