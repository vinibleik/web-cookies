const express = require("express");
const Login = require("../model/login");
const {
  LoginSchema,
  UpdateLoginSchema,
} = require("../validators/loginValidator");

const COOKIE_LOGIN = "auth_SES";
const route = express.Router();
const __route = "cookies";

route.get("/", (req, res) => {
  let login = req.cookies[COOKIE_LOGIN];
  if (login) {
    return res.redirect("/cookies/intranet");
  }
  res.status(200).render("index", {
    __route,
  });
});

route.post("/login", (req, res) => {
  const { error, value } = LoginSchema.validate(req.body);
  if (error || !Login.checkPassword(value.login, value.password)) {
    return res.render("index", {
      __route,
      error: "Login or Password don't match!",
    });
  }

  let cookieValue = "";

  try {
    cookieValue = Login.encrypt(value.login);
  } catch (error) {
    return res.render("index", {
      __route,
      error: "Something got wrong with the login sorry.",
    });
  }

  res.cookie(COOKIE_LOGIN, cookieValue);
  res.redirect("/cookies/intranet");
});

route.get("/logout", (req, res) => {
  res.clearCookie(COOKIE_LOGIN);
  res.redirect("/cookies");
});

route.get("/intranet", (req, res) => {
  let login = req.cookies[COOKIE_LOGIN];
  if (!login) {
    console.log("Não logado!");
    return res.redirect("/cookies/logout");
  }

  try {
    login = Login.decrypt(login);
  } catch (error) {
    login = "";
  }

  if (!Login.getUserByLogin(login)) {
    console.log("User inexistent");
    return res.redirect("/cookies/logout");
  }

  res.status(200).render("intranet", { __route, login });
});

route.post("/salvanome", (req, res) => {
  const { error, value } = UpdateLoginSchema.validate(req.body);
  if (error || !Login.setUserLogin(value.oldLogin, value.newLogin)) {
    return res.render("intranet", {
      __route,
      login: value.oldLogin,
      error: "Novo login inválido",
    });
  }

  let cookieValue = "";

  try {
    cookieValue = Login.encrypt(value.newLogin);
  } catch (error) {
    res.clearCookie(COOKIE_LOGIN);
    return res.render("index", {
      __route,
      error: "Something got wrong with the login sorry.",
    });
  }

  res.cookie(COOKIE_LOGIN, cookieValue);
  res.redirect("/cookies/intranet");
});

module.exports = route;
