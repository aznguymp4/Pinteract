import { csrfFetch } from './csrf';

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

const setUser = user => ({
	type: SET_USER,
	payload: user
})

const removeUser = () => ({
	type: REMOVE_USER
})

export const thunkSignup = (user) => async (dispatch) => {
	csrfFetch('/api/users', {
		method: 'POST',
		body: JSON.stringify(user)
	})
	.then(r=>r.json())
	.then(d=>dispatch(setUser(d.user)))
};
export const thunkLogin = (user) => dispatch => {
	csrfFetch('/api/session', {
		method: 'POST',
		body: JSON.stringify(user)
	})
	.then(r=>r.json())
	.then(d=>dispatch(setUser(d.user)))
};
export const thunkRestoreUser = () => dispatch => {
	csrfFetch('/api/session')
	.then(r=>r.json())
	.then(d=>dispatch(setUser(d.user)))
};
export const thunkLogout = () => dispatch => {
	csrfFetch('/api/session', {method: 'DELETE'})
	.then(()=>dispatch(removeUser()))
};

const sessionReducer = (state = { user: null }, action) => {
	switch (action.type) {
		case SET_USER:
			return { ...state, user: action.payload };
		case REMOVE_USER:
			return { ...state, user: null };
		default:
			return state;
	}
};

export default sessionReducer;