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

export class Post {

}

console.log(new Get("/").send());

export default Request;