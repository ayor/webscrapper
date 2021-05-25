import React from "react";
// import ErrorClass from './errorHandling.modules.css';

const ErrorHandler = props => (<React.Fragment>
<div class="alert alert-danger mx-auto w-50 d-flex text-center " role="alert">
    <p > {props.errorMessage} 
</p>
 <button onClick={props.closeError} className="ml-auto text-muted "><i className="fa fa-times"></i></button>
</div>
        
</React.Fragment>
)

export default ErrorHandler;