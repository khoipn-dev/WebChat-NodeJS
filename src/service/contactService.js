import ContactModel from "./../model/contactModel";
import UserModel from "./../model/userModel";
import _ from "lodash";

let findUserContact = (currentUserId, keyword) => {
  return new Promise(async (resolve, reject) => {
    let deprecatedUserIds = [];
    let contactByUser = await ContactModel.findAllByUser(currentUserId);
    contactByUser.forEach(element => {
      deprecatedUserIds.push(element.userId);
      deprecatedUserIds.push(element.contactId);
    });
    deprecatedUserIds = _.uniqBy(deprecatedUserIds);

    let users = await UserModel.findUserForAddContact(deprecatedUserIds, keyword);
    resolve(users);
  })
}

module.exports = {
  findUserContact
}
