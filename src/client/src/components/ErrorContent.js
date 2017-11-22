import React from 'react';

class ErrorContent extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="jumbotron">
          <h2>You a god damn clown.</h2>
          <p>I don't know how you got here, but this page doesn't exist</p>
          <p>Click on the navigation bar to go somewhere else</p>
        </div>
      </div>
    );
  }
}
ErrorContent.propTypes = {
  
};
export default ErrorContent;