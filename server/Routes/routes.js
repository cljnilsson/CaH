const mongoose = require('mongoose');
const Mongo    = require("../MongoDB/mongo")
const app = require("../server.js").a;
const Game = require("../Game/Game");
const schemas = require("../MongoDB/schemas/schemas");
const io  = require("../io"); //required


app.get("/", (req, res) => {
    res.sendfile("./public/index.html")
})

app.get("/:game/:player/cards", async function(req, res) {
    let name = req.params.game;
    let game = Game.getByName(name);
    let pname = req.params.player;
    let player = game.getPlayer(pname);
    
    let whiteCards = player.hand;
    let blackCards = game.blackCard;

    res.send(JSON.stringify({
        blackCards: blackCards,
        whiteCards: whiteCards
    }));
})

// ---------------------

class Lobby {
    constructor(name, host, max, permanent = false) {
        this.name = name;
        this.host = host;
        this.max = max;
        this.permanent = permanent;
        this.make();
    }
    async make() {
        let Schema = mongoose.model("Lobbies", schemas.get("lobby"));
        await new Schema({
            max: this.max,
            host: this.host,
            name: this.name,
            permanent: this.permanent,
            current: 1
        }).save();
        io.emit("newLobby",{all: await Mongo.getLobbies()})
    }
}

app.get("/lobby", async function(req, res) {
    let lobbies = await Mongo.getLobbies();
    res.send(JSON.stringify({
        lobbies: lobbies
    }));
});

app.post("/lobby", async function(req, res) {
    let check = req.body.name && req.body.host && req.body.max;
    console.log(check);
    console.log(req.body);
    if(check) {
        console.log("doing it");
        new Lobby(req.body.name, req.body.host, req.body.max);
    }
    res.sendStatus(check ? 200 : 400);
});