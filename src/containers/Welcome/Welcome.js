import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomePage from './HomePage';
import Searching from '../../components/SearchingPage/Searching';
import Footer from '../../components/Footer/Footer';
import Summary from '../Summary/Summary';
import NavBar from '../../components/NavBar/NavBar';


const Welcome = props => {
    return (
        <React.Fragment>
            <Router>
            <NavBar />
                <Switch>
                    <Route path='/' exact render={() => <HomePage {...props} />} />
                    <Route path='/search' render={() => <Searching {...props} />} />
                    <Route path="/result" component={Summary} />
                </Switch>
            </Router>
            <Footer />
        </React.Fragment>
    )
}

export default Welcome;