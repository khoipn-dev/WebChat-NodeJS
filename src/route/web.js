import express from "express";
import {home, auth} from "./../controller/index";
let route = express.Router();

/**
 * Init all route
 * @param app from exactly express module
 */

let initRoutes = (app) => {
  route.get("/", home.getHome);
  route.get("/login-register", auth.getLoginRegister);

  return app.use("/", route);
}
 module.exports = initRoutes;