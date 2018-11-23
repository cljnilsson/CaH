import {applyMiddleware, combineReducers, createStore} from "redux"
import logger from "redux-logger"
import thunk from "redux-thunk"

const middleware = applyMiddleware(thunk, logger);

const reducer = function(state={state: "Login", users: []}, action) {
	switch(action.type) {
		case "JOIN_LOBBY": {
			state.state = "Lobby"
			return {...state}
		}
		case "CARDS_LOADED": {
			return {...state, waiting: false, cards: action.value}
		}
		case "CARDS_START_LOAD": {
			return {...state, waiting: true}
		}
		case "CONFIRM_SELECTION": {
			console.log("Confirming:");
			console.log(state.selection);
			return state;
		}
		case "CARD_SELECTION_CHANGED": {
			console.log("CURRENT SELECTION: ");
			console.log(action.value);
			return {...state, selection : action.value};
		}
		case "CONFIRM_NAME": {
			state.users.push(action.value);
			state.name = action.value;
			state.state = "LobbyList";
			return {...state};
		}
		default: {
			return state;
		}
	}
}

const reducers = combineReducers({
	general: reducer
});

export default createStore(reducers, middleware);