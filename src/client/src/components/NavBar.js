import React from 'react';
import { Link, browserHistory } from 'react-router'

class NavBar extends React.Component {
    handleLogout(e) {
        e.preventDefault()
        fetch('/api/logout', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
            .then(function(body){
                console.log(body);
                browserHistory.push('/login');
            })
            .catch(function(error){
                console.log(error);
                console.log(error.message);
                browserHistory.push('/error');
            });
    }

    // the logout button should just directly fetch to the logout endpoint
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