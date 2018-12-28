class Turn {
    constructor(game) {
        this.game = game;
        this.judged = false; // Judge has not chosen
        this.usersSubmitted = false; // All users have selected cards
        this.finishedPlayers = new Map();
    }

    get players() {
        return this.game.players.filter(p => p.type === "Player");
    }

    get done() {
        return this.usersSubmitted === true && this.judged === true;
    }

    hasPlayerSubmitted(p) {
        return this.finishedPlayers.get(p.name) === true;
    }

    hasAllPlayersSubmitted() {
        let check = true;

        this.players.forEach(p => {
            if(this.hasPlayerSubmitted(p) === false) {
                check = false;
            }
        });

        return check;
    }

    playerSubmit(p) {

        console.log(p.name + " submitted!");
        this.finishedPlayers.set(p.name, true);
        if(this.hasAllPlayersSubmitted()) {
            this.usersSubmitted = true;
            console.log("All users have submitted their cards!")
        }
    }
}

module.exports = Turn;