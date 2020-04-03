class Lobby {
    constructor(name, host, max, permanent = false) {
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