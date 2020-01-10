import ContactModel from "../model/contactModel";
import UserModel from "../model/userModel";
import ChatGroupModel from "../model/chatGroupModel";
import _ from "lodash";
import it from "../public/bower_components/moment/src/locale/it";

const LIMIT_CONVERSATIONS = 15;

let getAllConversationItems = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let contacts = await ContactModel.getContacts(currentUserId, LIMIT_CONVERSATIONS);

            let userConversationsPromise = contacts.map(async (contact) => {
                if (contact.contactId == currentUserId) {
                    let getUserContact = await UserModel.getUserData(contact.userId);
                    getUserContact.updatedAt = contact.updatedAt;
                    return getUserContact;
                } else {
                    let getUserContact = await UserModel.getUserData(contact.contactId);
                    getUserContact.updatedAt = contact.updatedAt;
                    return getUserContact;
                }
            });

            let userConversations = await Promise.all(userConversationsPromise);
            let groupConversations = await ChatGroupModel.getChatGroups(currentUserId, LIMIT_CONVERSATIONS);
            let allConversations = userConversations.concat(groupConversations);

            // Sắp xếp theo updatedAt
            allConversations = _.sortBy(allConversations, (item) => {
                return -item.updatedAt;
            });

            resolve({
                userConversations,
                groupConversations,
                allConversations
            });
        } catch (error) {
            reject(error);
        }
    })
};
module.exports = {
    getAllConversationItems,
};
