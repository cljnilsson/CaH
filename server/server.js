const
    express     = require("express"),
    app         = express(),
    server      = require("http").createServer(app),
    io          = require("socket.io")(server);
    bodyParser  =  require("body-parser"),
    exphbs      = require("express-handlebars"),
    session     = require('express-session'),
    helmet      = require('helmet'),
    nconf       = require('nconf'),
    compression = require("compression"),
    ngrok       = require('ngrok'),
    path        = require('path');

require("./MongoDB/mongo")
require('dotenv').config({path:join('../.env')});

const sessionSettings = {
    name: "session",
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
    }
};

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
        nconf.env();
        nconf.file({file: join("../config.json")});

        let hbs = exphbs.create({
            extname: ".hbs",
            defaultLayout: 'main',
            layoutsDir: join("../views/Layouts"),
            partialsDir: join("../views/partials")
        });
        
        app.engine(".hbs", hbs.engine);
        
        app.set("view engine", ".hbs");
        app.set('views', join('../views'));
    }

    middleware() {
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(header);
        app.use(helmet());
        app.use(session(sessionSettings));
        app.use(bodyParser.json());
        app.use(compression());
        app.use(express.static(__dirname + "/../public"));
    }

    async startup() {
        server.listen(this.port);
        console.log(`started on port ${this.port}`);
        await this.setupPublicPreview();
        console.log("Public url: " + this.url);

        io.on('connection', (client) => {
           client.on("joinedLobby", function(test) {
               console.log(`${test.user} joined ${test.lobby}`);
           }) 
        });
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