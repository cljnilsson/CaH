const mongoose = require('mongoose');
const path = require("path");
const schemas = require("./schemas/schemas")

require('dotenv').config({path: path.join(__dirname, '../../.env')});

mongoose.connect(process.env.DB_URL, {
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    useNewUrlParser: true
});

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

class Mongo {
    static async getXCards(num, filter) {
        let cards = mongoose.model("cards", schemas.get("cards"));
        let max = cards.countDocuments(filter);
        let rng = getRandomArbitrary(0, await max - num);
        return cards.find(filter, "text type").skip(rng).limit(num);
    }
    
    static async getXWhiteCards(num) {
        return await Mongo.getXCards(num, {type: "White"});
    }
    
    static async getXBlackCards(num) {
        return await Mongo.getXCards(num, {type: "Black"});
    }

    static async getLobbies() {
        return await mongoose.model("lobbies", schemas.get("lobby")).find({});
    }
}

module.exports = Mongo;