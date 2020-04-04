"use strict";
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
const Deck_1 = __importDefault(require("./Deck"));
const Turn_1 = __importDefault(require("./Turn"));
const Player_1 = __importDefault(require("./Player"));
const mongo_1 = __importDefault(require("../MongoDB/mongo"));
let games = [];
const PlayerTypes = {
    Judge: "Judge",
    Player: "Player"
};
class Game {
    constructor(name) {
        this._players = new Map();
        games[name] = this;
        this.name = name;
        this.turn = new Turn_1.default(this);
    }
    static create(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let game = new Game(name);
            game.deck = yield Deck_1.default.create();
            yield game.generateNewBlackCard();
            return game;
        });
    }
    get players() {
        return Array.from(this._players.values());
    }
    /*set players(value) {
        this._players = new Map(value);
    }*/
    get selections() {
        let all = [];
        this.players.forEach(p => {
            if (p.type !== "Judge") {
                let selection = p.selection;
                selection["owner"] = p.name;
                all.push(selection);
            }
        });
        return all;
    }
    get nextJudge() {
        let arr = this.players;
        let index = arr.indexOf(this.judge) + 1;
        let next;
        if (index < this.players.length) {
            next = arr[index];
        }
        else {
            next = arr[0];
        }
        return next;
    }
    set nextJudge(value) {
        value.type = PlayerTypes.Judge;
        this.judge = value;
    }
    generateNewBlackCard() {
        return __awaiter(this, void 0, void 0, function* () {
            this.blackCard = yield mongo_1.default.getXBlackCards(1);
        });
    }
    endTurn() {
        this.turn = new Turn_1.default(this);
        this.judge.type = "Player";
        this.nextJudge = this.nextJudge;
    }
    addPlayer(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let p;
            if (this.judge == undefined) {
                p = yield Player_1.default.create(name, PlayerTypes.Judge, this.name, this.deck);
                this.judge = p;
            }
            else {
                p = yield Player_1.default.create(name, PlayerTypes.Player, this.name, this.deck);
            }
            this._players.set(name, p);
        });
    }
    removePlayer(name) {
        let p = this.getPlayer(name);
        switch (p.type) {
            case PlayerTypes.Judge:
                if (this.players.length > 1) {
                    this.nextJudge = this.nextJudge;
                }
                else {
                    this.judge = undefined;
                }
                break;
            case PlayerTypes.Player:
                break;
        }
        this._players.delete(name);
    }
    getPlayer(name) {
        return this._players.get(name);
    }
    static getByName(name) {
        return games[name];
    }
    static isPlayerInExistingGame(player) {
        let check = false;
        for (let g of games) {
            for (let p of g.players) {
                if (p.name === player) {
                    check = true;
                    console.log(`${player} is already in: ${g.name}`);
                }
            }
        }
        return check;
    }
    remove() {
        mongo_1.default.deleteLobby(this.name);
        delete games[this.name];
        console.log("Lobby is empty, deleteing game reference!");
    }
}
exports.default = Game;
//# sourceMappingURL=Game.js.map