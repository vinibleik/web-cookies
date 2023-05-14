const express = require("express");
const Login = require("../model/login");
const {
  LoginSchema,
  UpdateLoginSchema,
} = require("../validators/loginValidator");

const COOKIE_LOGIN = "auth_SES";
const route = express.Router();

route.get("/", (req, res) => {
  let login = req.cookies[COOKIE_LOGIN];
  if (login) {
    return res.redirect("intranet");
  }
  res.render("index");
});

route.post("/login", (req, res) => {
  const { error, value } = LoginSchema.validate(req.body);
  if (error || !Login.checkPassword(value.login, value.password)) {
    return res.render("index", {
      error: "Forneça login e password!",
    });
  }

  let cookieValue = "";

  try {
    cookieValue = Login.encrypt(value.login);
  } catch (error) {
    return res.render("index", {
      error: "Something got wrong with the login sorry.",
    });
  }

  res.cookie(COOKIE_LOGIN, cookieValue);
  res.redirect("intranet");
});

route.get("/logout", (req, res) => {
  res.clearCookie(COOKIE_LOGIN);
  res.redirect(".");
});

route.get("/intranet", (req, res) => {
  let login = req.cookies[COOKIE_LOGIN];
  if (!login) {
    console.log("Não logado!");
    return res.redirect("logout");
  }

  try {
    login = Login.decrypt(login);
  } catch (error) {
    login = "";
  }

  if (!Login.getUserByLogin(login)) {
    console.log("User inexistent");
    return res.redirect("logout");
  }

  res.status(200).render("intranet", { login });
});

route.post("/salvanome", (req, res) => {
  const { error, value } = UpdateLoginSchema.validate(req.body);
  if (error || !Login.setUserLogin(value.oldLogin, value.newLogin)) {
    return res.render("intranet", {
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
      error: "Something got wrong with the login sorry.",
    });
  }

  res.cookie(COOKIE_LOGIN, cookieValue);
  res.redirect("intranet");
});

module.exports = route;
