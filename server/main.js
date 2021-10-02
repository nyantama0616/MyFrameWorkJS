"use strict";

const http = require("http"),
    settings = require("./settings"),
    router = require("./router");

const app = http.createServer(router.routeSetting);

app.listen(settings.PORT);
