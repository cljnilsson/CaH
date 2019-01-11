const mongoose = require('mongoose');
const schemas = require("../schemas/schemas")
require("../mongo")

const blank  = "____";
const name   = "cards";
const schema = mongoose.model(name, schemas.get(name));

class Card {
    constructor(type, text) {
        let card = schema;
        let instance = new card({text: text, type: type});
        instance.save((err) => {
            console.log("saved")
        });
    }
}

class WhiteCard extends Card {
    constructor(text) {
        super("White", text)
    }
}

class BlackCard extends Card {
    constructor(text) {
        super("Black", text);
    }
}

class Lobby {

}

// Resets DB before population
schema.deleteMany({});

// Generate Cards

let cards = [

];

cards.forEach(c => new WhiteCard(c));
new WhiteCard("Justin Bieber");
new WhiteCard("A bald man");
new WhiteCard("Insecure people");
new WhiteCard("The mongols");
new WhiteCard("Secret Agent Smith");
new WhiteCard("No lives matter");
new WhiteCard("Anime is life");
new WhiteCard("Three posters of myself");
new WhiteCard("Santa isn't real");
new WhiteCard("Goku is building a spirit bomb");
new WhiteCard("The tiny Indian nextdoor");
new WhiteCard("Three gay men and their dog");
new WhiteCard("My new book");
new WhiteCard("Dank memes");
new WhiteCard("Keeping it in the family");

// ---------------------------------------------------

new BlackCard(`Yesterday I saw ${blank} but then I realized ${blank}`);
new BlackCard(`Last year, the US sent ${blank} to Vladimir Putin`);
new BlackCard(`Yesterday I saw ${blank} but then I realized ${blank}`);