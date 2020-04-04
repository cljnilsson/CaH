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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose'), path = require("path"), schemas = require("./schemas/schemas"), bcrypt = require('bcrypt');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });
mongoose.connect(process.env.DB_URL, {
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    useUnifiedTopology: true,
    useNewUrlParser: true
});
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
class Model {
    static get lobbies() {
        return mongoose.model("lobbies", schemas.get("lobby"));
    }
    static get cards() {
        return mongoose.model("cards", schemas.get("cards"));
    }
    static get accounts() {
        return mongoose.model("accounts", schemas.get("account"));
    }
}
class Mongo {
    static getAllWhiteCards() {
        return __awaiter(this, void 0, void 0, function* () {
            let cards = Model.cards;
            let all = yield cards.find({ type: "White" });
            return all;
        });
    }
    static getXCards(num, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            let cards = Model.cards;
            let max = cards.countDocuments(filter);
            let rng = getRandomArbitrary(0, (yield max) - num);
            return cards.find(filter, "text type").skip(rng).limit(num);
        });
    }
    static getXWhiteCards(num) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Mongo.getXCards(num, { type: "White" });
        });
    }
    static getXBlackCards(num) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Mongo.getXCards(num, { type: "Black" });
        });
    }
    static getLobbies() {
        return __awaiter(this, void 0, void 0, function* () {
            let lobbies = yield mongoose.model("lobbies", schemas.get("lobby")).find({});
            let final = [];
            // Cleanup all empty lobbies that are not supposed to be there for testing purposes
            for (let l of lobbies) {
                if (l.current >= 0 || l.permanent === true) {
                    final.push(l);
                    Mongo.deleteLobby(l.name);
                }
            }
            return final;
        });
    }
    static deleteLobby(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let lobbies = Model.lobbies;
            let found = yield lobbies.find({ name: name });
            found = found[0]; // Does not work to put [0] at above line for some reason
            if (found.permanent !== true) {
                lobbies.deleteMany({ name: name }, err => true);
            }
        });
    }
    static modifyCurrentCount(name, num) {
        return __awaiter(this, void 0, void 0, function* () {
            let model = Model.lobbies;
            let data = yield model.findOne({ name: name });
            data.current = parseInt(data.current) + num;
            yield data.save();
            return data;
        });
    }
    static addCurrentCount(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.modifyCurrentCount(name, 1);
        });
    }
    static removeCurrentCount(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.modifyCurrentCount(name, -1);
        });
    }
    static resetRooms() {
        return __awaiter(this, void 0, void 0, function* () {
            let model = Model.lobbies;
            let data = yield model.find({});
            data.forEach(lobby => {
                lobby.current = "0";
                lobby.save();
            });
        });
    }
    static setAvatarToNonDefault(name, ending) {
        return __awaiter(this, void 0, void 0, function* () {
            let model = Model.accounts;
            let data = yield model.findOne({ username: name });
            data.avatar = "avatars/" + name + "_avatar" + ending;
            yield data.save();
            return data;
        });
    }
    static userExist(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let model = Model.accounts;
            let data = yield model.findOne({ username: name });
            return data != null;
        });
    }
    static changeColor(name, color) {
        return __awaiter(this, void 0, void 0, function* () {
            let model = Model.accounts;
            let data = yield model.findOne({ username: name });
            data.color = color;
            yield data.save();
            return data;
        });
    }
    static changePassword(name, newPass) {
        return __awaiter(this, void 0, void 0, function* () {
            let salt = bcrypt.genSaltSync(5);
            let model = Model.accounts;
            let data = yield model.findOne({ username: name });
            newPass = yield bcrypt.hash(newPass, salt);
            data.password = newPass;
            data.salt = salt;
            yield data.save();
            return data;
        });
    }
    static makeAccount(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let salt = bcrypt.genSaltSync(5);
            password = yield bcrypt.hash(password, salt);
            let model = Model.accounts;
            let acc = new model({ username: username, password: password, salt: salt, avatar: "defaultImg.png", color: "paleturquoise" });
            yield acc.save();
            return { avatar: acc.avatar };
        });
    }
    static getUserInfo(username) {
        return __awaiter(this, void 0, void 0, function* () {
            let model = Model.accounts;
            let data = yield model.findOne({ username: username });
            return data;
        });
    }
}
Mongo.resetRooms();
exports.default = Mongo;
//# sourceMappingURL=mongo.js.map