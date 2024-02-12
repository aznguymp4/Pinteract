import { csrfFetch } from './csrf';
export const [LOAD_COMMENTS,RECEIVE_COMMENT,REMOVE_COMMENT] = ['comments/LOAD_COMMENTS','comments/RECEIVE_COMMENT','comments/REMOVE_COMMENT'];

export const loadComments = comments => ({
	type: LOAD_COMMENTS,
	comments
})
export const receiveComment = comment => ({
	type: RECEIVE_COMMENT,
	comment
})
export const removeComment = commentId => ({
	type: REMOVE_COMMENT,
	commentId
})
export const editComment = comment => ({
	type: RECEIVE_COMMENT,
	comment
})

export const thunkFetchPinComments = pinId => dispatch => {
	dispatch(loadComments([]))
	csrfFetch(`/api/pins/${pinId}/comments`)
	.then(r=>r.json())
	.then(d => dispatch(loadComments(d)))
	.catch(console.error)
};
export const thunkCreateComment = (pinId, content, done) => dispatch => {
	csrfFetch(`/api/pins/${pinId}/comments`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({content}),
	})
	.then(r=>r.json())
	.then(d => {
		dispatch(receiveComment(d))
		done()
	})
	.catch(console.error)
}
export const thunkEditComment = (commentId, content, done) => dispatch => {
	csrfFetch('/api/comments/'+commentId, {
		method: 'PATCH',
		body: JSON.stringify({content})
	})
	.then(r=>r.json())
	.then(d=>{
		dispatch(editComment(d))
		done()
	})
	.catch(console.error)
}
export const thunkDeleteComment = commentId => dispatch => {
	dispatch(removeComment(commentId))
	csrfFetch('/api/comments/'+commentId, { method: 'DELETE' })
	.catch(console.error)
}

const commentsReducer = (state = { comments: [] }, action) => {
	switch (action.type) {
		case LOAD_COMMENTS: {
			const commentsState = {};
			action.comments.forEach((comment) => {
				commentsState[comment.id] = comment;
			});
			return commentsState;
		}
		case RECEIVE_COMMENT:
			return { ...state, [action.comment.id]: action.comment };
		case REMOVE_COMMENT: {
			const newState = { ...state };
			delete newState[action.commentId];
			return newState;
		}
		default:
			return state;
	}
};

export default commentsReducer;
