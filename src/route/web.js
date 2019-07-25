import express from "express";
import {home, auth} from "./../controller/index";
import {authValid} from "./../validation/index";
import initPassportLocal from "./../controller/passportController/local";
import passport from "passport";

//Khởi tạo passport
initPassportLocal();

let route = express.Router();

/**
 * Khởi tạo route
 * @param app từ express module
 */

let initRoutes = (app) => {
  route.get("/", home.getHome);
  route.get("/login-register", auth.getLoginRegister);
  // Vào authValid.register trước và trả về kết quả validate
  route.post("/register", authValid.register, auth.postRegister);
  route.get("/verify/:token", auth.verifyAccount);
  route.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login-register",
    successFlash: true,
    failureFlash:true
  }))

  return app.use("/", route);
}
 module.exports = initRoutes;
