const Mongo = require("../MongoDB/mongo");

let players = new Map();

class Player {
    constructor(name, type, game) {
        this.name = name;
        this.type = type;
        this.game = game;
        this.points = 0;
        this._hand = new Map();
        this.cards = []; // Specially made for React Client since socket.io cannot transport Map and hand getters does not get included
        players.set(name, this);
    }

    static async create(name, type, game) {
        let p = new Player(name, type, game);

        await p.getUserInfo();
        await p.generateHand();

        return p;
    }

    async getUserInfo() {
        let user = await Mongo.getUserInfo(this.name);
        if(user) {
            this.avatar = user.avatar;
            this.color = user.color;
        }
    }

    async generateHand() {
        this._hand.set(0, await Mongo.getXWhiteCards(4));
        this.cards = this.hand;
    }

    // Converts map to array before returning
    get hand() {
        return Array.from(this._hand.values())[0];
    }

    async draw(num=1) {
        let drawn = await Mongo.getXWhiteCards(num);
        this._hand.set(0, this.hand.concat(drawn));
        this.cards = this.hand;
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

module.exports = Player;