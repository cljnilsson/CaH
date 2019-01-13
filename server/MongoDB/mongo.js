const
    mongoose = require('mongoose'),
    path = require("path"),
    schemas = require("./schemas/schemas"),
    bcrypt = require('bcrypt');

require('dotenv').config({path: path.join(__dirname, '../../.env')});

mongoose.connect(process.env.DB_URL, {
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    useNewUrlParser: true
});

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

class Model {
    static get lobbies() {
        return mongoose.model("lobbies", schemas.get("lobby"));
    }

    static get cards() {
        return mongoose.model("cards", schemas.get("cards"));
    }

    static get accounts() {
        return mongoose.model("accounts", schemas.get("account"));
    }
}

class Mongo {
    static async getXCards(num, filter) {
        let cards = Model.cards;
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

    static async deleteLobby(name) {
        let lobbies = Model.lobbies;
        let found = await lobbies.find({name: name});
        found = found[0]; // Does not work to put [0] at above line for some reason
        if(found.permanent !== true) {
            lobbies.deleteMany({name: name}, err => true);
        }
    }

    static async modifyCurrentCount(name, num) {
        let model = Model.lobbies;
        let data = await model.findOne({name: name});
        data.current = parseInt(data.current) + num;
        await data.save();
        return data;
    }

    static async addCurrentCount(name) {
        return await this.modifyCurrentCount(name, 1);
    }

    static async removeCurrentCount(name) {
        return await this.modifyCurrentCount(name, -1);
    }

    static async resetRooms() {
        let model = Model.lobbies;
        let data = await model.find({});
        data.forEach(lobby => {
            lobby.current = "0";
            lobby.save();
        });

    }

    static async makeAccount(username, password) {
        let salt = bcrypt.genSaltSync(5);
        password = await bcrypt.hash(password, salt);
        let model = Model.accounts;

        let acc = new model({username: username, password: password, salt: salt, avatar: "defaultImg.png"});
        await acc.save();
        return {avatar: acc.avatar};
    }

    static async getUserInfo(username) {
        let model = Model.accounts;
        let data = await model.findOne({username: username});
        return data;
    }
}

Mongo.resetRooms();

module.exports = Mongo;