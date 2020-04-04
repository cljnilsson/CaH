let all = new Map();

class Guest {
	private name: string;
    constructor(name : string) {
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

export default Guest;