const
    io = require("./server").io,
    Game = require("./game").Game,
    games = require("./game").games;

let users = new Map();

io.on('connection', (client) => {
    client.on("startGame", function(obj) {
        console.log(games[obj.destination]);
        obj.users = games[obj.destination].players;
        io.emit("newGame", obj);
    });
    client.once("disconnect", function() {
        let user = users.get(client);
        if(user != undefined) {
            io.emit("userLeft", {destination: user.lobby, user: user.user})
            games[user.lobby].removePlayer(user.user);
            users.delete(client)
        }
    });

    client.on("joinedLobby", function(test) {
        console.log(`${test.user} joined ${test.lobby}`);
        if(games[test.lobby] === undefined) {
            new Game(test.lobby);
        }

        games[test.lobby].addPlayer(test.user);

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