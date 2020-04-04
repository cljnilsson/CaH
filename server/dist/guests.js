"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = Guest;
//# sourceMappingURL=guests.js.map