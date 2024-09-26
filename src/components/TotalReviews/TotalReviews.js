import React, { useEffect, useState } from 'react';
import Spinner from '../Spinner/Spinner';
import Emoji from '../Emoji/Emoji';
// import {axiosInstance} from '../../axios-instance'
const TotalReviews = props => {

    const [totalReviews, setReviews] = useState(props.totalReviews);
    const [goodPercent, setGdPercent] = useState();
    const [badPercent, setPercent] = useState();
    const [status, setStatus] = useState("PEN");
    const [companyName] = useState(props.companyName)


    useEffect(() => {

        let sse = new EventSource(`${process.env.REACT_APP_BASE_URL_PROD+"/totalreviews?company_name="+companyName}`);
        
        const workOnData = ({ numberReviews, goodPercent, badPercent, reviewStatus }) => {
            
            if (reviewStatus) {

                setReviews(numberReviews);
                setPercent(badPercent);
                setGdPercent(goodPercent);
                setStatus(reviewStatus);
            }
        }
        
        sse.onmessage = (ev) => workOnData(JSON.parse(ev.data))

        return () => {
        sse.close();
    }

}, [companyName])

const styles = {
    width: "25%",
    margin: "1em"
}


return (<div>
    <h3 className="h3 text-semi-info text-center my-1">
        {status === "PEN" ?
            <Spinner spinnerClass="text-info" /> :
            props.percentType === "goodPercent" ? goodPercent : badPercent}% employees
        <Emoji emojiClass="mr-2 "
            symbol={props.symbol}
            label={props.label} />
        <span className="text-danger font-weight-bold text-uppercase">
            {companyName}</span>
    </h3>

    {status === "PEN" ? (<div>
        <p className={"text-dark ml-5 p-3 bg-warning h4 "} style={styles} >
            Total Reviews: <Spinner /></p> </div>) : (<p
        className={"text-dark ml-5 p-3 bg-warning h4 "} style={styles}>
        Total Reviews: {totalReviews}</p>)}
</div>

)
}

export default TotalReviews;
