const
    express     = require("express"),
    app         = express(),
    server      = require("http").createServer(app),
    io          = require("socket.io")(server);
    bodyParser  = require("body-parser"),
    helmet      = require('helmet'),
    compression = require("compression"),
    ngrok       = require('ngrok'),
    path        = require('path');

require("./MongoDB/mongo")
require('dotenv').config({path:join('../.env')});

function join(dir) {
    return path.join(__dirname, dir);
}

function header(req, res, next) {
    res.setHeader("Content-Security-Policy", "connect-src 'self' ws:");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}

class Server {
    get port() {
        return process.env.PORT || 3000;;
    }

    get url() {
        return this._url;
    }

    constructor() {
        this.dependencies()
        this.middleware();
        this.startup()
    }

    dependencies() {
    }

    middleware() {
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(header);
        app.use(helmet());
        app.use(bodyParser.json());
        app.use(compression());
        app.use(express.static(__dirname + "/../../public"));
    }

    async startup() {
        server.listen(this.port);
        console.log(`started on port ${this.port}`);
        await this.setupPublicPreview();
        console.log("Public url: " + this.url);
    }

    async setupPublicPreview() {
        this._url = await ngrok.connect({
            addr: process.env.PORT,
            region: "eu"
        });
    }
}


let webServer = new Server();

module.exports.a = app;
module.exports.io = io;