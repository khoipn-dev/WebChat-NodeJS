import ContactModel from "../model/contactModel";
import UserModel from "../model/userModel";
import ChatGroupModel from "../model/chatGroupModel";
import MessageModel from "../model/messageModel";
import _ from "lodash";
import it from "../public/bower_components/moment/src/locale/it";

const LIMIT_CONVERSATIONS = 15;
const LIMIT_MESSAGES = 30;

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

            let allConversationWithMessagesPromise = allConversations.map(async (conversation) => {
                conversation = conversation.toObject();
                if (conversation.members) {
                    let getMessages = await MessageModel.model.getGroupMessages(conversation._id, LIMIT_MESSAGES);
                    conversation.messages = getMessages;
                } else {
                    let getMessages = await MessageModel.model.getPersonalMessages(currentUserId, conversation._id, LIMIT_MESSAGES);
                    conversation.messages = getMessages;
                }
               return conversation;
            });

            let allConversationWithMessages = await Promise.all(allConversationWithMessagesPromise);
            // Sắp xếp lại theo updatedAt
            allConversationWithMessages = _.sortBy(allConversationWithMessages, (item) => { return -item.updatedAt;});

            resolve(allConversationWithMessages);
        } catch (error) {
            reject(error);
        }
    })
};
module.exports = {
    getAllConversationItems,
};
