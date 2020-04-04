"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app = require("../server.js").a, Game = require("../Game/Game"), Lobby = require("../MongoDB/Lobby"), LobbyHandler = require("../Game/LobbyHandler"), Player = require("../Game/Player"), bcrypt = require("bcrypt"), fs = require("fs"), multer = require('multer'), io = require("../io"); //required
const mongo_1 = __importDefault(require("../MongoDB/mongo"));
const guests_1 = __importDefault(require("../guests"));
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/avatars');
    },
    filename: function (req, file, cb) {
        let name = file.originalname;
        cb(null, req.params.user + "_avatar" + name.substring(name.length - 4, name.length)); //lazy solution should look for the last . in string and use that for first index.
    }
});
let upload = multer({ storage: storage });
app.get("/", (req, res) => {
    res.sendfile("./public/index.html");
});
app.get("/:game/:player/cards", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let name = req.params.game;
        let pname = req.params.player;
        let game = Game.getByName(name);
        let player = game.getPlayer(pname);
        let whiteCards = player.hand;
        let blackCards = game.blackCard;
        res.send(JSON.stringify({
            blackCards: blackCards,
            whiteCards: whiteCards
        }));
    });
});
// ---------------------
app.get("/lobby", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let lobbies = yield mongo_1.default.getLobbies();
        res.send(JSON.stringify({
            lobbies: lobbies
        }));
    });
});
app.post("/lobby", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let check = req.body.name && req.body.host && req.body.max;
        if (check) {
            yield new Lobby(req.body.name, req.body.host, req.body.max).make();
        }
        res.sendStatus(check ? 200 : 400);
    });
});
app.post("/register", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Check if passwords match as well in the future
        let check = req.body.username && req.body.password;
        let toSend = {};
        if (check) {
            if ((yield mongo_1.default.userExist(req.body.username)) === false) {
                mongo_1.default.makeAccount(req.body.username, req.body.password);
            }
            else {
                toSend.error = "Account name is taken";
            }
        }
        res.sendStatus(check ? 200 : 400);
    });
});
app.post("/login", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let correct = true;
        let dbInfo = yield mongo_1.default.getUserInfo(req.body.username);
        let error = "";
        let data = {};
        if (dbInfo != null) {
            let encrypted = yield bcrypt.hash(req.body.password, dbInfo.salt);
            correct = req.body.username === dbInfo.username && encrypted === dbInfo.password;
            if (correct === false) {
                error = "Wrong Password";
            }
            else {
                data = { avatar: dbInfo.avatar, color: dbInfo.color };
            }
        }
        else {
            correct = false;
            error = "Wrong username";
        }
        res.status(correct ? 200 : 300).send(JSON.stringify(Object.assign(Object.assign({}, data), { error: error })));
    });
});
app.post("/:user/joinGame", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Should check if body exists
        console.log(`${req.params.user} is trying to join ${req.body.lobby}!`);
        let check = yield LobbyHandler.onJoin(req.body);
        res.sendStatus(check ? 200 : 300);
    });
});
app.post("/:user/leaveGame", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Should check if body exists
        console.log(`${req.params.user} might have left a game!`);
        // Copied code from io.js as I don't want to make a seperate file with one function
        LobbyHandler.onDisconnect();
        res.sendStatus(200);
    });
});
app.post("/:user/changeColor", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Should check if body exists
        console.log(`${req.params.user} is trying to change his color to ${req.body.color}`);
        yield mongo_1.default.changeColor(req.params.user, req.body.color);
        io.emit("changeColor", { user: req.params.user, color: req.body.color });
        res.sendStatus(200);
    });
});
app.post("/:user/changePassword", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Should check if body exists
        console.log(`${req.params.user} is trying to change his password to ${req.body.password}`);
        yield mongo_1.default.changePassword(req.params.user, req.body.password);
        res.sendStatus(200);
    });
});
app.post("/:user/changeAvatar", upload.single("file"), function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let name = req.file.originalname;
        console.log(`${req.params.user} is trying to change his avatar to ${name}`);
        mongo_1.default.setAvatarToNonDefault(req.params.user, name.substring(name.length - 4, name.length)); //assumes that the avatar has been created by Multer
        io.emit("changeAvatar", { user: req.params.user, avatar: req.params.user + "_avatar" + name.substring(name.length - 4, name.length) });
        res.sendStatus(200);
    });
});
app.post("/cookielogin", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let correct = true;
        let dbInfo = yield mongo_1.default.getUserInfo(req.body.username);
        let data = {};
        if (dbInfo != null) {
            data = { avatar: dbInfo.avatar, color: dbInfo.color };
        }
        else {
            correct = false;
        }
        res.status(correct ? 200 : 300).send(JSON.stringify({ data }));
    });
});
function doesUserExist(user) {
    return __awaiter(this, void 0, void 0, function* () {
        let info = yield mongo_1.default.getUserInfo(user);
        return info != null;
    });
}
function doesGuestExist(user) {
    return guests_1.default.all.get(user) === true;
}
app.post("/checkName", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let userExist = yield doesUserExist(req.body.username);
        let guestExist = doesGuestExist(req.body.username);
        let exist = userExist || guestExist;
        if (exist === false) {
            new guests_1.default(req.body.username).attachSocket(req.body.socket); // Also saves by socket.io id for 'primary key' which can be used for connecting socket to username in onDisconnect event
        }
        else {
            // Generate new in the future?
        }
        res.sendStatus(exist === false ? 200 : 300);
    });
});
//# sourceMappingURL=routes.js.map