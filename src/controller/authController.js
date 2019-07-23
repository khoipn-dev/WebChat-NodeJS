let getLoginRegister = function (req, res) {
  res.render("auth/index");
};

module.exports = {
  getLoginRegister: getLoginRegister
};