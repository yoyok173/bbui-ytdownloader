import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import registerServiceWorker from './registerServiceWorker';
import './stylesheets/style.css';

import Index from './pages/index';
import Error from './pages/error';

// Second to last route is due to a terible bugfix I need to investigate more when I have time and
// have brandon with me because he knows more about this sorta thing

ReactDOM.render((
    <Router history={browserHistory}>
        <Route path="/" component={Index}/>
        <Route path="*" component={Error}/>
    </Router>
), document.getElementById('root'));
registerServiceWorker();
