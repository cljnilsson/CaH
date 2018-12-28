const Mongo = require("../MongoDB/mongo");

class Player {
    constructor(name, type) {
        this.name = name;
        this.type = type;
        this._hand = new Map();
        this.cards = []; // Specially made for React Client since socket.io cannot transports Map and hand getters does not get included

        this.generateHand();
    }

    async generateHand() {
        this._hand.set(0, await Mongo.getXWhiteCards(4));
        this.cards = this.hand;
    }

    // Converts map to array before returning
    get hand() {
        return Array.from(this._hand.values())[0];
    }
    /*
        To be implemented
    */

    async draw(num=1) {
        let drawn = await Mongo.getXWhiteCards(num);
        this._hand.set(0, this.hand.concat(drawn));
        this.cards = this.hand;
    }

    removeCard(text) {
        let current = this.hand;
        let updated = current.filter((value) => value.text != text);
        console.log("REMOVING: " + text);
        console.log(this.hand);
        this._hand.set(0, updated);
        this.cards = this.hand;
    }
}

module.exports = Player;