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

const toProperCase = s => s.split(/\s/g).map(w=>w[0].toUpperCase()+w.slice(1,w.length).toLowerCase()).join(' ')
export const findDisplayName = user => {
	return (user.displayName)
	|| (user.firstName && (user.lastName?.length <= 4)? `${toProperCase(user.firstName)} ${toProperCase(user.lastName)}` : null)
	|| (user.firstName && (user.lastName?.length > 4)? `${toProperCase(user.firstName)} ${user.lastName[0].toUpperCase()}.` : null)
	|| (user.firstName? toProperCase(user.firstName) : null)
	|| (user.lastName? toProperCase(user.lastName) : null)
	|| (`@${user.username}`)
}

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