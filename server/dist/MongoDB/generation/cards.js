var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const mongoose = require('mongoose'), schemas = require("../schemas/schemas"), data = require("./helpers/cardData"), BlackCard = require("./helpers/BlackCard"), WhiteCard = require("./helpers/WhiteCard");
require("../mongo");
const name = "cards";
const schema = mongoose.model(name, schemas.get(name));
let whiteCards = data.whiteCards;
let blackCards = data.blackCards;
// Resets DB before population
function reset() {
    return __awaiter(this, void 0, void 0, function* () {
        yield schema.deleteMany({});
        console.log("DB is reset");
        return true;
    });
}
// Generate Cards
function generateCards() {
    console.log("Saving Cards:");
    whiteCards.forEach(c => new WhiteCard(c));
    blackCards.forEach(c => new BlackCard(c));
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield reset();
        generateCards();
    });
}
main();
//# sourceMappingURL=cards.js.map