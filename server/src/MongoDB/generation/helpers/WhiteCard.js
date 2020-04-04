const Card = require("./Card");

class WhiteCard extends Card {
    constructor(text) {
        super("White", text)
    }
}

module.exports = WhiteCard;