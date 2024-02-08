import { csrfFetch } from './csrf';
export const [LOAD_PINS,RECEIVE_PIN,REMOVE_PIN] = ['pins/LOAD_PINS','pins/RECEIVE_PIN','pins/REMOVE_PIN'];

export const loadPins = pins => ({
	type: LOAD_PINS,
	pins
})
export const receivePin = pin => ({
	type: RECEIVE_PIN,
	pin
})
export const removePin = pinId => ({
	type: REMOVE_PIN,
	pinId
})
export const editPin = pin => ({
	type: RECEIVE_PIN,
	pin
});

export const thunkFetchPins = (onlyOwned) => dispatch => {
	csrfFetch(`/api${onlyOwned?'/users/@me':''}/pins`)
	.then(r=>r.json())
	.then(d => dispatch(loadPins(d)))
	.catch(console.error)
};
export const thunkFetch1Pin = (id) => dispatch => {
	if(!id) return
	fetch('/api/pins/'+id)
	.then(r=>r.json())
	.then(d => dispatch(receivePin(d)))
	.catch(console.error)
};
export const thunkCreatePin = (body, nav) => dispatch => {
	csrfFetch('/api/pins', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	})
	.then(r=>r.json())
	.then(d => {
		dispatch(receivePin(d))
		nav(`/pin/${d.id}`)
	})
	.catch(console.error)
}
export const thunkEditPin = (pinId, body, nav) => dispatch => {
	csrfFetch('/api/pins/'+pinId, {
		method: 'PATCH',
		body: JSON.stringify(body)
	})
	.then(r=>r.json())
	.then(d => {
		dispatch(editPin(d))
		nav(`/pin/${d.id}`)
	})
	.catch(console.error)
}
export const thunkDeletePin = pinId => dispatch => {
	csrfFetch('/api/pins/'+pinId, { method: 'DELETE' })
	.then(() => dispatch(removePin(pinId)))
	.catch(console.error)
}

const pinsReducer = (state = { pins: [] }, action) => {
	switch (action.type) {
		case LOAD_PINS: {
			const pinsState = {};
			action.pins.forEach((pin) => {
				pinsState[pin.id] = pin;
			});
			return pinsState;
		}
		case RECEIVE_PIN:
			return { ...state, [action.pin.id]: action.pin };
		case REMOVE_PIN: {
			const newState = { ...state };
			delete newState[action.pinId];
			return newState;
		}
		default:
			return state;
	}
};

export default pinsReducer;
