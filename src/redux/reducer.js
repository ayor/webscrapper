import { SET_COMPANY_NAME, SET_REVIEW_STATUS,SET_REVIEWS_PERCENT, SET_PAGE_ID, SET_ERROR_MESSAGE, HAS_ERROR_STATUS, SET_COMMENTS } from './actionTypes'

const initialState = {
    companyName: '',
    errorMessage: '',
    goodComments: [],
    badComments: [],
    goodPageId: 1,
    badPageId: 1,
    goodPercent: '',
    badPercent: '',
    hasError: false,
    totalReviews: '',
    reviewStatus: ""
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ERROR_MESSAGE:
            let error = action.payload;
            return { ...state, errorMessage: error }
        case SET_COMPANY_NAME:
            return { ...state, companyName: action.payload }
        case SET_COMMENTS:
            return {
                ...state,
                goodComments: action.payload.comments.goodComments,
                badComments: action.payload.comments.badComments,
                totalReviews: action.payload.numberReviews,
                goodPageId: action.payload.goodPageId,
                goodPercent: action.payload.goodPercent,
                badPageId: action.payload.badPageId,
                badPercent: action.payload.badPercent,
                reviewStatus: action.payload.reviewStatus

            }
        case SET_PAGE_ID:
            return {
                ...state,
                ...action.payload
            }
        case SET_REVIEWS_PERCENT:
            return {
                ...state,
                ...action.payload
            }
        case SET_REVIEW_STATUS:
            return {
                ...state,
                ...action.payload
            }

        case HAS_ERROR_STATUS:
            return { ...state, ...action.payload }
        default:
            return state;
    }
}

export default reducer;