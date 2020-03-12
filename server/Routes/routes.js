const
    mongoose = require('mongoose'),
    Mongo    = require("../MongoDB/mongo"),
    app = require("../server.js").a,
    Game = require("../Game/Game"),
    schemas = require("../MongoDB/schemas/schemas"),
    bcrypt = require("bcrypt"),
    Guest = require("../guests"),
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
    let data  = {};
    if(dbInfo != null) {
        let encrypted = await bcrypt.hash(req.body.password, dbInfo.salt);

        correct = req.body.username === dbInfo.username && encrypted === dbInfo.password;
    
        if(correct === false) {
            error = "Wrong Password";
        } else {
            data = {error: error, avatar: dbInfo.avatar, color: dbInfo.color};
        }
    } else {
        correct = false;
        error = "Wrong username";
    }

    res.status(correct ? 200 : 300).send(JSON.stringify(data));
});

app.post("/:user/changeColor", async function(req, res) {
	// Should check if body exists
	console.log(`${req.params.user} is trying to change his color to ${req.body.color}`);
    //await Mongo.getUserInfo(req.body.username);
	io.emit("changeColor",{user: req.params.user, color: req.body.color});
    res.sendStatus(200);
});

app.post("/cookielogin", async function(req, res) {
    let correct = true; 
    let dbInfo = await Mongo.getUserInfo(req.body.username);
    let data = {};
    if(dbInfo != null) {
        data = {avatar: dbInfo.avatar, color: dbInfo.color};
    } else {
        correct = false;
    }

    res.status(correct ? 200 : 300).send(JSON.stringify({data}));
});

async function doesUserExist(user) {
    let info = await Mongo.getUserInfo(user);
    return info != null;
}

function doesGuestExist(user) {
    return Guest.all.get(user) === true;
}

app.post("/checkName", async function(req, res) {
    let userExist = await doesUserExist(req.body.username);
    let guestExist = doesGuestExist(req.body.username);
    let exist = userExist || guestExist;

    console.log(Guest.all);
    console.log(exist);
    if(exist === false) {
        new Guest(req.body.username).attachSocket(req.body.socket); // Also saves by socket.io id for 'primary key' which can be used for connecting socket to username in onDisconnect event
    }
    res.sendStatus(exist === false ? 200 : 300);
});