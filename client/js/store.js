import {applyMiddleware, combineReducers, createStore} from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import socket from "./Libs/io"

const middleware = applyMiddleware(thunk, logger);

const GameState = {
	Lobby: "Lobby",
	Login: "Login",
	LobbyList: "LobbyList",
	Game: "Game"
};

const turn = {
	Players: "Players",
	Judge: "Judge"
}

let user = Math.random().toString(36).substring(9);

const standard = {waiting: true, turn: turn.Players, submitted: false, state: GameState.Login, selection: [], users: []};
const lobby    = {waiting: true, turn: turn.Players, submitted: false, name: user, state: GameState.LobbyList, selection: [], users: []};

const settings = {
	standard: standard,
	lobby: lobby
}

/*
	NOTE TO SELF, SPREAD OPERATOR FORCE UPDATE, RETURNING state DOES NOT!
*/

const reducer = function(state=settings.lobby, action) {
	switch(action.type) {
		case "START_GAME_CLICK": {
			socket.emit("startGame", {destination: state.currentGame});
			return state;
		}
		case "START_GAME": {
			state.me = action.value.filter(function(value) {
				return value.name == state.name;
			})[0];
			return {...state, state: GameState.Game, users: action.value};
		}
		case "SEND_MESSAGE": {
			socket.emit("chatMessage", {text: action.value, name: state.name, destination: state.currentGame});
			return state;
		}
		case "JUDGE_CONFIRM": {
			socket.emit("endTurn", state.judgeSelected);
			return {...state};
		}
		case "UPDATE_TURN": {
			if(action.value === "Judge") {
				state.turn = turn.Judge;
			} else {
				state.turn = turn.Players;
			}
			return {...state};
		}
		case "UPDATE_CARDS": {
			state.users = action.value;

			let c = action.value.filter((value) => value.name === state.me.name)[0].cards
			state.cards.whiteCards = c;
			return {...state};
		}
		case "UPDATE_USERS": {
			state.me = action.value.filter(function(value) {
				return value.name == state.name;
			})[0];
			state.users = action.value;
			state.judge = state.users.filter(u => u.type === "Judge")[0];
			state.players = state.users.filter(u => u.type !== "Judge");
			return {...state};
		}
		case "JOIN_LOBBY": {
			state.state = GameState.Lobby;
			state.currentGame = action.value;
			socket.emit("joinedLobby", {user: state.name, lobby: action.value});
			return {...state};
		}
		case "CARDS_LOADED": {
			return {...state, waiting: false, cards: action.value};
		}
		case "CONFIRM_SELECTION": {
			console.log(`${state.me.name} selected ${state.selection[0].props.text} ${state.selection[1] ? state.selection[1].props.text : ""}`);
			let props = [];
			state.selection.forEach(element => {
				props.push(element.props.text);
			});
			socket.emit("usedCards", {cards: props, game: state.currentGame, user: state.me.name});
			state.selection = [];
			state.submitted = true;
			return {...state};
		}
		case "CARD_SELECTION_CHANGED": {
			return {...state};
		}
		case "CONFIRM_NAME": {
			state.name = action.value;
			state.state = GameState.LobbyList;
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