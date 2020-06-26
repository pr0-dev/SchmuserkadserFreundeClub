"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

// Dependencies
let express;

// Utils
let conf = require("./utils/configHandler");
let log = require("./utils/logger");

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

log.done("Started.");
