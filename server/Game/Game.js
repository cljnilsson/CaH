const
    Mongo = require("../MongoDB/mongo"),
    Turn = require("./Turn"),
    Player = require("./Player");

let games = []
const PlayerTypes = {
    Judge: "Judge",
    Player: "Player"
};

class Game {
    constructor(name) {
        games[name] = this
        this.generateNewBlackCard();
        this.name = name;
        this._players = new Map();
        this.turn = new Turn(this);
    }

    get players() {
        return Array.from(this._players.values());
    }

    get selections() {
        let all = [];

        this.players.forEach(p => {
            if(p.type !== "Judge") {
                all.push(p.selection);
            }
        });

        return all;
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

    remove() {
        delete games[this.name];
        console.log("Lobby is empty, deleteing game reference!");
    }
}

module.exports = Game;