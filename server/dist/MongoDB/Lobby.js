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
const io_1 = __importDefault(require("../io"));
const mongo_1 = __importDefault(require("../MongoDB/mongo"));
const mongoose_1 = __importDefault(require("mongoose"));
const schemas_1 = __importDefault(require("../MongoDB/schemas/schemas"));
class Lobby {
    constructor(name, host, max, permanent = false) {
        this.name = name;
        this.host = host;
        this.max = max;
        this.permanent = permanent;
    }
    make() {
        return __awaiter(this, void 0, void 0, function* () {
            let Schema = mongoose_1.default.model("Lobbies", schemas_1.default.get("lobby"));
            let s = yield new Schema({
                max: this.max,
                host: this.host,
                name: this.name,
                permanent: this.permanent,
                current: 0
            }).save();
            io_1.default.emit("newLobby", { all: yield mongo_1.default.getLobbies() });
            return s;
        });
    }
}
module.exports = Lobby;
//# sourceMappingURL=Lobby.js.map