import React from 'react';
import { Link, browserHistory } from 'react-router';
// const youtubedl = require('youtube-dl');
const ytdlcore = require('ytdl-core');
const fs = require('fs');
var query = '';
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
        query = this.refs.downloadquery.value;
        var jsonData = JSON.stringify({
            ytLink: query
        });
        if(!ytdlcore.validateURL(query)){
            fetch('/api/searchquery/' + query, {
                method: "GET"
            })
            .then(function(res) {
                var query = res.text();
                console.log(query);
                return query;
            })
            .then(function(url){
                console.log(url);
                console.log(jsonData);
                jsonData = JSON.stringify({
                    ytLink: url
                });
                console.log(jsonData);
            })
        }
        console.log(jsonData);

        context.setState({
            sent: true,
            success: false,
            statusMessage: 'Download in progress...'
        });

        fetch('/api/download/audio/', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: jsonData

        })
        .then(function(res) {
          if(res.status === 200){
              context.setState({
                  sent: true,
                  success: false,
                  statusMessage: 'Download finished. Installing now!'
              })

          }
          else if(res.status === 500){
              context.setState({
                  sent: true,
                  success: false,
                  statusMessage: 'There was an error downloading this video.'
              })
          }
          return res.json();
        })
          .then(function(body){
            console.log(body);
            var url = 'http://localhost:5000/api/file/' + body['filename'];
            window.location.assign(url);
            context.setState({
                sent: true,
                success: true,
                statusMessage: 'Download finished!'
            });

        })
        .catch(function(error){
            console.log(error);
            console.log(error.message);
        });
    }

    render() {
        return (
            <div className="information-form download-form center-block">
                {this.state.sent ?
                    this.state.success ? <div className = "alert alert-success" role="alert"> {this.state.statusMessage}</div> :
                        this.state.statusMessage === "Download in progress..." || this.state.statusMessage === "Download finished. Installing now!" ? <div className="alert alert-warning" role="alert"> {this.state.statusMessage}</div> :
                        <div className = "alert alert-danger" role="alert"> {this.state.statusMessage}</div>
                    : <div/>
                }
                <h3>Download YouTube Video</h3>
                <form onSubmit={this.onSubmit} id="forgot-email-form">
                    <div className='form-group'>
                        <input type="text" className="form-control" name="downloader" autoFocus="autofocus" required placeholder="YouTube URL or Query" id="downloader"
                               ref="downloadquery"/>
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