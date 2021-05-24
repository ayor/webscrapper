import React from 'react';
import {
    BrowserRouter as Router,
    Route, Switch
} from 'react-router-dom';
import Welcome from './containers/Welcome/Welcome';

const Layout = props => {
    
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={Welcome} />
            </Switch>
        </Router>
    )
};

export default Layout;