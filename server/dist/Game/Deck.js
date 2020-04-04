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
/* From https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array */
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
class Deck {
    constructor() {
        this.backup = [];
        this.cards = [];
    }
    getCards() {
        return __awaiter(this, void 0, void 0, function* () {
            this.cards = yield mongo_1.default.getAllWhiteCards();
            this.cards = shuffle(this.cards);
        });
    }
    static create() {
        return __awaiter(this, void 0, void 0, function* () {
            let deck = new Deck();
            yield deck.getCards();
            return deck;
        });
    }
    drawX(num) {
        let arr = [];
        for (let i = 0; i < num; i++) {
            arr.push(this.draw());
        }
        return arr;
    }
    draw() {
        /*
            Draw cards, move drawn card to backup
        */
        let top = this.cards.pop();
        this.backup.push(top);
        if (this.cards.length === 0) {
            console.log("Shuffling deck");
            this.shuffle();
        }
        return top;
    }
    shuffle() {
        /*
            Shuffle backup, then make copy of backup to cards. Make sure to reset backup
        */
        this.backup = shuffle(this.backup);
        this.cards = this.backup.slice(0);
        this.backup = [];
    }
}
exports.default = Deck;
//# sourceMappingURL=Deck.js.map