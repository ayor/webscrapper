import React from 'react';
import { useSelector } from 'react-redux'
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import HomePage from './HomePage';
import Searching from '../../components/SearchingPage/Searching';
import Footer from '../../components/Footer/Footer';
import Summary from '../Summary/Summary';
import NavBar from '../../components/NavBar/NavBar';


const Welcome = props => {
    const { companyName } = useSelector(state => state);

    return (
        <React.Fragment>
            <Router>
                <NavBar />
                <Switch>
                    <Route path='/' exact render={() => <HomePage {...props} />} />
                    <Route path='/search' exact render={() => companyName === "" ? <Redirect path='/' /> : <Searching {...props} />} />
                    <Route path="/result" exact render={() => companyName === "" ? <Redirect path='/' /> : <Summary />} />
                    <Redirect to="/" />
                </Switch>
            </Router>
            <Footer />
        </React.Fragment>
    )
}

export default Welcome;