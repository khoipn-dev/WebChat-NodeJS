import NotificationModel from "./../model/notificationModel";
import UserModel from "./../model/userModel";

/**
 * Lấy 10 thông báo khi f5
 * @param {string} currentUserID
 * @param {number} limit
 */
let getNotifications = (currentUserID, limit = 10) => {
  return new Promise(async (resolve, reject) => {
    try {
      let notifications = await NotificationModel.model.getByUserIDAndLimit(
        currentUserID,
        limit
      );
      let getNotificationContents = notifications.map(async (notification) => {
        let sender = await UserModel.findUserById(notification.senderID);
        return NotificationModel.contents.getContent(notification.type, notification.isRead, sender );
      });
      resolve(await Promise.all(getNotificationContents));
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Lấy tổng thông báo chưa đọc
 * @param {string} currentUserID
 */
let countNotiUnread = (currentUserID) => {
  return new Promise(async (resolve, reject) => {
    try {
      let notificationsUnread = await NotificationModel.model.countNotiUnread(currentUserID);
      resolve(notificationsUnread);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getNotifications,
  countNotiUnread
};
