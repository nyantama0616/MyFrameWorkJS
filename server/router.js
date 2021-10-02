const fs = require("fs"),
    path = require("path"),
    settings = require("./settings");

const extensions = {
    "html": {
        contentType: "text/html",
        encoding: "utf-8"
    },

    "css": {
        contentType: "text/css",
        encoding: "utf-8"
    },

    "js": {
        contentType: "text/plain",
        encoding: "utf-8"
    },

    "png": {
        contentType: "image/png",
        encoding: "binary"
    },

    "mp3": {
        contentType: "sound/mp3",
        encoding: "binary"
    },

    "ico": {
        contentType: "image/x-icon",
        encoding: "binary"
    }
}

exports.routeSetting = function (req, res) {
    const pathname = req.url;
    let extname;
    let file;
    if (pathname === "/") {
        extname = "html";
        file = `${settings.ROOT}/${settings.TOP_PAGE}`;
    } else {
        extname = path.extname(pathname).slice(1);

        // 親ディレクトリなしの場合はpublicから探す
        if (path.dirname(pathname) === "/") {
            file = settings.ROOT + "/public" + pathname;
        } else {
            file = settings.ROOT + pathname;
        }

        //拡張子なしの場合は、htmlファイルとみなす
        if (!extname) {
            extname = "html";
            file += `.${extname}`;
        }
    }

    let data;
    let ex = extensions[extname];

    try {
        data = fs.readFileSync(file, ex.encoding);
    } catch (e) {
        // ファイル読み込みに失敗した場合
        console.log(e);
        res.writeHead(400, { "Content-Type": "text/html" });
        res.write(fs.readFileSync(`${settings.ROOT}/public/error.html`, "utf-8"), "utf-8");
        res.end();
        return;
    }

    res.writeHead(200, { "Content-Type": ex.contentType });
    res.write(data, ex.encoding);
    res.end();
}
