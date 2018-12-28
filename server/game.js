const Mongo = require("./MongoDB/mongo");

let games = []
const PlayerTypes = {
    Judge: "Judge",
    Player: "Player"
};

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

class Game {
    constructor(name) {
        games[name] = this
        this.generateNewBlackCard();
        this.name = name;
        this._players = new Map();
    }

    get players() {
        return Array.from(this._players.values());
    }

    async generateNewBlackCard() {
        this.blackCard = await Mongo.getXBlackCards(1);
    }

    addPlayer(name) {
        let p;

        if(this.judge == undefined) {
            p = new Player(name, PlayerTypes.Judge);
            this.judge = p;
        } else {
            p = new Player(name, PlayerTypes.Player);
        }

        this._players.set(name, p);
    }

    removePlayer(name) {
        let p = this.getPlayer(name);
        switch(p.type) {
            case PlayerTypes.Judge:
                if(this._players.size > 1) {
                    let arr = this.players;
                    let index = arr.indexOf(p);

                    let next = arr[index + 1];

                    next.type = PlayerTypes.Judge;
                    this.judge = next;
                    console.log(this.judge);
                } else {
                    this.judge = undefined;
                }
                break;
            case PlayerTypes.Player:
                break;
        }
        this._players.delete(name);
    }

    getPlayer(name) {
        return this._players.get(name);
    }

    static getByName(name) {
        return games[name];
    }
}

module.exports = Game;