let all = new Map();

class Guest {
    constructor(name) {
        all.set(name, true);
        this.name = name;
    }

    attachSocket(socket) {
        all.set(socket, this.name);
    }

    static get all() {
        return all;
    }
}

module.exports = Guest;