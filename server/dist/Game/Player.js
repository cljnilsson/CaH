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
const mongo_1 = __importDefault(require("../MongoDB/mongo"));
let players = new Map();
class Player {
    constructor(name, type, game, deck) {
        this.points = 0;
        this._hand = new Map();
        this.cards = []; // Specially made for React Client since socket.io cannot transport Map and hand getters does not get included
        this.name = name;
        this.type = type;
        this.game = game;
        this.deck = deck;
        players.set(name, this);
    }
    static create(name, type, game, deck) {
        return __awaiter(this, void 0, void 0, function* () {
            let p = new Player(name, type, game, deck);
            yield p.getUserInfo();
            yield p.generateHand();
            return p;
        });
    }
    getUserInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield mongo_1.default.getUserInfo(this.name);
            if (user) {
                this.avatar = user.avatar;
                this.color = user.color;
            }
        });
    }
    generateHand() {
        return __awaiter(this, void 0, void 0, function* () {
            let cards = yield yield this.deck.drawX(4);
            this._hand.set(0, cards);
            this.cards = this.hand;
        });
    }
    // Converts map to array before returning
    get hand() {
        return Array.from(this._hand.values())[0];
    }
    draw(num = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            let drawn = this.deck.drawX(num);
            this._hand.set(0, this.hand.concat(drawn));
            this.cards = this.hand;
        });
    }
    removeCard(text) {
        let current = this.hand;
        let updated = current.filter((value) => value.text != text);
        console.log("REMOVING: " + text);
        this._hand.set(0, updated);
        this.cards = this.hand;
    }
    static getByPlayerName(name) {
        return players.get(name);
    }
}
exports.default = Player;
//# sourceMappingURL=Player.js.map