import express from "express";
import {home, auth} from "./../controller/index";
import {authValid} from "./../validation/index";
import initPassportLocal from "./../controller/passportController/local";
import initPassportFacebook from "./../controller/passportController/facebook";
import initPassportGoogle from "./../controller/passportController/google";
import passport from "passport";

//Khởi tạo passport
initPassportLocal();
initPassportFacebook();
initPassportGoogle();

let route = express.Router();

/**
 * Khởi tạo route
 * @param app từ express module
 */

let initRoutes = (app) => {
  route.get("/login-register", auth.checkLogout, auth.getLoginRegister);
  // Vào authValid.register trước và trả về kết quả validate
  route.post("/register", auth.checkLogout, authValid.register, auth.postRegister);
  route.get("/verify/:token", auth.checkLogout, auth.verifyAccount);

  //Login local
  route.post("/login", auth.checkLogout, passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login-register",
    successFlash: true,
    failureFlash:true
  }));

  //Login facebook
  route.get("/auth/facebook", auth.checkLogout, passport.authenticate("facebook", {scope: ["email"]}));
  route.get("/auth/facebook/callback", auth.checkLogout, passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/login-register"
  }));

  //Login google
  route.get("/auth/google", auth.checkLogout, passport.authenticate("google", {scope: ["email"]}));
  route.get("/auth/google/callback", auth.checkLogout, passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login-register"
  }));

  route.get("/", auth.checkLogin, home.getHome);
  route.get("/logout", auth.checkLogin, auth.getLogout);

  return app.use("/", route);
}
 module.exports = initRoutes;
