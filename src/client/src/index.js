import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, Redirect } from 'react-router';
import registerServiceWorker from './registerServiceWorker';
import './stylesheets/style.css';

import Index from './pages/index';

ReactDOM.render((
    <Router history={browserHistory}>
        <Route path="/" component={Index}/>
        {/*<Redirect from="*" to="/" />*/}
    </Router>
), document.getElementById('root'));
registerServiceWorker();
