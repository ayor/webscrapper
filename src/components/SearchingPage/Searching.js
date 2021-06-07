import React, { useEffect, useState } from 'react';
import Loading from '../Loading/Loading';
import Emoji from '../Emoji/Emoji';
import { axiosInstance } from "../../axios-instance";
import { useSelector, useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import { COMMENT } from '../../redux/actions'
import ErrorHandler from "../../containers/errorHandling/errorHandling";
import SearchingClass from './Searching.module.css';

const messages = [
    "Searching the web for how people feel about your company...",
    "Do employees feel they can easily collaborate within your company?",
    "Do your employees feel that your company has a positive view of the future?",
    "Does your company have values that align with your employees behaviors?",
    "Does your company respect your employees?",
    "Does your company have achievable goals that employees can celebrate?"
]


const Searching = props => {
    const { companyName } = useSelector(state => state);
    const [errorMessage, setErrorMessage] = useState('');
    const [searchMessage, setSearchMessage] = useState(messages[0]);
    const [messageIndex, setMessageIndex] = useState(0);

    const dispatch = useDispatch();

  

    const changeMessages = () => {

        if (messageIndex < messages.length) {
            let nexMessgeInd = messageIndex + 1;
            setMessageIndex(nexMessgeInd)
            setSearchMessage(messages[messageIndex])
        } else {
            setMessageIndex(0);
            setSearchMessage(messages[0])
        }
    }

    useEffect(() => {
        setTimeout(() => {
            changeMessages();
        }, 2000);
    });

    useEffect(() => {
        let mounted = true;
        const fetchComments = async () => {
            try {
                const response = await axiosInstance({
    
                    method: "POST",
                    data: {
                        company_name: companyName
                    }
                })
                return response.data;
            } catch (error) {
                throw error;
            }
        };

        fetchComments().then(response => {
            if (mounted) {
                dispatch(COMMENT(response));
                props.history.push('/result');
            }
        })
            .catch(error => {
                if (error.status === 503) {
                    setErrorMessage(`we have noticed a connection problem, kindly check your connection and try again later. 
                `);


                } else {
                    setErrorMessage(`An error occurred, kindly try again later. 
    `);


                }
            });


        return () => { mounted = false; };

    },[companyName,props, dispatch])

    return (
        <React.Fragment>
            {errorMessage ? <ErrorHandler closeError={() => props.history.push('/')} errorMessage={errorMessage} /> : null}

            <div className="row vh-100 mt-5">
                <div className="col h-100 d-flex flex-column justify-content-center align-items-center">
                    <div className="search-text text-center mx-auto w-50">

                        <Emoji emojiClass={"display-4 " + SearchingClass.Emoji} symbol="❤️" label="love" />

                        <p className={"h3 " + SearchingClass.LoadInfo}>{searchMessage}</p>
                        <div className="loader my-4">
                            <Loading />
                        </div>
                    </div>

                </div>
            </div>
        </React.Fragment>
    )
}

export default withRouter(Searching);