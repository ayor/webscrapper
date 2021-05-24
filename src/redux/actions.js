import { SET_COMPANY_NAME, SET_ERROR_MESSAGE, SET_COMMENTS, HAS_ERROR_STATUS} from './actionTypes'


export const ERROR_MESSAGE = (err) => {
    return{
        type: SET_ERROR_MESSAGE,
        payload: err 
    }
};

export const COMPANY_NAME = (companyName) => {
    return{
        type: SET_COMPANY_NAME,
        payload: companyName
    }
}
export const COMMENT = (response) => {
    return{
        type: SET_COMMENTS,
        payload: response
    }
}

export const HAS_ERROR = (errorMessage) => {
    return{
        type: HAS_ERROR_STATUS,
        payload: {hasError:true, errorMessage}
    }
}

