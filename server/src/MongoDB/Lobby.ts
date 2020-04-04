import io 		from "../io";
import Mongo 	from "../MongoDB/mongo";
import mongoose from "mongoose";
import schemas 	from "../MongoDB/schemas/schemas";


class Lobby {
	private name : string;
	private host : string;
	private max : number;
	private permanent : boolean;

    constructor(name: string, host: string, max: number, permanent : boolean = false) {
        this.name 		= name;
        this.host 		= host;
        this.max  		= max;
        this.permanent 	= permanent;
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

module.exports = Lobby;