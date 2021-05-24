import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from "../../assets/img/logo.png";
const NavBar = props => {
  return (
    <nav className="navbar navbar-expand-sm navbar-white bg-white ">
      <div className="d-flex">
      <NavLink className={`text-dark navbar-brand`} to='/'> <img src={logo} alt="most loved logo"
        className="img-fluid nav-image" /></NavLink>
        <div className="navbar-toggler" data-toggle="collapse" data-target="#searchnavs" aria-controls="searchnavs" aria-expanded="false" aria-label="Toggle navigation">
        <span className="fa fa-bars mt-2 text-semi-info" ></span>

        </div>

      </div>
      
      <div className="collapse navbar-collapse" id="searchnavs" >
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <NavLink className={`text-dark text-uppercase  nav-link mr-3 `} to='/'>Search</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className={`text-dark text-uppercase  nav-link mr-3 `} to='/result'>Summary</NavLink>
          </li>
        </ul>

      
      </div>
    </nav>
  )
}

export default NavBar;