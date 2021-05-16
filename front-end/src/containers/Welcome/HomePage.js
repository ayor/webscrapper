import React from 'react';
import WelcomePageClass from './Welcome.module.css';
import Banner from '../../components/Banner/Banner';
import Search from '../../components/Search/Search';
import logo from "../../assets/img/logo.png";
const HomePage = (props) => (
    <React.Fragment>
        <main className={WelcomePageClass.Welcome}>
            <div className="contain h-100 d-flex flex-column justify-content-center align-items-center">
                <Banner />
                <div className="text-center">
                    <img src={logo}
                        alt="most loved logo"
                        className="img-fluid " />
                </div>
                <Search handleBtnClick={props.handleSearchBtn} errorMessage={props.errorMessage} />
            </div>
        </main>



    </React.Fragment>
)

export default HomePage;