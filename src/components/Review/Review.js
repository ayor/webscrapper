import React from 'react';

const Review = props => (<div className="d-flex">
    <div>
        <span className="fa fa-user-circle fa-2x text-dark mr-2"></span>
    </div>
    <div>
        <small className="text-muted">{props.comment.employee} </small>
        <small className="text-muted ml-2 ">from - ({props.comment.scrapper})</small>
        {/* <small className="text-muted ml-2 ">from - (indeed.com)</small> */}
        <p className="border-bottom border-semi-info p-1 ">
            {props.comment.comment}</p>
    </div>

</div>
);

export default Review;