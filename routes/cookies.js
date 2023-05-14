const express = require("express");
const Login = require("../model/login");
const {
  LoginSchema,
  UpdateLoginSchema,
} = require("../validators/loginValidator");

const route = express.Router();

route.get("/", (req, res) => {
  res.render("index");
});

route.post("/login", (req, res) => {
  const { error, value } = LoginSchema.validate(req.body);
  if (error || !Login.checkPassword(value.login, value.password)) {
    return res.render("index", {
      error: "Forneça login e password!",
    });
  }
  res.cookie("login", value.login);
  res.redirect("intranet");
});

route.get("/logout", (req, res) => {
  res.clearCookie("login");
  res.redirect(".");
});

route.get("/intranet", (req, res) => {
  const login = req.cookies.login;
  if (!login) {
    console.log("Não logado!");
    return res.redirect(".");
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

  res.cookie("login", value.newLogin);
  res.redirect("intranet");
});

module.exports = route;
