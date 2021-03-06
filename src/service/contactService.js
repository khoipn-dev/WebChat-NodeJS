import ContactModel from "./../model/contactModel";
import UserModel from "./../model/userModel";
import NotificationModel from "./../model/notificationModel";
import _ from "lodash";

const LIMIT_CONTACT = 10;

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

let searchFriend = (currentUserId, keyword) => {
  return new Promise(async (resolve, reject) => {
    let friendIds = [];
    let friends = await ContactModel.getFriend(currentUserId);

    friends.forEach(element => {
      friendIds.push(element.userId);
      friendIds.push(element.contactId);
    });

    friendIds = _.uniqBy(friendIds);
    friendIds = friendIds.filter(friendId => friendId != currentUserId);

    let users = await UserModel.findUserForAddChatGroup(friendIds, keyword);

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
      return reject(false);
    }


    // Tạo contact
    let newContactItem = {
      userId: currentUserId,
      contactId: contactId
    };

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

let removeContact = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let removeContact = await ContactModel.removeContact(currentUserId, contactId);
    if (removeContact.n === 0) {
      reject(false);
    }
    resolve(true);
  });
};

let removeRequest = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let removeReq = await ContactModel.removeRequest(currentUserId, contactId);
    if (removeReq.n === 0) {
      return reject(false);
    }

    // Xoá notification
    await NotificationModel.model.removeRequestContactNotification(currentUserId, contactId, NotificationModel.types.ADD_CONTACT);
    resolve(true);
  });
};

let removeInvitation= (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let removeReq = await ContactModel.removeInvitation(currentUserId, contactId);
    if (removeReq.n === 0) {
      return reject(false);
    }

    // Xoá notification
    //await NotificationModel.model.removeInvitationContactNotification(currentUserId, contactId, NotificationModel.types.ADD_CONTACT);
    resolve(true);
  });
};

let acceptInvitation= (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let acceptReq = await ContactModel.acceptInvitation(currentUserId, contactId);

    if (acceptReq.nModified === 0) {
      return reject(false);
    }

    // Tạo notification
    let newNotificationItem = {
      senderID: currentUserId,
      receiverID: contactId,
      type: NotificationModel.types.ACCEPT_CONTACT
    };

    await NotificationModel.model.createNew(newNotificationItem);
    resolve(true);
  });
};

let getContacts = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContacts(currentUserId, LIMIT_CONTACT);

      let users = contacts.map(async (contact) => {
        if (contact.contactId == currentUserId) {
          return await UserModel.getUserData(contact.userId);
        } else {
          return await UserModel.getUserData(contact.contactId);
        }
      });
      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

let getContactsSent = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContactsSent(currentUserId, LIMIT_CONTACT);

      let users = contacts.map(async (contact) => {
        return await UserModel.getUserData(contact.contactId);
      });
      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

let getContactsReceived = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContactsReceived(currentUserId, LIMIT_CONTACT);

      let users = contacts.map(async (contact) => {
        return await UserModel.getUserData(contact.userId);
      });
      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

let countContacts = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await ContactModel.countContacts(currentUserId);
      resolve(count);
    } catch (error) {
      reject(error);
    }
  });
};

let countContactsSent = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await ContactModel.countContactsSent(currentUserId);
      resolve(count);
    } catch (error) {
      reject(error);
    }
  });
};

let countContactsReceived = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await ContactModel.countContactsReceived(currentUserId);
      resolve(count);
    } catch (error) {
      reject(error);
    }
  });
};

let readMoreContacts = (currentUserId, skipNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      let nextContacts = await ContactModel.readMoreContacts(currentUserId, skipNumber, LIMIT_CONTACT);

      let users = nextContacts.map(async (contact) => {
        if (contact.contactId == currentUserId) {
          return await UserModel.getUserData(contact.userId);
        } else {
          return await UserModel.getUserData(contact.contactId);
        }
      });

      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

let readMoreContactsSent = (currentUserId, skipNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      let nextContactsSent = await ContactModel.readMoreContactsSent(currentUserId, skipNumber, LIMIT_CONTACT);

      let users = nextContactsSent.map(async (contact) => {
        return await UserModel.getUserData(contact.contactId);
      });

      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

let readMoreContactsReceived = (currentUserId, skipNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      let nextContactsReceived = await ContactModel.readMoreContactsReceived(currentUserId, skipNumber, LIMIT_CONTACT);

      let users = nextContactsReceived.map(async (contact) => {
        return await UserModel.getUserData(contact.userId);
      });

      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  findUserContact,
  searchFriend,
  addNew,
  removeContact,
  removeRequest,
  removeInvitation,
  acceptInvitation,
  getContacts,
  getContactsSent,
  getContactsReceived,
  countContacts,
  countContactsSent,
  countContactsReceived,
  readMoreContacts,
  readMoreContactsSent,
  readMoreContactsReceived
};
