import NotificationModel from "./../model/notificationModel";
import UserModel from "./../model/userModel";


const LIMIT_NOTIFICATION = 10;
/**
 * Lấy 10 thông báo khi f5
 * @param {string} currentUserID
 */
let getNotifications = (currentUserID) => {
  return new Promise(async (resolve, reject) => {
    try {
      let notifications = await NotificationModel.model.getByUserIDAndLimit(
        currentUserID,
        LIMIT_NOTIFICATION 
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

/**
 * Load thêm 10 thông báo
 * @param {string} currentUserID 
 * @param {number} skipNumber 
 */
let readMore = (currentUserID, skipNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      let nextNotification = await NotificationModel.model.readMore(currentUserID, skipNumber, LIMIT_NOTIFICATION);
      
      let getNotificationContents = nextNotification.map(async (notification) => {
        let sender = await UserModel.findUserById(notification.senderID);
        return NotificationModel.contents.getContent(notification.type, notification.isRead, sender );
      });

      resolve(await Promise.all(getNotificationContents));
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * 
 * @param {string} currentUserID 
 * @param {array} targetUsers 
 */
let markAllNotificationAsRead = (currentUserID, targetUsers) => {
  return new Promise(async (resolve, reject) => {
    try {
      await NotificationModel.model.markAllNotificationAsRead(currentUserID, targetUsers);
      resolve(true);
    } catch (error) {
      console.log(`Error when mark notification as read: ${error}`);
      reject(false);
    }
  });
}

module.exports = {
  getNotifications,
  countNotiUnread,
  readMore,
  markAllNotificationAsRead
};
