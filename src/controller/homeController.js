import { notification, contact, message } from "./../service";
import { bufferToBase64, getLastItemOfArray, timeStampToHumanTime } from "./../helpers/clientHelper";
import request from "request";

let getIceServer = () => {
    return new Promise(async (resolve, reject) => {
      // Node Get ICE STUN and TURN list
      let o = {
        format: "urls"
      };

      let bodyString = JSON.stringify(o);
      let options = {
        url: "https://global.xirsys.net/_turn/eChat",
        // host: "global.xirsys.net",
        // path: "/_turn/eChat",
        method: "PUT",
        headers: {
          "Authorization": "Basic " + Buffer.from("khoipndev:2e26955a-390f-11ea-a4cb-0242ac110004").toString("base64"),
          "Content-Type": "application/json",
          "Content-Length": bodyString.length
        }
      };

      request(options, (error, response, body) => {
        if (error) {
          console.log("Error when get ice server");
          return reject(error);
        }

        let bodyJson = JSON.parse(body);
        resolve(bodyJson.v.iceServers);
      });

    });
};

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

  let allConversationWithMessages = await message.getAllConversationItems(req.user._id);

  // Lấy ice server
  let iceServerList = await getIceServer();

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
    allConversationWithMessages:allConversationWithMessages,
    bufferToBase64: bufferToBase64,
    getLastItemOfArray:getLastItemOfArray,
    timeStampToHumanTime: timeStampToHumanTime,
    iceServerList: JSON.stringify(iceServerList),
  });
};

module.exports = {
  getHome: getHome
};
