const mongoose = require('mongoose');
const app = require("../server.js").a;
const io  = require("../io");
const schemas = require("../MongoDB/schemas/schemas")

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

async function getXCards(num, filter) {
    let cards = mongoose.model("cards", schemas.get("cards"));
    let max = cards.countDocuments(filter);
    let rng = getRandomArbitrary(0, await max - num);
    console.log(rng);
    let found = cards.find(filter, "text type").skip(rng).limit(num);
    return found;
}

async function getXWhiteCards(num) {
    return await getXCards(num, {type: "White"});
}

async function getXBlackCards(num) {
    return await getXCards(num, {type: "Black"});
}

app.get("/", (req, res) => {
    res.sendfile("./public/index.html")
})

app.get("/cards", async function(req, res) {
    let whiteCards = await getXWhiteCards(4)
    let blackCards = await getXBlackCards(1)
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
    let lobbies = mongoose.model("lobbies", schemas.get("lobby"));
    return await lobbies.find({});
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