import { csrfFetch } from './csrf';
export const [LOAD_BOARDS,RECEIVE_BOARD,REMOVE_BOARD] = ['boards/LOAD_BOARDS','boards/RECEIVE_BOARD','boards/REMOVE_BOARD'];

export const loadBoards = boards => ({
	type: LOAD_BOARDS,
	boards
})
export const receiveBoard = board => ({
	type: RECEIVE_BOARD,
	board
})
export const removeBoard = boardId => ({
	type: REMOVE_BOARD,
	boardId
})
export const editBoard = board => ({
	type: RECEIVE_BOARD,
	board
});

export const thunkFetchBoards = () => dispatch => {
	csrfFetch(`/api/boards`)
	.then(r=>r.json())
	.then(d => dispatch(loadBoards(d)))
	.catch(console.error)
};
export const thunkFetch1Board = (id, nav) => dispatch => {
	if(!id) return
	fetch('/api/boards/'+id)
	.then(r=>{
		if(r.ok) return r
		nav('/not-found')
	})
	.then(r=>r.json())
	.then(d => dispatch(receiveBoard(d)))
	.catch(console.error)
};
export const thunkCreateBoard = (body, nav) => dispatch => {
	csrfFetch('/api/boards', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	})
	.then(r=>r.json())
	.then(d => {
		dispatch(receiveBoard(d))
		nav(`/board/${d.id}`)
	})
	.catch(console.error)
}
export const thunkEditBoard = (boardId, body, nav) => dispatch => {
	csrfFetch('/api/boards/'+boardId, {
		method: 'PATCH',
		body: JSON.stringify(body)
	})
	.then(r=>r.json())
	.then(d => {
		dispatch(editBoard(d))
		nav(`/board/${d.id}`)
	})
	.catch(console.error)
}
export const thunkDeleteBoard = boardId => dispatch => {
	csrfFetch('/api/boards/'+boardId, { method: 'DELETE' })
	.then(() => dispatch(removeBoard(boardId)))
	.catch(console.error)
}

const boardsReducer = (state = { boards: [] }, action) => {
	switch (action.type) {
		case LOAD_BOARDS: {
			const boardsState = {};
			action.boards.forEach((board) => {
				boardsState[board.id] = board;
			});
			return boardsState;
		}
		case RECEIVE_BOARD:
			return { ...state, [action.board.id]: action.board };
		case REMOVE_BOARD: {
			const newState = { ...state };
			delete newState[action.boardId];
			return newState;
		}
		default:
			return state;
	}
};

export default boardsReducer;
