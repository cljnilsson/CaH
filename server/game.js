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

        this.generateHand();
    }

    async generateHand() {
        this._hand.set(0, await Mongo.getXWhiteCards(4));
    }

    // Converts map to array before returning
    get hand() {
        return Array.from(this._hand.values()); //maybe .keys()?
    }
    /*
        To be implemented
    */

    async drawCard() {
        let drawn = await Mongo.getXWhiteCards(1);
        this.hand = this.hand.concat(drawn);
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
        let p;
        this.players.set(name, p);
        if(this.judge == undefined) {
            p = new Player(name, PlayerTypes.Judge);
            this.judge = p;
        } else {
            p = new Player(name, PlayerTypes.Player);
        }

        this.players.set(name, p);
    }

    removePlayer(name) {
        let p = this.getPlayer(name);
        switch(p.type) {
            case PlayerTypes.Judge:
                if(this.players.size > 1) {
                    let arr = Array.from(this.players.values());
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