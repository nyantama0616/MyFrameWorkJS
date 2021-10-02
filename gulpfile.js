let gulp = require("gulp"),
    watch = require("gulp-watch"),
    concat = require("gulp-concat"),
    babel = require("gulp-babel"),
    browserify = require("gulp-browserify"),
    uglify = require("gulp-uglify"),
    sass = require("gulp-sass")(require("node-sass")),
    exec = require('child_process').exec
fs = require("fs"),
    path = require("path");
log = console.log.bind(console);

// jsファイルを結合、圧縮
function compressJS(pathname) {
    let dir = path.dirname(pathname);
    let dirname = path.basename(dir);
    let files = fs.readdirSync(dir).filter(file => fs.statSync(`${dir}/${file}`).isFile());

    // "first.js"を最初にもってくる
    let i = files.indexOf("first.js");
    if (i >= 0) [files[i], files[0]] = [files[0], files[i]];
    //

    // "main.js"を最後尾にもってくる
    let len = files.length;
    i = files.indexOf("main.js");
    if (i >= 0) [files[i], files[len - 1]] = [files[len - 1], files[i]];
    //

    gulp.src(files.map(file => `${dir}/${file}`))
        .pipe(concat(`${dirname}.min.js`))
        // .pipe(browserify())
        .pipe(gulp.dest("dest/js"));
}

// jsxファイルを結合、トランスパイル、圧縮
function compileAndCompressJSX(pathname) {
    let dir = path.dirname(pathname);
    let dirname = path.basename(dir);
    let files = fs.readdirSync(dir).filter(file => fs.statSync(`${dir}/${file}`).isFile());

    // "App.jsx"を最後尾にもってくる
    let len = files.length;
    let i = files.indexOf("App.jsx");
    if (i >= 0) [files[i], files[len - 1]] = [files[len - 1], files[i]];
    //

    gulp.src(files.map(file => `${dir}/${file}`))
        .pipe(concat(`${dirname}.min.js`))
        .pipe(babel())
        .on('error', console.error.bind(console))
        .pipe(browserify())
        .pipe(gulp.dest("dest/js"));
}

//scssファイルを結合、コンパイル
function compileSass(pathname) {
    let style = path.dirname(pathname);
    let dir = path.dirname(style);
    let dirname = path.basename(dir);
    let files = fs.readdirSync(style);
    gulp.src(files.map(file => `${style}/${file}`))
        .pipe(concat(`${dirname}.min.css`))
        .pipe(sass({ outputStyle: "compressed" }))
        .pipe(gulp.dest("dest/css"));
}

gulp.task("watch", (done) => {

    watch("src", (info) => {
        pathname = info.history[0];
        ex = path.extname(pathname).slice(1);

        log(`"${path.basename(pathname)}" has been changed.`);

        switch (ex) {
            case "js":
                compressJS(pathname);
                break;
            case "jsx":
                compileAndCompressJSX(pathname);
                break;
            case "scss":
                compileSass(pathname);
                break;
        }
    });

    done();
});

// dest/jsをすべてbrowserify
gulp.task("browserify", (done) => {
    let files = [
        "index.min.js",
        "solo.min.js",
        "chat.min.js",
        "multi.min.js"
    ]
    for (let file of files) {
        exec(`browserify dest/js/${file} -o dest/js/${file}`);
    }
    done();
})

// dest/jsをすべて圧縮
gulp.task("uglify", (done) => {
    let files = fs.readdirSync("dest/js");
    for (let file of files) {
        gulp.src(`dest/js/${file}`)
            .pipe(uglify())
            .pipe(gulp.dest("dest/js"));
    }
    done();
})
