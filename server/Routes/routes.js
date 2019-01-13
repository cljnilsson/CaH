const
    mongoose = require('mongoose'),
    Mongo    = require("../MongoDB/mongo"),
    app = require("../server.js").a,
    Game = require("../Game/Game"),
    schemas = require("../MongoDB/schemas/schemas"),
    bcrypt = require("bcrypt"),
    io  = require("../io"); //required


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
    }
    async make() {
        let Schema = mongoose.model("Lobbies", schemas.get("lobby"));
        let s = await new Schema({
            max: this.max,
            host: this.host,
            name: this.name,
            permanent: this.permanent,
            current: 0
        }).save();
        io.emit("newLobby",{all: await Mongo.getLobbies()});
        return s;
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
    if(check) {
        await new Lobby(req.body.name, req.body.host, req.body.max).make();
    }
    res.sendStatus(check ? 200 : 400);
});

app.post("/register", async function(req, res) {
    let check = req.body.username && req.body.password;
    if(check) {
        await Mongo.makeAccount(req.body.username, req.body.password);
    }
    res.sendStatus(check ? 200 : 400);
});

app.post("/login", async function(req, res) {
    let correct = true; 
    let dbInfo = await Mongo.getUserInfo(req.body.username);
    let error = "";
    if(dbInfo != null) {
        let encrypted = await bcrypt.hash(req.body.password, dbInfo.salt);

        correct = req.body.username === dbInfo.username && encrypted === dbInfo.password;
    
        if(correct === false) {
            error = "Wrong Password";
        }
    } else {
        correct = false;
        error = "Wrong username";
    }

    res.status(correct ? 200 : 300).send(JSON.stringify({error: error, avatar: dbInfo.avatar}));
});