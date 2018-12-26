const
    io = require("./server").io,
    Game = require("./game");

let users = new Map();

io.on('connection', (client) => {
    client.on("startGame", function(obj) {
        obj.users = [];
        for (var [key, value] of Game.getByName(obj.destination).players) {
            obj.users.push({name: value.name, type: value.type});
        }
        io.emit("newGame", obj);
    });
    client.once("disconnect", function() {
        let user = users.get(client);
        if(user != undefined) {
            io.emit("userLeft", {destination: user.lobby, user: user.user})
            Game.getByName(user.lobby).removePlayer(user.user);
            users.delete(client)
        }
    });

    client.on("joinedLobby", function(test) {
        console.log(`${test.user} joined ${test.lobby}`);

        let game = Game.getByName(test.lobby);
        if(game === undefined) {
            game = new Game(test.lobby);
        }

        game.addPlayer(test.user);

        test.all = Array.from(game.players.values());

        io.emit("userJoin", test);
        users.set(client, {
            user: test.user,
            lobby: test.lobby
        });
    });

    client.on("chatMessage", function(test) {
        console.log(`(@${test.destination}) ${test.name}: ${test.text}`)
        io.emit("messageFromServer", test);
    }); 
});