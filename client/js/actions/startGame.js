export function startGame(mode) {
    return {
        type: "START_GAME",
        value: mode
    };
}

export function startGameClick(mode) {
    return {
        type: "START_GAME_CLICK",
        value: mode
    };
}