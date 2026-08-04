const express = require("express");

function checkLoggedIn(req, res, next) {
  const isLoggedIn = req.isAuthenticated() && req.user;
  if (!isLoggedIn) {
    return res.status(401).json({ error: "You must log in!" });
  }
  next();
}

const {
  httpDeleteUser,
  httpGetUser,
  httpGetUsers,
  httpUpdateUser,
  httpCheckIfAdmin,
  httpGetMyUser,
} = require("./user.controller");

const UserAPI = express.Router();

UserAPI.get("/", checkLoggedIn, httpGetUsers);
UserAPI.get("/checkAdmin", checkLoggedIn, httpCheckIfAdmin);
UserAPI.get("/me", checkLoggedIn, httpGetMyUser);
UserAPI.get("/:id", checkLoggedIn, httpGetUser);
UserAPI.put("/:id", checkLoggedIn, httpUpdateUser);
UserAPI.delete("/:id", httpDeleteUser);

module.exports = UserAPI;
