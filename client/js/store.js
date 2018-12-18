import {applyMiddleware, combineReducers, createStore} from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import socket from "./Libs/io"

const middleware = applyMiddleware(thunk, logger);

const reducer = function(state={state: "Login", users: []}, action) {
	switch(action.type) {
		case "START_GAME_CLICK": {
			socket.emit("startGame", {destination: state.currentGame});
			return state;
		}
		case "START_GAME": {
			return {...state, state: "GAME", users: action.value};
		}
		case "SEND_MESSAGE": {
			socket.emit("chatMessage", {text: action.value, name: state.name, destination: state.currentGame})
			return state;
		}
		case "JOIN_LOBBY": {
			state.state = "Lobby";
			state.currentGame = action.value;
			socket.emit("joinedLobby", {user: state.name, lobby: action.value});
			return {...state};
		}
		case "CARDS_LOADED": {
			return {...state, waiting: false, cards: action.value};
		}
		case "CARDS_START_LOAD": {
			return {...state, waiting: true};
		}
		case "CONFIRM_SELECTION": {
			return state;
		}
		case "CARD_SELECTION_CHANGED": {
			return {...state, selection : action.value};
		}
		case "CONFIRM_NAME": {
			state.name = action.value;
			state.state = "LobbyList";
			return {...state};
		}
		default: {
			return state;
		}
	}
};

const reducers = combineReducers({
	general: reducer
});

export default createStore(reducers, middleware);