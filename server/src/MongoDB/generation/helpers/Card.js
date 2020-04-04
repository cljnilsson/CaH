const
    mongoose  = require('mongoose'),
    schemas   = require("../../schemas/schemas");

const name   = "cards";
const schema = mongoose.model(name, schemas.get(name));

class Card {
    constructor(type, text) {
        let card = schema;
        let instance = new card({text: text, type: type});
        instance.save((err) => {
            console.log("\tsaved")
        });
    }
}

module.exports = Card;