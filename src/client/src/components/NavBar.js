import React from 'react';
import {Link} from 'react-router';

class NavBar extends React.Component {
    render() {
        return (
            <nav className="nav-bar navbar-default navbar-static-top navbar-collapse">
                <div className="container">
                    <ul>
                        <li><Link href="/" id="nav-bar-brand">YTDownloader</Link></li>
                    </ul>
                </div>
            </nav>
        );
    }
}
NavBar.propTypes = {

};
export default NavBar;