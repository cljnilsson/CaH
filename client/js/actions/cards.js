export function updateCards(mode) {
    return {
        type: "UPDATE_CARDS",
        value: mode
    };
}

export function updateCardSelection(mode) {
    return {
        type: "CARD_SELECTION_CHANGED",
        value: mode
    };
}

export function confirmCards(mode) {
    return {
        type: "CONFIRM_SELECTION",
        value: mode
    };
}