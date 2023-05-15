const express = require("express");
const Login = require("../model/login");
var passport = require("passport");

var LocalStrategy = require("passport-local");

const router = express.Router();
const __route = "passport";

router.use(passport.authenticate("session"));

passport.use(
  new LocalStrategy(
    {
      usernameField: "login",
      passwordField: "password",
    },
    function verify(username, password, done) {
      if (!Login.checkPassword(username, password))
        return done(null, false, {
          message: "Incorrect username or password.",
        });

      return done(null, Login.getUserByLogin(username));
    }
  )
);

passport.use(
  "updateLogin",
  new LocalStrategy(
    {
      usernameField: "oldLogin",
      passwordField: "newLogin",
    },
    function verify(oldLogin, newLogin, done) {
      const user = Login.setUserLogin(oldLogin, newLogin);
      if (!user) {
        return done(null, false, {
          message: "Novo login inválido!",
        });
      }

      return done(null, user);
    }
  )
);

passport.serializeUser(function (user, done) {
  return done(null, user.login);
});

passport.deserializeUser(function (login, done) {
  return done(null, Login.getUserByLogin(login));
});

router.get("/", (req, res) => {
  const user = req.session?.passport?.user;
  if (user) {
    return res.redirect("/passport/intranet");
  }

  const error = req.session?.messages?.[0];
  if (error) {
    return res.render("index", {
      __route,
      error,
    });
  }

  res.status(200).render("index", {
    __route,
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/passport/intranet",
    failureRedirect: "/passport/",
    failureMessage: "Incorrect username or password.",
  })
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    res.redirect("/passport");
  });
});

router.get("/intranet", (req, res) => {
  const login = req.session?.passport?.user;
  if (!login) {
    console.log("Usuário não logado");
    return res.redirect("/passport");
  }
  const error = req.session?.messages?.[0];
  if (error) delete req.session.messages;
  res.status(200).render("intranet", {
    __route,
    login,
    error,
  });
});

router.post(
  "/salvanome",
  passport.authenticate("updateLogin", {
    successRedirect: "/passport/intranet",
    failureRedirect: "/passport/intranet",
    failureMessage: "Novo usuário inválido!",
  })
);

module.exports = router;
