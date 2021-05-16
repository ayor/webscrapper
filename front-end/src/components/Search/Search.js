import React, { useState } from 'react';
import SearchClass from './Search.module.css';
import { withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { COMPANY_NAME, ERROR_MESSAGE } from "../../redux/actions";


const Search = props => {
    const [inputState, setInputState] = useState('');

    const errorMessage = useSelector(state => state.errorMessage);
    const dispatch = useDispatch()

    const handleChange = event => {
        event.preventDefault();
        const value = event.target.value;
        setInputState(value);

    }
    const handleSearchBtn = () => {
        if (inputState === "") {
            dispatch(ERROR_MESSAGE("Kindly enter your company name"));
            setTimeout(() => {
                dispatch(ERROR_MESSAGE(""));
            }, 3000);
            return;
        }
        dispatch(COMPANY_NAME(inputState));
        props.history.push('/search');
    }


    return (
        <React.Fragment>
            <div className="row w-75 my-5">
                <div className="col text-center ">
                    <form onSubmit={handleSearchBtn}>
                        <div className={"form-group my-3 mx-auto " + SearchClass.FormGroup}>
                            <span className={"fa fa-search " + SearchClass.FormIcon}></span>
                            <input onChange={handleChange} type="text" className={"form-control " + SearchClass.SearchInput} placeholder="Search Your Company Name..." />
                            <p className="text-danger">{errorMessage}</p>
                        </div>
                        <button className="btn btn-semi-info my-3 rounded" type="submit" value={inputState}>Search</button>
                    </form>
                </div>
            </div>
        </React.Fragment>
    )
}

export default withRouter(Search);