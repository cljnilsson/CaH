const
    mongoose = require('mongoose'),
    path = require("path"),
    schemas = require("./schemas/schemas"),
    bcrypt = require('bcrypt');

require('dotenv').config({path: path.join(__dirname, '../../.env')});

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
    static async getAllWhiteCards() {
        let cards = Model.cards;
        let all = await cards.find({type: "White"});
        return all;
    }

    static async getXCards(num, filter) {
        let cards = Model.cards;
        let max = cards.countDocuments(filter);
        let rng = getRandomArbitrary(0, await max - num);
        return cards.find(filter, "text type").skip(rng).limit(num);
    }
    
    static async getXWhiteCards(num) {
        return await Mongo.getXCards(num, {type: "White"});
    }
    
    static async getXBlackCards(num) {
        return await Mongo.getXCards(num, {type: "Black"});
    }

    static async getLobbies() {
		let lobbies = await mongoose.model("lobbies", schemas.get("lobby")).find({});
		let final = [];

		// Cleanup all empty lobbies that are not supposed to be there for testing purposes
		for(let l of lobbies) {
			if(l.current >= 0 || l.permanent === true) {
				final.push(l)
				Mongo.deleteLobby(l.name)
			}
		}

        return final
    }

    static async deleteLobby(name) {
        let lobbies = Model.lobbies;
        let found = await lobbies.find({name: name});
        found = found[0]; // Does not work to put [0] at above line for some reason
        if(found.permanent !== true) {
            lobbies.deleteMany({name: name}, err => true);
        }
    }

    static async modifyCurrentCount(name, num) {
        let model = Model.lobbies;
        let data = await model.findOne({name: name});
        data.current = parseInt(data.current) + num;
        await data.save();
        return data;
    }

    static async addCurrentCount(name) {
        return await this.modifyCurrentCount(name, 1);
    }

    static async removeCurrentCount(name) {
        return await this.modifyCurrentCount(name, -1);
    }

    static async resetRooms() {
        let model = Model.lobbies;
        let data = await model.find({});
        data.forEach(lobby => {
            lobby.current = "0";
            lobby.save();
        });

	}
	
	static async setAvatarToNonDefault(name, ending) {
		let model = Model.accounts;
        let data = await model.findOne({username: name});
        data.avatar = "avatars/" + name + "_avatar" + ending;
        await data.save();
        return data;
	}

	static async userExist(name) {
		let model = Model.accounts;
        let data = await model.findOne({username: name});
        return data != null
	}

	static async changeColor(name, color) {
        let model = Model.accounts;
        let data = await model.findOne({username: name});
        data.color = color;
        await data.save();
        return data;
	}
	
	static async changePassword(name, newPass) {
		let salt = bcrypt.genSaltSync(5);
		let model = Model.accounts;
		let data = await model.findOne({username: name});

		newPass = await bcrypt.hash(newPass, salt);

		data.password = newPass;
		data.salt = salt;
		await data.save();
		
        return data;
	}

    static async makeAccount(username, password) {
        let salt = bcrypt.genSaltSync(5);
        password = await bcrypt.hash(password, salt);
        let model = Model.accounts;

        let acc = new model({username: username, password: password, salt: salt, avatar: "defaultImg.png", color: "paleturquoise"});
        await acc.save();
        return {avatar: acc.avatar};
    }

    static async getUserInfo(username) {
        let model = Model.accounts;
        let data = await model.findOne({username: username});
        return data;
    }
}

Mongo.resetRooms();

module.exports = Mongo;