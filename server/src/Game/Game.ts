import Deck from "./Deck";
import Turn from "./Turn";
import Player from "./Player";
import Mongo from "../MongoDB/mongo";

let games : Array<Game> = [];
const PlayerTypes = {
    Judge: "Judge",
    Player: "Player"
};

class Game {
	private _players: Map<string, Player> = new Map();
	private turn : Turn;
	private name: string;
	private deck : Deck;
	private blackCard;
	private judge;

    constructor(name) {
        games[name] 	= this
        this.name 		= name;
        this.turn 		= new Turn(this);
    }

    static async create(name) : Promise<Game> {
        let game = new Game(name);

        game.deck = await Deck.create();
        await game.generateNewBlackCard();

        return game;
    }

    get players() : Array<Player> {
        return Array.from(this._players.values());
    }

    /*set players(value) {
        this._players = new Map(value);
    }*/

    get selections() {
        let all = [];

        this.players.forEach(p => {
            if(p.type !== "Judge") {
                let selection = p.selection;
                selection["owner"] = p.name;
                all.push(selection);
            }
        });

        return all;
    }

    get nextJudge() {
        let arr   = this.players;
        let index = arr.indexOf(this.judge) + 1;
        let next;
        if(index < this.players.length) {
            next = arr[index];
        } else {
            next = arr[0];
        }
        return next;
    }

    set nextJudge(value) {
        value.type = PlayerTypes.Judge;
        this.judge = value;
    }

    async generateNewBlackCard() {
        this.blackCard = await Mongo.getXBlackCards(1);
    }

    endTurn() {
        this.turn 		= new Turn(this);
        this.judge.type = "Player";
        this.nextJudge 	= this.nextJudge;
    }

    async addPlayer(name) {
        let p;

        if(this.judge == undefined) {
            p = await Player.create(name, PlayerTypes.Judge, this.name, this.deck);
            this.judge = p;
        } else {
            p = await Player.create(name, PlayerTypes.Player, this.name, this.deck);
        }

        this._players.set(name, p);
    }

    removePlayer(name) {
        let p = this.getPlayer(name);
        switch(p.type) {
            case PlayerTypes.Judge:
                if(this.players.length > 1) {
                    this.nextJudge = this.nextJudge;
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
	
	static isPlayerInExistingGame(player: string) {
		let check = false;
		for(let g of games) {
			for(let p of g.players) {
				if(p.name === player) {
					check = true;
					console.log(`${player} is already in: ${g.name}`);
				}
			}
		}
		return check;
	}

    remove() {
        Mongo.deleteLobby(this.name);
        delete games[this.name];
        console.log("Lobby is empty, deleteing game reference!");
    }
}

export default Game;