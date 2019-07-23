import {validationResult} from "express-validator/check"

let getLoginRegister = function (req, res) {
  res.render("auth/master");
};

let postRegister = function (req, res) {
  let errorArr = [];
  let validationError = validationResult(req);

  if (!validationError.isEmpty()) {
    // Lấy tất cả value của object cho vào mảng 
    let error = Object.values(validationError.mapped());
    // Lấy ra msg và gán vào errorArr
    error.forEach(item => errorArr.push(item.msg));
    console.log(errorArr);
  } else {
    console.log(req.body);
  }
};

module.exports = {
  getLoginRegister: getLoginRegister,
  postRegister: postRegister
};
