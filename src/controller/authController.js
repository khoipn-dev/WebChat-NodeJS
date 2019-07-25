import {validationResult} from "express-validator/check";
import {auth} from "./../service/index";

let getLoginRegister = function (req, res) {
  res.render("auth/master", {
    errors: req.flash("errors"),
    success: req.flash("success")
  });
};

let postRegister = async function (req, res) {
  let errorArr = [];
  let successArr = [];
  //validationResult(req) trả về 1 mảng các trường không valid
  let validationError = validationResult(req);

  if (!validationError.isEmpty()) {
    // Lấy tất cả value của object cho vào mảng 
    let error = Object.values(validationError.mapped());
    // Lấy ra msg và gán vào errorArr
    error.forEach(item => errorArr.push(item.msg));
    req.flash("errors", errorArr);
    return res.redirect("/login-register");
  } 
  // Nếu không bị lỗi validation
  try {
    let createUserSuccess = await auth.register(req.body.email, req.body.gender, req.body.password);
    successArr.push(createUserSuccess);
    req.flash("success", successArr);
    return res.redirect("/login-register");
  } catch (err) {
    errorArr.push(err);
    req.flash("errors", errorArr);
    return res.redirect("/login-register");
  }
};

module.exports = {
  getLoginRegister: getLoginRegister,
  postRegister: postRegister
};
