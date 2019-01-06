const url = "http://localhost:3001"


class Request {
    constructor(uri) {
        this.uri = uri;
    }
}

export class Get extends Request{
    constructor(uri) {
        super(uri);
    }

    async send() {
        return await fetch(url + this.uri);
    }
}

export class Post extends Request{
    get data() {
        return this._data;
    }
    set data(value) {
        this._data = value;
    }

    send() {
        console.log(this.data);
        fetch(url + this.uri, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(this.data)
        });
    }
}

export default Request;