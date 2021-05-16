import React, { useState } from 'react';
import GoodComments from './good-comments';
import BadComments from './bad-comments';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SumNav from "./SummaryNav";
import Loading from "../../components/Loading/Loading";
import { useSelector } from 'react-redux';



const Summary = () => {
    const [isSearching, setSearching] = useState(false);
    const {totalReviews } = useSelector(state => state);
    return (
        <React.Fragment>
            <Router>
            <SumNav />
            <div className="row ">
                <div className="col h-100 d-flex flex-column align-items-center">
                    <div className="mx-auto mt-2 w-75">
                        {isSearching ? (<div className="text-center my-5"> <Loading /> </div>) : (
                            <Switch>
                                <Route path="/result" exact render={() => <GoodComments totalReviews={totalReviews} isSearching={isSearching} setSearching={(val)=> setSearching(val)} />} />
                                <Route path="/result/bd-comments"  render={() => <BadComments totalReviews={totalReviews} isSearching={isSearching} setSearching={(val)=> setSearching(val)}
                    />} />
                            </Switch>
                        
                        )}

                    </div>
                </div>
            </div>
            </Router>
        </React.Fragment>
    )
};

export default Summary;

