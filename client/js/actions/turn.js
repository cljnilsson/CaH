export function updateTurn(mode) {
    return {
        type: "UPDATE_TURN",
        value: mode
    };
}

export function newTurn(mode) {
    return {
        type: "NEW_TURN",
        value: mode
    };
}

export function endTurn(mode) {
    return {
        type: "END_TURN",
        value: mode
    };
}