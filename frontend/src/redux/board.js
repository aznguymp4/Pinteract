import { csrfFetch } from './csrf';
export const [LOAD_BOARDS,RECEIVE_BOARD,UPDATE_BOARD,REMOVE_BOARD] = ['boards/LOAD_BOARDS','boards/RECEIVE_BOARD','boards/UPDATE_BOARD','boards/REMOVE_BOARD'];

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
	type: UPDATE_BOARD,
	board
});

export const thunkFetchBoards = () => dispatch => {
	csrfFetch(`/api/boards`)
	.then(r=>r.json())
	.then(d => dispatch(loadBoards(d)))
	.catch(console.error)
};
export const thunkFetchUserBoards = (uId) => dispatch => {
	csrfFetch(`/api/users/${uId}?include=boards`)
	.then(r=>r.json())
	.then(d => dispatch(loadBoards(d.Boards)))
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
export const thunkEditBoard = (boardId, body, done) => dispatch => {
	csrfFetch('/api/boards/'+boardId, {
		method: 'PATCH',
		body: JSON.stringify(body)
	})
	.then(r=>r.json())
	.then(d => {
		dispatch(editBoard(d))
		done() // Close Modal
	})
	.catch(console.error)
}
export const thunkDeleteBoard = boardId => dispatch => {
	csrfFetch('/api/boards/'+boardId, { method: 'DELETE' })
	.then(() => dispatch(removeBoard(boardId)))
	.catch(console.error)
}

const pin2Board = (boardId, pinId, done, method, dispatch) => {
	csrfFetch(`/api/boards/${boardId}/pins/${pinId}`, {method})
	.then(r => r.json())
	.then(d => {
		dispatch(receiveBoard(d.board))
		done()
	})
	.catch(console.error)
}
export const thunkAddPin2Board = (boardId, pinId, done) => dispatch => pin2Board(boardId, pinId, done, 'PUT', dispatch)	
export const thunkRemoveBoardPin = (boardId, pinId, done) => dispatch => pin2Board(boardId, pinId, done, 'DELETE', dispatch)


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
		case UPDATE_BOARD: {
			return { ...state, [action.board.id]: {...state[action.board.id], ...action.board} }
		}
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
