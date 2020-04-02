const
    io 				= require("./server").io,
    Mongo 			= require("./MongoDB/mongo.js"),
    Guest 			= require("./guests"),
	Player 			= require("./Game/Player"),
	LobbyHandler 	= require("./Game/LobbyHandler"),
    Game 			= require("./Game/Game");

io.on('connection', onConnection);

function onConnection(client) {
    client.on("startGame"   , onGameStart.bind(client));
    client.once("disconnect", onDisconnect.bind(client));
    client.on("joinedLobby" , onJoinLobby.bind(client));
    client.on("chatMessage" , onChatMessage.bind(client));
    client.on("usedCards"   , onUseCard.bind(client));
    client.on("endTurn"     , onEndTurn.bind(client));
}

function onGameStart(obj) {
    obj.users = Game.getByName(obj.destination).players;
    io.emit("newGame", obj);
}

// TODO: do we really need to wrap this?
async function onDisconnect() {
	LobbyHandler.onDisconnect();
}

async function onJoinLobby(test) {
	//LobbyHandler.onJoinLobby(test);
}

function onChatMessage(test) {
    console.log(`(@${test.destination}) ${test.name}: ${test.text}`)
    io.emit("messageFromServer", test);
}

async function onUseCard(obj) {
    let game = Game.getByName(obj.game);
    let player = game.getPlayer(obj.user);
    player.selection = obj.cards;
    obj.cards.forEach((card) => player.removeCard(card));
    await player.draw(obj.cards.length);
    game.turn.playerSubmit(player);
    if(game.turn.usersSubmitted === true) {
        console.log(game.selections);
        let owners = [];
        game.selections.forEach(s => {
            owners.push(s.owner);
        });
        io.emit("judgeTurn", {owners: owners, options: game.selections, game: game.name});
    }

    io.emit("updateCards", {user: obj.user, all: game.players});
}

function onEndTurn(obj) {
    console.log(`@${obj.game} ${obj.selection} won the round!`);

    let game = Game.getByName(obj.game);
    let p = game.getPlayer(obj.selection);
    p.points += 1;
    if(p.points >  1) {
        console.log("GAME OVER!");
        io.emit("gameOver", {game: game.name, winner: obj.selection});
    }

    game.endTurn();

    io.emit("newTurn", {game: obj.game, all: game.players, winner: obj.selection});
}

module.exports = io;