const
    io = require("./server").io,
    Game = require("./game");

let users = new Map();

io.on('connection', (client) => {
    client.on("startGame", function(obj) {
        obj.users = [];
        for (var [key, value] of Game.getByName(obj.destination).players) {
            obj.users.push(value.name);
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
        if(Game.getByName(test.lobby) === undefined) {
            new Game(test.lobby);
        }

        Game.getByName(test.lobby).addPlayer(test.user);

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