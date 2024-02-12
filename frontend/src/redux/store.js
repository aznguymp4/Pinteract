import {
	legacy_createStore as createStore,
	applyMiddleware,
	compose,
	combineReducers,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import pinsReducer from "./pin";
import usersReducer from "./user";
import boardsReducer from "./board";
import searchReducer from "./search";
import commentsReducer from "./comment";

const rootReducer = combineReducers({
	session: sessionReducer,
	pin: pinsReducer,
	user: usersReducer,
	board: boardsReducer,
	search: searchReducer,
	comment: commentsReducer
});

let enhancer;
if (import.meta.env.MODE === "production") {
	enhancer = applyMiddleware(thunk);
} else {
	const logger = (await import("redux-logger")).default;
	const composeEnhancers =
		window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
	enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
	return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
