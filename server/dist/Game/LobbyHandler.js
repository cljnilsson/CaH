"use strict";
// Making this file to prevent duplicate code, might rename it later.abs
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const io = require("../server").io;
const guests_1 = __importDefault(require("../guests"));
const mongo_1 = __importDefault(require("../MongoDB/mongo"));
const Game_1 = __importDefault(require("./Game"));
const Player_1 = __importDefault(require("./Player"));
let users = new Map();
class LobbyHandler {
    static onDisconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            let user = users.get(this.id);
            if (user != undefined) {
                let p = Player_1.default.getByPlayerName(user);
                let game = Game_1.default.getByName(p.game);
                if (game != undefined) {
                    yield mongo_1.default.removeCurrentCount(game.name);
                    game.removePlayer(user);
                    users.delete(user);
                    if (game.players.length === 0) {
                        game.remove();
                    }
                    io.emit("newLobby", { all: yield mongo_1.default.getLobbies() }); // Updates all lobbies to keep player count updated for all users
                    io.emit("userLeft", { destination: game.name, user: user, all: game.players });
                }
                else {
                    console.log("The disconnected player was not in a lobby");
                }
            }
            if (guests_1.default.all.has(this.id)) {
                user = guests_1.default.all.get(this.id);
                guests_1.default.all.delete(user);
                guests_1.default.all.delete(this.id);
            }
        });
    }
    static onJoin(test) {
        return __awaiter(this, void 0, void 0, function* () {
            let ingame = Game_1.default.isPlayerInExistingGame(test.user);
            if (!ingame) {
                console.log(`${test.user} joined ${test.lobby}`);
                yield mongo_1.default.addCurrentCount(test.lobby);
                let game = Game_1.default.getByName(test.lobby);
                if (game === undefined) {
                    game = yield Game_1.default.create(test.lobby);
                }
                yield game.addPlayer(test.user);
                test.all = game.players;
                io.emit("newLobby", { all: yield mongo_1.default.getLobbies() }); // Updates all lobbies to keep player count updated for all users
                io.emit("userJoin", test);
                users.set(this.id, test.user);
            }
            return !ingame; //Returns true if player may join the game
        });
    }
}
module.exports = LobbyHandler;
//# sourceMappingURL=LobbyHandler.js.map