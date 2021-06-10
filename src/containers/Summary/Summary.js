import React, { useState } from 'react';
import GoodComments from './good-comments';
import BadComments from './bad-comments';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SumNav from "./SummaryNav";
import Loading from "../../components/Loading/Loading";
import { useSelector, useDispatch } from 'react-redux';
import { axiosInstance } from "../../axios-instance";
import { COMMENT } from "../../redux/actions";


const Summary = () => {
    const [isSearching, setSearching] = useState(false);
    const dispatch = useDispatch();

    const { totalReviews, goodPageId, badPageId, companyName, reviewStatus } = useSelector(state => state);

    const searchForMore = async () => {
        const res = await axiosInstance({
            url:"/more",
            params: {
                goodPageId,
                badPageId
            },
            method: "POST",
            data: {
                company_name: companyName
            }
        })
        if (res) {
            dispatch(COMMENT(res.data));
        }
    }

    return (
        <React.Fragment>
            <Router>
                <SumNav />
                <div className="row ">
                    <div className="col h-100 d-flex flex-column align-items-center">
                        <div className="mx-auto mt-2 w-75">
                            {isSearching ? (<div className="text-center my-5 h-100"> <Loading /> </div>) : (
                                <Switch>
                                    <Route path="/result" exact render={() => <GoodComments searchForMore={searchForMore} totalReviews={totalReviews} reviewStatus={reviewStatus} isSearching={isSearching} setSearching={(val) => setSearching(val)} />} />
                                    <Route path="/result/bd-comments" render={() => <BadComments searchForMore={searchForMore} totalReviews={totalReviews} reviewStatus={reviewStatus} isSearching={isSearching} setSearching={(val) => setSearching(val)}
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

