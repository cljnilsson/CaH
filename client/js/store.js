import {applyMiddleware, combineReducers, createStore} from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import socket from "./Libs/io"

const middleware = applyMiddleware(thunk, logger);

const GameState = {
	Lobby: "Lobby",
	Login: "Login",
	LobbyList: "LobbyList",
	Game: "Game",
	GameOver: "GameOver"
};

const turn = {
	Players: "Players",
	Judge: "Judge"
}

let user = Math.random().toString(36).substring(9);

const standard = {waiting: true, lobbies: [], turn: turn.Players, submitted: false, state: GameState.Login, selection: [], users: []};
const lobby    = {waiting: true, lobbies: [], turn: turn.Players, submitted: false, name: user, state: GameState.LobbyList, selection: [], users: []};

const settings = {
	standard: standard,
	lobby: lobby
}

/*
	NOTE TO SELF, SPREAD OPERATOR FORCE UPDATE, RETURNING state DOES NOT!
*/

const reducer = function(state=settings.standard, action) {
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
		case "END_TURN": {
			socket.emit("endTurn", {game: state.currentGame, selection: state.judgeSelected});
			return {...state};
		}
		case "GAME_OVER": {
			state.state = GameState.GameOver;
			state.winner = action.value;
			return {...state};
		}
		case "NEW_MESSAGE": {
			state.messages[state.currentGame] = action.value;
			return {...state};
		}
		case "NEW_TURN": {
			state.users     = action.value.users;
			state.judge     = state.users.filter(u => u.type === "Judge")[0];
			state.players   = state.users.filter(u => u.type !== "Judge");
			state.me        = state.users.filter(u => u.name === state.me.name)[0];
			state.submitted = false;
			state.turn      = turn.Players;
			state.messages[state.currentGame].push({text: `${action.value.winner} won the round!`});
			state.selection = [];
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
			state.users   = action.value;
			state.judge   = state.users.filter(u => u.type === "Judge")[0];
			state.players = state.users.filter(u => u.type !== "Judge");
			return {...state};
		}
		case "JOIN_LOBBY": {
			state.state = GameState.Lobby;
			state.currentGame = action.value;
			state.messages = [];
			state.messages[state.currentGame] = [];
			socket.emit("joinedLobby", {user: state.name, lobby: action.value});
			return {...state};
		}
		case "UPDATE_LOBBY": {
			state.lobbies = action.value;
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
		case "TO_INDEX": {
			state.state = GameState.Login;
			return {...state};
		}
		case "CHANGE_COLOR": {
			state.color = action.value;
			return {...state};
		}
		case "LOGOUT": {
			delete state.name;
			delete state.avatar;
			delete state.color;

			state.state = GameState.Login;
			return {...state}
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