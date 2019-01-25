export function sendMessage(mode) {
    return {
        type: "SEND_MESSAGE",
        value: mode
    };
}

export function newMessage(mode) {
    return {
        type: "NEW_MESSAGE",
        value: mode
    };
}