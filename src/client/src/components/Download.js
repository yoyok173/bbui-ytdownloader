import React from 'react';
import { Link, browserHistory } from 'react-router';
// const youtubedl = require('youtube-dl');
// const ytdlcore = require('ytdl-core');
const fs = require('fs');

class Download extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            sent: false,
            success: true,
            statusMessage: ''
        };
        this.onSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        var context = this;
        var jsonData = JSON.stringify({
            ytLink: this.refs.downloadurl.value
        });
        fetch('/api/download/audio/', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: jsonData

        })
        .then(function(res){
            console.log(res);
            if(res.status === 200){
                context.setState({
                    sent: true,
                    success: true,
                    statusMessage: 'Download request sent!'
                })
            }
            else if(res.status === 500){
                context.setState({
                    sent: true,
                    success: false,
                    statusMessage: 'There was an error downloading this video.'
                })
            }
        })
        .catch(function(error){
            console.log(error);
            console.log(error.message);
        });
        // var url = 'https://www.youtube.com/watch?v=' + this.refs.downloadurl.value
        // if(ytdlcore.validateURL(url)){
          // var audio = youtubedl(url,
            // // Optional arguments passed to youtube-dl.
            // ['--format=bestaudio/best'],
            // // Additional options can be given for calling `child_process.execFile()`.
            // { cwd: __dirname });

          // // Will be called when the download starts.
          // audio.on('info', function(info) {
            // console.log('Download started');
            // console.log('filename: ' + info._filename);
            // console.log('size: ' + info.size);
          // });

          // audio.pipe(fs.createWriteStream('test.mp3'));
          // audio.on('end', function() {
            // console.log('finished downloading!');
          // });
        // }
        // console.log(jsonData);
    }

    render() {
        return (
            <div className="information-form reset-form center-block">
                {this.state.sent ?
                    this.state.success ? <div className = "alert alert-success" role="alert"> {this.state.statusMessage}</div> :
                        <div className = "alert alert-danger" role="alert"> {this.state.statusMessage}</div>
                    : <div/>
                }
                <h3>Download mp3 or mp4</h3>
                <form onSubmit={this.onSubmit} id="forgot-email-form">
                    <div className='form-group'>
                        <input type="text" className="form-control" name="forgotemail" autoFocus="autofocus" required placeholder="YouTube URL" id="forgotemail" ref="downloadurl"/>
                    </div>
                    <button className="btn btn-primary" type="submit">Download</button>
                </form>
            </div>
        );
    }
}
Download.propTypes = {

};
export default Download;