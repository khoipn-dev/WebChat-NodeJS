let getHome = function (req, res) {
  res.render("main/index");
};

module.exports = {
  getHome: getHome
};