import ContactModel from "./../model/contactModel";
import UserModel from "./../model/userModel";
import NotificationModel from "./../model/notificationModel";
import _ from "lodash";

let findUserContact = (currentUserId, keyword) => {
  return new Promise(async (resolve, reject) => {
    let deprecatedUserIds = [currentUserId];
    let contactByUser = await ContactModel.findAllByUser(currentUserId);
    contactByUser.forEach(element => {
      deprecatedUserIds.push(element.userId);
      deprecatedUserIds.push(element.contactId);
    });
    deprecatedUserIds = _.uniqBy(deprecatedUserIds);

    let users = await UserModel.findUserForAddContact(
      deprecatedUserIds,
      keyword
    );
    resolve(users);
  });
};

let addNew = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let contactExists = await ContactModel.checkExists(
      currentUserId,
      contactId
    );
    if (contactExists) {
      reject(false);
    }


    // Tạo contact
    let newContactItem = {
      userId: currentUserId,
      contactId: contactId
    }
    let newContact = await ContactModel.createNew(newContactItem);

    // Tạo notification
    let newNotificationItem = {
      senderID: currentUserId,
      receiverID: contactId,
      type: NotificationModel.types.ADD_CONTACT
    };

    await NotificationModel.model.createNew(newNotificationItem);

    resolve(newContact);
  });
};


let removeRequest = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let removeReq = await ContactModel.removeRequest(currentUserId, contactId);
    if (removeReq.n === 0) {
      reject(false);
    }

    // Xoá notification
    await NotificationModel.model.removeRequestContactNotification(currentUserId, contactId, NotificationModel.types.ADD_CONTACT);
    resolve(true);
  });
};

module.exports = {
  findUserContact,
  addNew,
  removeRequest
};
