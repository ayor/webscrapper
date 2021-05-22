import React from 'react';
import { NavLink } from "react-router-dom";

const SummaryNav = props => (
    <nav className="d-flex justify-content-center">
        <ul className="nav nav-tabs p-2 ">
            <li className="nav-item">
                <NavLink to="/result" exact className="nav-link" >Good Comments</NavLink>
            </li>
            <li className="nav-item">
                <NavLink to="/result/bd-comments" className="nav-link" >Could Do Better Comments</NavLink>
            </li>
        </ul>
    </nav>);


export default SummaryNav