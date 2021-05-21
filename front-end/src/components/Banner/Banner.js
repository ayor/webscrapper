import React from 'react';
import BannerClass from './Banner.module.css';

const Banner = props => (
    <div className="row my-5">
        <div className="col">
            <div className={BannerClass.Banner}>
                <p className="text-semi-info my-4">Find out how people really feel about your company</p>
            </div>
        </div>
    </div>
)
export default Banner;