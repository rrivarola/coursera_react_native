import * as ActionTypes from './ActionTypes';

export const comments =
    (state = {
        errMess: null,
        comments: []
    }, action) => {

    switch (action.type) {
        case ActionTypes.ADD_COMMENTS:
            return {...state, errMess: null, comments: action.payload};
        case ActionTypes.COMMENTS_FAILED:
            return {...state, errMess: action.payload, comments: []};
        case ActionTypes.ADD_COMMENT: {
            const largestId = state.comments.reduce((largestId, comment) => {
                return (comment.id > largestId) ? comment.id : largestId;
            }, 0);

            const newComment = action.payload;
            newComment.id = largestId + 1;
            const comments = state.comments;
            comments.push(newComment);

            return {...state, errMess: null, comments: comments};
        }
        default:
            return state;
    }
};