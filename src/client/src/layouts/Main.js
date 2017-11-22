import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

class Main extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div className="content-wrapper">
          <NavBar/>
          {this.props.children}
          <Footer />
      </div>
    );
  }
}
Main.propTypes = {
  
};
export default Main;