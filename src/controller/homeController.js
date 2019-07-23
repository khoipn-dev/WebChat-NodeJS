let getHome = function (req, res) {
  res.render("main/master");
};

module.exports = {
  getHome: getHome
};
