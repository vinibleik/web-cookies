const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const mustacheExpress = require("mustache-express");
const session = require("express-session");

const cookieRouter = require("./routes/cookies");
const sessionRouter = require("./routes/session");
const passportRouter = require("./routes/passport");

const PORT = 5500;
const app = express();
const engine = mustacheExpress();

app.engine("mustache", engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "mustache");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(
  session({ secret: "password", resave: false, saveUninitialized: false })
);

app.use("/cookies", cookieRouter);
app.use("/session", sessionRouter);
app.use("/passport", passportRouter);

app.get("/", (req, res) => {
  res.status(200).send(`
  <a href="/cookies">cookies</a><br>
  <a href="/session">session</a><br>
  <a href="/passport">passport</a>
  `);
});

app.listen(PORT, () => {
  // app._router.stack.forEach((e) => {
  //   if (e.name == "session") {
  //     console.log(e.handle.toString());
  //   }
  // });
  console.log(`Server listening on port ${PORT}`);
});
