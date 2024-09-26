import React from 'react';

const Pagination = props => {
    return (
        <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center mt-3">
                {props.pageId > 1 ? <li className="page-item">
                    <button className={props.prevIsDisabled ? `page-link disbaled` : "page-link"} onClick={props.handlePrevBtn} tabIndex="-1">Previous</button>
                </li> : null}

                <li className="page-item">
                    { props.length < 10 ? null : <button className={props.nextIsDisabled ? `page-link disbaled` : "page-link"} onClick={props.handleNextBtn} href="#">Next</button>
                    }
                </li>
            </ul>
        </nav>
    )
};

export default Pagination;