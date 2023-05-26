require('dotenv').config();
const createError = require("http-errors");
const express = require("express");
const favicon = require('serve-favicon');
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const handlebars = require("express-handlebars");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const session = require('express-session');
const flash = require('connect-flash');

const app = express();

function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  } else {
    // User is not authenticated, redirect to login page
    res.redirect('/users/login');
  }
}

const postsRouter = require("./routes/posts")(ensureAuthenticated);  

app.engine(
  "hbs",
  handlebars({
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
    extname: ".hbs",
    defaultLayout: "layout",
    helpers: {},
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: 'auto' }
}));

app.use(flash());

app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  next();
});

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/", postsRouter); 

app.use((req,res,next) => {
  next(createError(404, `The route ${req.method} : ${req.url} does not exist.`));
})

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = err;
  console.log(err);
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
