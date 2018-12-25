const mongoose = require('mongoose');
const Mongo    = require("../MongoDB/mongo")
const app = require("../server.js").a;
const Game = require("../game");
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
    constructor(name, host, max) {
        let Schema = mongoose.model("Lobbies", schemas.get("lobby"));
        new Schema({
            max: max,
            host: host,
            name: name,
            current: 1
        }).save();
    }
}

async function getAllLobbies() {
    return await Mongo.getLobbies();
}

app.get("/lobby", async function(req, res) {
    let lobbies = await getAllLobbies();
    res.send(JSON.stringify({
        lobbies: lobbies
    }));
});

app.post("/lobby", async function(req, res) {
    check = req.body.name && req.body.host && req.body.max;
    console.log(req.body);
    if(check) {
        console.log("doing it");
        new Lobby(req.body.name, req.body.host, req.body.max);
    }
    res.sendStatus(check === true ? 200 : 400);
});