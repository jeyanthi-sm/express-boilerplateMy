let dotenv = require("dotenv").config();
let express = require("express");
const { dirname } = require("path");
let app = express();
let bodyParser = require("body-parser");
console.log("Hello World");
app.use("/public", express.static(__dirname + "/public"));
//
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
/* 10 use bodyparser to parse post requests*/
app.use(bodyParser.urlencoded({ extended: false }));
/* 6) implement a root level request logger Middleware */
app.use(function middleware(req, res, next) {
  console.log("I'm a middleware");
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
}),
  app.get("/", function (req, res) {
    res.sendFile(__dirname + "/views/index.html");
    //res.send("Hello Express");
  });
/** 5) Serve json on a specific route */
app.get("/json", (req, res) => {
  console.log(process.env.MESSAGE_STYLE);
  process.env.MESSAGE_STYLE === "uppercase"
    ? res.json({ message: "HELLO JSON" })
    : res.json({ message: "Hello json" });
});

/** 7) Chain Middleware to Create a Time Server */
app.get(
  "/now",
  function (req, res, next) {
    req.time = new Date().toString();
    next();
  },
  function (req, res) {
    res.json({ time: req.time });
  }
);

/** 8) Get Route Parameter input from the client */
app.get("/:word/echo", function (req, res) {
  res.json({ echo: req.params.word });
});

/** 9) Get Route Parameter input from the client */
app.get(
  "/name",
  function (req, res) {
    console.log(req.query?.first);
    console.log(req.query?.last);

    res.json({ name: `${req.query?.first} ${req.query?.last}` });
  },
  app.post("/name", function (req, res) {
    res.json({ name: req.body.first + " " + req.body.last });
  })
);

module.exports = app;
