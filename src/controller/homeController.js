import { notification } from "./../service";

let getHome = async function(req, res) {
  let notifications = await notification.getNotifications(req.user._id);

  let countNotiUnread = await notification.countNotiUnread(req.user._id);

  res.render("main/home/home", {
    errors: req.flash("errors"),
    success: req.flash("success"),
    user: req.user,
    notifications: notifications,
    countNotiUnread: countNotiUnread
  });
};

module.exports = {
  getHome: getHome
};
