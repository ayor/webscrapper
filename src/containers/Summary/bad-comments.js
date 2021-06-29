import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SummaryClass from './Summary.module.css'
import Pagination from "../../components/Pagination/Pagination";
import { axiosInstance } from "../../axios-instance";
import { COMMENT, REVIEW_STATUS } from "../../redux/actions";
import Noreviews from '../../components/Noreviews/Noreviews';
import Review from "../../components/Review/Review";
import TotalReviews from "../../components/TotalReviews/TotalReviews";


const GET_CONTENT = async (newPage, companyName) => {
    try {

        const response = await axiosInstance({
            params: {
                badPageId: newPage
            },
            method: "POST",
            data: {
                company_name: companyName
            }
        })
        return response.data;
    } catch (error) {
        throw error;
    }
}

const BadComments = props => {
    let { badPageId, companyName, badComments } = useSelector(state => state);
    const [comments, setComments] = useState(badComments);
    const dispatch = useDispatch();

    useEffect(() => {
        let sse = new EventSource(`${process.env.REACT_APP_BASE_URL_PROD+"/more?company_name="+companyName+"&goodPageId="+badPageId}`);
        const workOnData = (data) => {
            
            if(!data){
                return;
            }
            let {comments, reviewStatus} = data; 
            setComments(comments.badComments);
            dispatch(REVIEW_STATUS(reviewStatus))
        }
    
        sse.onmessage = (ev) => workOnData(JSON.parse(ev.data))
        return () => {
        sse.close();
        }
    }, [companyName, badComments,dispatch, badPageId])


    const handlePrevBtn = async () => {
        props.setSearching(true);
        if (badPageId === 1) {
            return;
        }
        let newPage = badPageId - 1;

        const response = await GET_CONTENT(newPage, companyName);
        if (response) {
            props.setSearching(false);
            setComments(response.comments)
            dispatch(COMMENT(response));
        }
    }

    const handleNextBtn = async () => {
        props.setSearching(true);

        let newPage = badPageId + 1;
        const response = await GET_CONTENT(newPage, companyName);

        if (response.comments.badComments.length) {
            props.setSearching(false);
            setComments(response.comments);
            dispatch(COMMENT(response));
        } else {

        }

    }
    let __badComments = (<Noreviews commentType={"bad"}/>)

    if (comments.length > 0) {

        __badComments = comments
            .map(comment => (
                <li className="p-2"
                    key={comment.id}>
                    <Review comment={comment} />
                </li>));
    }



    return (
        <React.Fragment>
            <div className={"text-muted " + SummaryClass.Comments}>
            <TotalReviews 
                reviewStatus={props.reviewStatus} 
                companyName={companyName}
                totalReviews={props.totalReviews} 
                symbol={"😠" }
                label={"angry"} 
                percentType={"badPercent"}/>

                <div className="comments mt-3">
                    <ul className="list-unstyled">
                        {__badComments}
                    </ul>

                </div>
            </div>
            {/* {comments.length < 10 ? <MoreButton clicked ={searchForMore.bind(this, goodPageId+1)}/> : null } */}
            {props.isSearching ?  null : (<Pagination
                pageId={badPageId}
                length={comments.length}
                handleNextBtn={handleNextBtn}
                handlePrevBtn={handlePrevBtn}

            />)}
        </React.Fragment>
    )
}

export default BadComments;
