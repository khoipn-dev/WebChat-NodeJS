import express from "express";
import {home, auth, user} from "./../controller/index";
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

  // Route trang chủ
  route.get("/", auth.checkLogin, home.getHome);

  /**
   * Đăng ký tài khoản local
   *  Vào authValid.register trước và trả về kết quả validate
  */
  route.get("/login-register", auth.checkLogout, auth.getLoginRegister);
  route.post("/register", auth.checkLogout, authValid.register, auth.postRegister);
  route.get("/verify/:token", auth.checkLogout, auth.verifyAccount);

  //Đăng nhập local
  route.post("/login", auth.checkLogout, passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login-register",
    successFlash: true,
    failureFlash:true
  }));

  //Đăng nhập facebook
  route.get("/auth/facebook", auth.checkLogout, passport.authenticate("facebook", {scope: ["email"]}));
  route.get("/auth/facebook/callback", auth.checkLogout, passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/login-register"
  }));

  //Đăng nhập google
  route.get("/auth/google", auth.checkLogout, passport.authenticate("google", {scope: ["email", "profile", "openid"]}));
  route.get("/auth/google/callback", auth.checkLogout, passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login-register"
  }));

  // Đăng xuất
  route.get("/logout", auth.checkLogin, auth.getLogout);
  
  route.put("/user/update-avatar", auth.checkLogin, user.updateAvatar);
  

  return app.use("/", route);
}
 module.exports = initRoutes;
