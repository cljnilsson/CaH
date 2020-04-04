const
	app 			= require("../server.js").a,
	Game 			= require("../Game/Game"),
	Lobby			= require("../MongoDB/Lobby"),
	LobbyHandler 	= require("../Game/LobbyHandler"),
	Player 			= require("../Game/Player"),
    bcrypt 			= require("bcrypt"),
	fs 				= require("fs"),
	multer  		= require('multer'),
	io  			= require("../io"); //required
	
import Mongo from "../MongoDB/mongo";
import Guest from "../guests";


let storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, './public/avatars')
	},
	filename: function (req, file, cb) {
		let name = file.originalname;
		cb(null, req.params.user + "_avatar" + name.substring(name.length - 4, name.length)); //lazy solution should look for the last . in string and use that for first index.
	}
  })
let upload = multer({ storage: storage });

app.get("/", (req, res) => {
    res.sendfile("./public/index.html")
})

app.get("/:game/:player/cards", async function(req, res) {
	let name 	= req.params.game;
	let pname 	= req.params.player;
    let game 	= Game.getByName(name);
    let player 	= game.getPlayer(pname);
    
    let whiteCards = player.hand;
    let blackCards = game.blackCard;

    res.send(JSON.stringify({
        blackCards: blackCards,
        whiteCards: whiteCards
    }));
})

// ---------------------

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
	// Check if passwords match as well in the future
	let check = req.body.username && req.body.password;
	let toSend = {};
    if(check) {
		if(await Mongo.userExist(req.body.username) === false) {
			Mongo.makeAccount(req.body.username, req.body.password);
		} else {
			toSend.error = "Account name is taken";
		}
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
            data = {avatar: dbInfo.avatar, color: dbInfo.color};
        }
    } else {
        correct = false;
        error = "Wrong username";
    }
	
    res.status(correct ? 200 : 300).send(JSON.stringify({...data, error: error}));
});

app.post("/:user/joinGame", async function(req, res) {
	// Should check if body exists
	console.log(`${req.params.user} is trying to join ${req.body.lobby}!`);
	let check = await LobbyHandler.onJoin(req.body);
    res.sendStatus(check ? 200 : 300);
});

app.post("/:user/leaveGame", async function(req, res) {
	// Should check if body exists
	console.log(`${req.params.user} might have left a game!`);
	// Copied code from io.js as I don't want to make a seperate file with one function
	LobbyHandler.onDisconnect();
    res.sendStatus(200);
});

app.post("/:user/changeColor", async function(req, res) {
	// Should check if body exists
	console.log(`${req.params.user} is trying to change his color to ${req.body.color}`);
    await Mongo.changeColor(req.params.user, req.body.color);
	io.emit("changeColor",{user: req.params.user, color: req.body.color});
    res.sendStatus(200);
});

app.post("/:user/changePassword", async function(req, res) {
	// Should check if body exists
	console.log(`${req.params.user} is trying to change his password to ${req.body.password}`);
    await Mongo.changePassword(req.params.user, req.body.password);
    res.sendStatus(200);
});

app.post("/:user/changeAvatar", upload.single("file"),async function(req, res) {
	let name = req.file.originalname;

	console.log(`${req.params.user} is trying to change his avatar to ${name}`);

	Mongo.setAvatarToNonDefault(req.params.user, name.substring(name.length - 4, name.length)); //assumes that the avatar has been created by Multer
	io.emit("changeAvatar", {user: req.params.user, avatar: req.params.user + "_avatar" + name.substring(name.length - 4, name.length)});

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

    if(exist === false) {
        new Guest(req.body.username).attachSocket(req.body.socket); // Also saves by socket.io id for 'primary key' which can be used for connecting socket to username in onDisconnect event
    } else {
		// Generate new in the future?
	}
	
    res.sendStatus(exist === false ? 200 : 300);
});