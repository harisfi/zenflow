const createError = require("http-errors");
const express = require("express");
const session = require("express-session");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const Database = require("./database");
const Routes = require("./routes");
const Model = require("./app/models");

require("dotenv").config();
const env = process.env.NODE_ENV || "development";
const dbConfig = require("./config/config")[env];

class Zenflow {
  constructor() {
    this.initDb();
    return this.initApp();
  }

  initDb() {
    this.database = Database.getInstance(dbConfig);
  }

  initApp() {
    const app = express();

    // view engine setup
    app.set("views", path.join(__dirname, "views"));
    app.set("view engine", "ejs");

    app.use(logger("dev"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(
      session({
        resave: false,
        saveUninitialized: false,
        secret: "shhhh, very secret",
      })
    );

    app.use(function (req, res, next) {
      var err = req.session.error;
      var msg = req.session.success;
      delete req.session.error;
      delete req.session.success;
      res.locals.message = "";
      res.locals.state = "success";
      if (err) {
        res.locals.message = err;
        res.locals.state = "danger";
      }
      if (msg) res.locals.message = msg;
      next();
    });

    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, "public")));

    const models = new Model(this.database.sequelize);
    const routes = new Routes(...models);
    app.use(routes);

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
      next(createError(404));
    });

    // error handler
    app.use(function (err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = env === "development" ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render("error");
    });

    return app;
  }
}

const zenflow = new Zenflow();

module.exports = zenflow;
