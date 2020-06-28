"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

// Core Modules
let path = require("path");

// Dependencies
let express = require("express");
let favicon = require("serve-favicon");
let bodyParser = require("body-parser");
let cors = require("cors");
let helmet = require("helmet");
let minify = require("express-minify");

// Utils
let conf = require("./utils/configHandler");
let log = require("./utils/logger");
let meta = require("./utils/meta");

// Services
let portHandler = require("./services/portCheck");

let version = conf.getVersion();
let appname = conf.getName();
let devname = conf.getAuthor();

let splashPadding = 12 + appname.length + version.toString().length;

console.log(
    `\n #${"-".repeat(splashPadding)}#\n` +
    ` # Started ${appname} v${version} #\n` +
    ` #${"-".repeat(splashPadding)}#\n\n` +
    ` Copyright (c) ${(new Date()).getFullYear()} ${devname}\n`
);

let config = conf.getConfig();
let app = express();

log.done("Started.");

meta((data) => {
    log.info(`Environment: ${data.environment}`);
    log.info(`NodeJS Version: ${data.nodeversion}`);
    log.info(`Operating System: ${data.os}`);
    log.info(`Server IP: ${data.ip}`);
});

app.enable("trust proxy");

app.set("view engine", "ejs");
app.set("port", portHandler(config.server.port));
app.set("views", path.join(__dirname, "www", "views"));

app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(path.join(__dirname, "www", "assets", "favicon.png")));

app.use((req, res, next) => {
    if (/\.min\.(css|js)$/.test(req.url)){
        // @ts-ignore
        res.minifyOptions = res.minifyOptions || {};
        // @ts-ignore
        res.minifyOptions.minify = false;
    }
    next();
});

app.use(minify());
app.use(express.static("./src/www/assets"));

require("./www/router")(app);

process.on("unhandledRejection", (err, promise) => {
    log.error(`Unhandled rejection (promise: ${promise}, reason: ${err})`);
});

app.listen(app.get("port"), (err) => {
    if (err){
        log.error(`Error on port ${app.get("port")}: ${err}`);
        process.exit(1);
    }
    log.info(`Listening on port ${app.get("port")}...`);
});
