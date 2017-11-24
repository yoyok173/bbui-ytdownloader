// Brandon Bui

// imports
const fs = require('fs');
const express = require('express');
const youtubedl = require('youtube-dl');
const ytdlcore = require('ytdl-core');
const bodyParser = require('body-parser');
const path = require('path');
const mime = require('mime');
const fetch = require('node-fetch');
var jssoup = require('jssoup').default;

// Setup the server
const server = express();
const port = process.env.PORT || 5000;
server.use(bodyParser.json());
server.use(express.static(__dirname + '/client/build'));



var main = function () {
  var filename = '';

  server.post('/api/download/audio/', (req, res) => {
      res.header('Access-Control-Allow-Credentials','true');
      var url = req.body['ytLink'];
      console.log(url);
      if(ytdlcore.validateURL(url)){
          youtubedl.getInfo(url, [], function(err, info) {
              if (err) {
                  console.log(err);
                  res.status(500).send('There was an unknown error with the server.');
              }
          });
        var audio = youtubedl(url,
          // Optional arguments passed to youtube-dl.
          ['-f', 'bestaudio/best'],
          // ['-f', 'bestaudio/140'],
          // Additional options can be given for calling `child_process.execFile()`.
          { cwd: __dirname, maxBuffer: Infinity });

        // // Will be called when the download starts.
        audio.on('info', function(info) {
          console.log('Download started');
          console.log('filename: ' + info._filename);
          console.log('size: ' + info.size);
          filename = info.title + '.MP3';
          filename = filename.replace(/[^\x00-\x7F]/g, "");
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
      var mimetype = mime.getType(file);
      res.setHeader('Content-disposition', 'attachment; filename*=UTF-8\"' + filename + '\"');
      res.setHeader('Content-type', mimetype);
      var filestream = fs.createReadStream(file);
      filestream.on('end', function() {
          fs.unlink(file);
      });
      filestream.pipe(res);

  });

  server.get('/api/searchquery/:query', (req, res) =>{
    var url = 'https://youtube.com/results?search_query=' + req.params['query'];
    fetch(url)
        .then(function (resp) {
            return resp.text();
        })
        .then(function(html) {
            var soup = new jssoup(html);
            for (var vid of soup.findAll('a')){
                var urlClass = JSON.stringify(vid['attrs']['class']);
                var vidHref = JSON.stringify(vid['attrs']['href']);
                if(urlClass && urlClass.includes('yt-uix-tile-link') && vidHref.startsWith('\"/watch')){
                    var vidHrefWithoutQuotes = vidHref.substring(1, vidHref.length-1);
                    return "https://www.youtube.com" + vidHrefWithoutQuotes;
                }
            }
        })
        .then(function(url){
            res.send(url);
        });
  })

  server.post('/api/validate/', (req, res) => {
      var fullUrl = req.protocol + '://' + req.get('host');
      res.status(200).json({
        "validated": ytdlcore.validateURL(req.body['url']),
        "location": fullUrl
        });
  })

  server.get('*', function (req, res){
    res.sendFile(__dirname+'/client/build/index.html');
  });

  server.listen(port);
  console.log(`Server listening on port: ${port}`);

}

module.exports = main;

if (require.main === module) {
    main();
}
