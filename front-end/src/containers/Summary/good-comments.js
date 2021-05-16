import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Emoji from "../../components/Emoji/Emoji";
import SummaryClass from './Summary.module.css'
import Pagination from "../../components/Pagination/Pagination";
import { axiosInstance } from "../../axios-instance";
import { COMMENT } from "../../redux/actions";

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
    let { goodPageId, companyName, goodComments, goodPercent } = useSelector(state => state);
    const [comments, setComments] = useState(goodComments);
    const dispatch = useDispatch();

    useEffect(() => {
        setComments(goodComments);
    }, [goodComments])

    const handlePrevBtn = async () => {
        props.setSearching(true);
        if (goodPageId === 1) {
            return;
        }
        let newPage = goodPageId - 1 ;

        const response = await GET_CONTENT(newPage, companyName);
        if (response) {
            props.setSearching(false);
            setComments(response.comments)
            dispatch(COMMENT(response));
        }
    }

    const handleNextBtn = async () => {
        props.setSearching(true);

        let newPage = goodPageId + 1;
        const response = await GET_CONTENT(newPage, companyName);

        if (response) {
            props.setSearching(false);
            setComments(response.comments)
            dispatch(COMMENT(response));
        }

    }
    let __goodComments = (<div className=" text-center">
        <p
            className="h3 text-center text-muted my-5 p-5">
            Ooops looks like nothing has been said so far..
        <Emoji emojiClass="mr-2 " symbol="🧐" label="shcoked" />. Please try again..</p>
        <a href='/' className="btn btn-semi-info">try again..</a>
    </div>)

    if (comments.length > 0) {

        __goodComments = comments
            .map((comment) => (
                <li className="p-2"
                    key={comment.id}>
                    <div className="d-flex">
                        <div>
                            <span className="fa fa-user-circle fa-2x text-dark mr-2"></span>
                        </div>
                        <div>
                            <small className="text-muted">{comment.employee}</small>
                            <p className="border-bottom border-semi-info p-1 ">
                                {comment.comment}</p>
                        </div>

                    </div>

                </li>));
    }



    return (
        <React.Fragment>
            <div className={"text-muted " + SummaryClass.Comments}>
                <h3 className="h3 text-semi-info text-center my-1"> {goodPercent}% employees <Emoji emojiClass="mr-2 " symbol="❤️" label="shcoked" /> <span className="text-danger font-weight-bold text-uppercase">{companyName}</span></h3>
                <p className={"text-dark ml-5 p-3 bg-warning h4 "+SummaryClass.totalReviews}>Total Reviews: {props.totalReviews}</p>

                <div className="comments mt-3">

                    <ul className="list-unstyled">
                        {__goodComments}
                    </ul>

                </div>
            </div>
            {props.isSearching || comments.length < 5 ? null : (<Pagination
                pageId={goodPageId}
                handleNextBtn={handleNextBtn}
                handlePrevBtn={handlePrevBtn}
            />)}
        </React.Fragment>
    )
}

export default GoodComments;