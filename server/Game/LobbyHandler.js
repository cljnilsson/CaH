// Making this file to prevent duplicate code, might rename it later.abs

const
    io 				= require("../server").io,
    Mongo 			= require("../MongoDB/mongo.js"),
    Guest 			= require("../guests"),
	Player 			= require("../Game/Player"),
    Game 			= require("../Game/Game");

let users = new Map();

class LobbyHandler {
	static async onDisconnect() {
		let user = users.get(this.id);
		if(user != undefined) {
			let p = Player.getByPlayerName(user);
			let game = Game.getByName(p.game);
			if(game != undefined) {
				await Mongo.removeCurrentCount(game.name);
				game.removePlayer(user);
				users.delete(user);
		
				if(game.players.length === 0) {
					game.remove();
				}
		
				io.emit("newLobby", {all: await Mongo.getLobbies()}); // Updates all lobbies to keep player count updated for all users
				io.emit("userLeft", {destination: game.name, user: user, all: game.players});
			} else {
				console.log("The disconnected player was not in a lobby")
			}
		}
	
		if(Guest.all.has(this.id)) {
			user = Guest.all.get(this.id);
			Guest.all.delete(user);
			Guest.all.delete(this.id);
		}
	}
	
	static async onJoin(test) {
		let ingame = Game.isPlayerInExistingGame(test.user);
		if(!ingame) {
			console.log(`${test.user} joined ${test.lobby}`);
	
			await Mongo.addCurrentCount(test.lobby);
		
			let game = Game.getByName(test.lobby);
			if(game === undefined) {
				game = await Game.create(test.lobby);
			}
		
			await game.addPlayer(test.user);
		
			test.all = game.players;
			io.emit("newLobby", {all: await Mongo.getLobbies()}); // Updates all lobbies to keep player count updated for all users
			io.emit("userJoin", test);
		
			users.set(this.id, test.user);
		}
		return !ingame; //Returns true if player may join the game
	}
}

module.exports = LobbyHandler;