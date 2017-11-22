import React from 'react';
import Welcome from './Welcome';
import Download from './Download';

class HomeContent extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="jumbotron">
          <Download />
        </div>
      </div>
    );
  }
}
HomeContent.propTypes = {
  
};
export default HomeContent;