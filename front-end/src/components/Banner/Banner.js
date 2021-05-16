import React from 'react';
import BannerClass from './Banner.module.css';

const Banner = props => (
    <div className="row my-5">
        <div className="col">
            <div className={BannerClass.Banner}>
                <h2 className=" text-semi-info font-weight-bold"><span >RULoved </span> <span className="text-capitalize">search engine </span></h2>
                <p className="text-semi-info my-4">Find out how people really feel about your company</p>
            </div>
        </div>
    </div>
)
export default Banner;