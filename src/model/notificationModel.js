import mongoose from "mongoose";

let Schema = mongoose.Schema;

let NotificationSchema = new Schema({
  senderID: String,
  receiverID: String,
  type: String,
  isRead: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now }
});

NotificationSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  removeRequestContactNotification(senderID, receiverID, type) {
    return this.deleteOne({
      $and: [{ senderID: senderID }, { receiverID: receiverID }, { type: type }]
    }).exec();
  },
  /**
   * Get limit notification by userID
   * @param {string} userID
   * @param {number} limit
   */
  getByUserIDAndLimit(userID, limit) {
    return this.find({
      receiverID: userID
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  },
  countNotiUnread(userID) {
    return this.countDocuments({
      $and: [{ receiverID: userID }, { isRead: false }]
    }).exec();
  },

  /**
   *
   * @param {string} userID
   * @param {number} skipNumber
   * @param {number} limit
   */

  readMore(userID, skipNumber, limit) {
    return this.find({
      receiverID: userID
    })
      .sort({ createdAt: -1 })
      .skip(skipNumber)
      .limit(limit)
      .exec();
  }
};

const NOTIFICATION_TYPES = {
  ADD_CONTACT: "add_contact"
};

const NOTIFICATION_CONTENTS = {
  getContent: (notificationType, isRead, sender) => {
    if (notificationType === NOTIFICATION_TYPES.ADD_CONTACT) {
      if (!isRead) {
        return `<div class="noti-readed-false" data-uid="${sender._id}">
              <img class="avatar-small" src="images/users/${sender.avatar}" alt=""> 
              <strong>${sender.username}</strong> đã gửi cho bạn lời mời kết bạn!
            </div>`;
      }
      return `<div data-uid="${sender._id}">
              <img class="avatar-small" src="images/users/${sender.avatar}" alt=""> 
              <strong>${sender.username}</strong> đã gửi cho bạn lời mời kết bạn!
            </div>`;
    }

    return "No matching with any notification type.";
  }
};

module.exports = {
  model: mongoose.model("notification", NotificationSchema),
  types: NOTIFICATION_TYPES,
  contents: NOTIFICATION_CONTENTS
};
