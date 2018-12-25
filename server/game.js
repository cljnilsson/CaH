const Mongo = require("./MongoDB/mongo");

let games = []

class Player {
    constructor(name) {
        this.generateHand();
        this.name = name;
    }

    async generateHand() {
        this.hand = await Mongo.getXWhiteCards(4);
    }
    /*
        To be implemented
    */

    drawCard() {

    }

    removeCard() {

    }
}

class Game {
    constructor(name) {
        games[name] = this
        this.generateNewBlackCard();
        this.name = name;
        this.players = new Map();
    }

    async generateNewBlackCard() {
        this.blackCard = await Mongo.getXBlackCards(1);
    }

    addPlayer(name) {
        let p = new Player(name);
        this.players.set(name, p);
        console.log(this.players);
    }

    removePlayer(name) {
        //this.players = this.players.filter(p => p.name != name);
        this.players.delete(name);
    }

    getPlayer(name) {
        return this.players.get(name);
    }

    static getByName(name) {
        return games[name];
    }
}

module.exports = Game;