import React from "react";
const ErrorHandler = props => (<React.Fragment>

    <div className="modal fade" id="errorModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel"> Error Occured</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                   <p className="text-danger h3">{props.errorMessage}</p>
      </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger" onClick={props.closeError} data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</React.Fragment>
)

export default ErrorHandler;