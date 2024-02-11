//
//   THE PURPOSE OF THIS FILE IS FOR GRABBING OTHER USERS SUCH AS VIEWING PROFILES, NOT SESSION USERS.
//   FOR SESSION USER AND AUTH, GO TO ./session.js
//

import { csrfFetch } from './csrf';
export const [LOAD_USERS,RECEIVE_USER,UPDATE_USER,REMOVE_USER] = ['users/LOAD_USERS','users/RECEIVE_USER','users/UPDATE_USER','users/REMOVE_USER'];

export const receiveUser = user => ({
	type: RECEIVE_USER,
	user
})
export const updateUser = user => ({
	type: UPDATE_USER,
	user
})

export const thunkFetch1User = (id, include) => dispatch => {
	csrfFetch(`/api/users/${id}${include?`?include=${include}`:''}`)
	.then(r=>r.json())
	.then(d => dispatch(receiveUser(d)))
	.catch(console.error)
};

const toProperCase = s => s.split(/\s/g).map(w=>w[0].toUpperCase()+w.slice(1,w.length).toLowerCase()).join(' ')
export const findDisplayName = user => {
	if(!user) return `...`
	return (user.displayName)
	|| (user.firstName && (user.lastName?.length <= 4)? `${toProperCase(user.firstName)} ${toProperCase(user.lastName)}` : null)
	|| (user.firstName && (user.lastName?.length > 4)? `${toProperCase(user.firstName)} ${user.lastName[0].toUpperCase()}.` : null)
	|| (user.firstName? toProperCase(user.firstName) : null)
	|| (user.lastName? toProperCase(user.lastName) : null)
	|| (`@${user.username}`)
}
export const findPfpSrc = user => user?.icon || '/icons/blankPfp.svg'

const usersReducer = (state = { users: [] }, action) => {
	switch (action.type) {
		case LOAD_USERS: {
			const usersState = {};
			action.users.forEach((user) => {
				usersState[user.id] = user;
			});
			return usersState;
		}
		case RECEIVE_USER:
			return { ...state, [action.user.id]: action.user };
		case UPDATE_USER: {
			return { ...state, [action.user.id]: {...state[action.user.id], ...action.user} }
		}
		case REMOVE_USER: {
			const newState = { ...state };
			delete newState[action.userId];
			return newState;
		}
		default:
			return state;
	}
};

export default usersReducer;
