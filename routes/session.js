const express = require("express");
const Login = require("../model/login");
const {
  LoginSchema,
  UpdateLoginSchema,
} = require("../validators/loginValidator");

const route = express.Router();
const __route = "session";

route.get("/", (req, res) => {
  let login = req.session.login;
  if (login !== undefined) {
    return res.redirect("/session/intranet");
  }
  res.status(200).render("index", { __route });
});

route.post("/login", (req, res) => {
  const { error, value } = LoginSchema.validate(req.body);
  if (error || !Login.checkPassword(value.login, value.password)) {
    return res.render("index", {
      __route,
      error: "Login or Password don't match!",
    });
  }
  req.session.login = Login.encrypt(value.login);
  res.redirect("/session/intranet");
});

route.get("/logout", (req, res) => {
  req.session.login = undefined;
  res.redirect("/session");
});

route.get("/intranet", (req, res) => {
  let login = req.session.login;
  if (!login) {
    console.log("Usuário não logado!");
    return res.redirect("/session");
  }

  try {
    login = Login.decrypt(login);
  } catch (err) {
    login = "";
  }

  if (!Login.getUserByLogin(login)) {
    console.log("Usuário inexistente!");
    res.redirect("/session/logout");
  }

  res.status(200).render("intranet", {
    __route,
    login,
  });
});

route.post("/salvanome", (req, res) => {
  const { error, value } = UpdateLoginSchema.validate(req.body);

  if (error) {
    return res.render("intranet", {
      __route,
      login: value.oldLogin,
      error: "Novo login inválido",
    });
  }

  let login = "";

  try {
    login = Login.encrypt(value.newLogin);
  } catch (error) {
    return res.render("intranet", {
      __route,
      login: value.oldLogin,
      error: "Novo login inválido",
    });
  }

  if (!Login.setUserLogin(value.oldLogin, value.newLogin)) {
    return res.render("intranet", {
      __route,
      login: value.oldLogin,
      error: "Novo login inválido",
    });
  }

  req.session.login = login;
  res.redirect("/session/intranet");
});

module.exports = route;
