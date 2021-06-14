import { SET_COMPANY_NAME,SET_REVIEW_STATUS, SET_REVIEWS_PERCENT,SET_PAGE_ID, SET_ERROR_MESSAGE, SET_COMMENTS, HAS_ERROR_STATUS } from './actionTypes'


export const ERROR_MESSAGE = (err) => {
    return {
        type: SET_ERROR_MESSAGE,
        payload: err
    }
};

export const COMPANY_NAME = (companyName) => {
    return {
        type: SET_COMPANY_NAME,
        payload: companyName
    }
}
export const REVIEW_STATUS = (status) => {
    return {
        type: SET_REVIEW_STATUS,
        payload: status
    }
}
export const REVIEWS_PERCENT = (data) => {
    debugger
    return {
        type: SET_REVIEWS_PERCENT,
        payload: data
    }
}
export const COMMENT = (response) => {
    return {
        type: SET_COMMENTS,
        payload: response
    }
}
export const SET_BADPAGE = (badPageId) => {
    return {
        type: SET_PAGE_ID,
        payload: badPageId
    }
}
export const SET_GOODPAGE = (goodPageId) => {
    return {
        type: SET_PAGE_ID,
        payload: goodPageId
    }
}

export const HAS_ERROR = (errorMessage) => {
    return {
        type: HAS_ERROR_STATUS,
        payload: { hasError: true, errorMessage }
    }
}

