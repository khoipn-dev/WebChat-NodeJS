import { notification, contact } from "./../service";

let getHome = async function(req, res) {
  // Lấy 10 thông báo mới nhất
  let notifications = await notification.getNotifications(req.user._id);

  // Tổng số thông báo chưa đọc
  let countNotiUnread = await notification.countNotiUnread(req.user._id);

  // Lấy danh sách bạn bè
  let contacts = await contact.getContacts(req.user._id);

  // Các yêu cầu kết bạn đã gửi
  let contactsSent = await contact.getContactsSent(req.user._id);

  // Các yêu cầu kết bạn đã nhận
  let contactsReceived = await contact.getContactsReceived(req.user._id);

  // Tổng số bạn bè
  let countContacts = await contact.countContacts(req.user._id);

  // Tổng số yêu cầu kết bạn đã gửi
  let countContactsSent = await contact.countContactsSent(req.user._id);

  // Tổng số yêu cầu kết bạn đã nhận
  let countContactsReceived = await contact.countContactsReceived(req.user._id);


  res.render("main/home/home", {
    errors: req.flash("errors"),
    success: req.flash("success"),
    user: req.user,
    notifications: notifications,
    countNotiUnread: countNotiUnread,
    contacts: contacts,
    contactsSent: contactsSent,
    contactsReceived: contactsReceived,
    countContacts: countContacts,
    countContactsSent: countContactsSent,
    countContactsReceived: countContactsReceived,
  });
};

module.exports = {
  getHome: getHome
};
