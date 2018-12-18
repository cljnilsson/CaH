let games = []
class Game {
    constructor(name) {
        games[name] = this
        this.name = name;
        this.players = []
    }

    addPlayer(name) {
        this.players.push(name);
    }

    removePlayer(name) {
        this.players = this.players.filter(p => p != name);
        console.log(this.players);
    }
}

module.exports.Game = Game;
module.exports.games = games;