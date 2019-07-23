let getLoginRegister = function (req, res) {
  res.render("auth/master");
};

module.exports = {
  getLoginRegister: getLoginRegister
};
