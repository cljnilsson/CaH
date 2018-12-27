const
    io = require("./server").io,
    Game = require("./game");

let users = new Map();

io.on('connection', onConnection);

function onConnection(client) {
    client.on("startGame"   , onGameStart.bind(client));
    client.once("disconnect", onDisconnect.bind(client));
    client.on("joinedLobby" , onJoinLobby.bind(client));
    client.on("chatMessage" , onChatMessage.bind(client));
    client.on("usedCards"   , onUseCard.bind(client));
}

function onGameStart(obj) {
    obj.users = Game.getByName(obj.destination).players;
    io.emit("newGame", obj);
}

function onDisconnect() {
    let user = users.get(this);
    if(user != undefined) {
        let game = Game.getByName(user.lobby);
        game.removePlayer(user.user);
        users.delete(this);

        io.emit("userLeft", {destination: user.lobby, user: user.user, all: game.players});
    }
}

function onJoinLobby(test) {
    console.log(`${test.user} joined ${test.lobby}`);

    let game = Game.getByName(test.lobby);
    if(game === undefined) {
        game = new Game(test.lobby);
    }

    game.addPlayer(test.user);
    console.log(game.players[0]);

    test.all = game.players;

    io.emit("userJoin", test);
    users.set(this, {
        user: test.user,
        lobby: test.lobby
    });
}

function onChatMessage(test) {
    console.log(`(@${test.destination}) ${test.name}: ${test.text}`)
    io.emit("messageFromServer", test);
}

async function onUseCard(obj) {
    let game = Game.getByName(obj.game);
    let player = game.getPlayer(obj.user);
    obj.cards.forEach((card) => player.removeCard(card));
    await player.draw(obj.cards.length);

    io.emit("updateCards", {user: obj.user, all: game.players});
}