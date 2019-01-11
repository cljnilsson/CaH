const
    mongoose  = require('mongoose'),
    schemas   = require("../schemas/schemas"),
    data      = require("./helpers/cardData"),
    BlackCard = require("./helpers/BlackCard"),
    WhiteCard = require("./helpers/WhiteCard");
    require("../mongo");

const name   = "cards";
const schema = mongoose.model(name, schemas.get(name));

let whiteCards = data.whiteCards;
let blackCards = data.blackCards;

// Resets DB before population
async function reset() {
    await schema.deleteMany({});
    console.log("DB is reset");
    return true;
}

// Generate Cards
function generateCards() {
    console.log("Saving Cards:");    
    whiteCards.forEach(c => new WhiteCard(c));
    blackCards.forEach(c => new BlackCard(c));
}

async function main() {
    await reset();
    generateCards();
}

main();