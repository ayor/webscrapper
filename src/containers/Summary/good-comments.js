import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SummaryClass from './Summary.module.css'
import Pagination from "../../components/Pagination/Pagination";
import { axiosInstance } from "../../axios-instance";
import { COMMENT, SET_GOODPAGE,REVIEW_STATUS } from "../../redux/actions";
import Noreviews from '../../components/Noreviews/Noreviews';
import Review from "../../components/Review/Review";
import TotalReviews from "../../components/TotalReviews/TotalReviews";


const GET_CONTENT = async (newPage, companyName) => {
    try {

        const response = await axiosInstance({
            params: {
                goodPageId: newPage
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

const GoodComments = props => {
    let { goodPageId, companyName, goodComments } = useSelector(state => state);
    const [comments, setComments] = useState(goodComments);
    const dispatch = useDispatch();

    useEffect(() => {

        let sse = new EventSource(`${process.env.REACT_APP_BASE_URL+"/more?company_name="+companyName+"&goodPageId="+goodPageId}`);

        const workOnData = (data) => {
            
            if(!data){
                return;
            }
            let {comments, reviewStatus} = data; 
            setComments(comments.goodComments);
            dispatch(REVIEW_STATUS(reviewStatus))
            sse.close();
        }
    
        sse.onmessage = (ev) => workOnData(JSON.parse(ev.data))
        return () => {
        sse.close();
        }
    }, [companyName, goodComments, dispatch, goodPageId])
    const handlePrevBtn = async () => {
        props.setSearching(true);
        if (goodPageId === 1) {
            return;
        }
        let newPage = goodPageId - 1;
        dispatch(SET_GOODPAGE(newPage))

        const response = await GET_CONTENT(newPage, companyName);
        if (response) {
            props.setSearching(false);
            setComments(response.comments);
            dispatch(COMMENT(response));
        }
    }
    const searchForMore = async (page) => {
        const res = await axiosInstance({
            url: "/more",
            params: {
                goodPageId: page,
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

    const handleNextBtn = async () => {
        props.setSearching(true);

        let newPage = goodPageId + 1;
        const response = await GET_CONTENT(newPage, companyName);

        if (response.comments.goodComments.length > 0) {
            props.setSearching(false);
            setComments(response.comments)
            dispatch(COMMENT(response));
        } else {
            setComments(response.comments)
            dispatch(COMMENT(response));
            searchForMore(newPage);
            props.setSearching(false);
        }
    }

    let __goodComments = (<Noreviews commentType={"good"}/>)

    if (comments.length > 0) {

        __goodComments = comments
            .map((comment) => (
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
                symbol="❤️" 
                label="love" 
                percentType={"goodPercent"}/>
                <div className="comments mt-3">
                    <ul className="list-unstyled">
                        {__goodComments}
                    </ul>

                </div>
            </div>
            {/* {comments.length < 10 ? <MoreButton clicked ={searchForMore.bind(this, goodPageId+1)}/> : null } */}
            {props.isSearching ? null : (<Pagination
                pageId={goodPageId}
                handleNextBtn={handleNextBtn}
                handlePrevBtn={handlePrevBtn}
                prevIsDisabled={__goodComments.length < 20}
                nextIsDisabled={__goodComments.length < 20}
            />)}
        </React.Fragment>
    )
}

export default GoodComments;
