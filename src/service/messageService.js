import ContactModel from "../model/contactModel";
import UserModel from "../model/userModel";
import ChatGroupModel from "../model/chatGroupModel";
import MessageModel from "../model/messageModel";
import _ from "lodash";
import { transError } from "../../lang/vi";
import { app } from "../config/app";
import fsExtra from "fs-extra";

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
                    conversation.messages = _.reverse(getMessages);
                } else {
                    let getMessages = await MessageModel.model.getPersonalMessages(currentUserId, conversation._id, LIMIT_MESSAGES);
                    conversation.messages = _.reverse(getMessages);
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

let addNewMessage = (sender, receiverId, messageContent, isGroup) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (isGroup) {
               let getChatGroup = await ChatGroupModel.getChatGroupById(receiverId);
               if (!getChatGroup) {
                   return reject(transError.conversation_not_found);
               }
               let receiver = { id: getChatGroup._id, name: getChatGroup.name, avatar: app.general_avatar_group_chat };

               let newMessageItem = {
                   senderId: sender.id,
                   receiverId: receiver.id,
                   conversationType: MessageModel.conversationType.GROUP,
                   messageType: MessageModel.messageType.TEXT,
                   sender: sender,
                   receiver: receiver,
                   text: messageContent,
                   createdAt: Date.now()
               };

               let newMessage = await MessageModel.model.createNew(newMessageItem);
               await ChatGroupModel.updateWhenHasNewMessage(getChatGroup._id, getChatGroup.messageAmount + 1);
               resolve(newMessage);
            } else {
                let getUserReceiver = await UserModel.getUserData(receiverId);

                if (!getUserReceiver) {
                    return reject(transError.conversation_not_found);
                }
                let receiver = { id: getUserReceiver._id, name: getUserReceiver.username, avatar: getUserReceiver.avatar };

                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiver.id,
                    conversationType: MessageModel.conversationType.PERSONAL,
                    messageType: MessageModel.messageType.TEXT,
                    sender: sender,
                    receiver: receiver,
                    text: messageContent,
                    createdAt: Date.now()
                };

                let newMessage = await MessageModel.model.createNew(newMessageItem);
                await ContactModel.updateWhenHasNewMessage(sender.id, receiver.id);
                resolve(newMessage);
            }
        } catch (e) {
            reject(e);
        }
    });
};

let addNewImageMessage = (sender, receiverId, messageContent, isGroup) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (isGroup) {
                let getChatGroup = await ChatGroupModel.getChatGroupById(receiverId);
                if (!getChatGroup) {
                    return reject(transError.conversation_not_found);
                }
                let receiver = { id: getChatGroup._id, name: getChatGroup.name, avatar: app.general_avatar_group_chat };

                let imageBuffer = await fsExtra.readFile(messageContent.path);
                let imageContentType = messageContent.mimetype;
                let imageName = messageContent.originalname;
                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiver.id,
                    conversationType: MessageModel.conversationType.GROUP,
                    messageType: MessageModel.messageType.IMAGE,
                    sender: sender,
                    receiver: receiver,
                    file: { data: imageBuffer, contentType: imageContentType, fileName: imageName },
                    createdAt: Date.now()
                };

                let newMessage = await MessageModel.model.createNew(newMessageItem);
                await ChatGroupModel.updateWhenHasNewMessage(getChatGroup._id, getChatGroup.messageAmount + 1);
                resolve(newMessage);
            } else {
                let getUserReceiver = await UserModel.getUserData(receiverId);

                if (!getUserReceiver) {
                    return reject(transError.conversation_not_found);
                }
                let receiver = { id: getUserReceiver._id, name: getUserReceiver.username, avatar: getUserReceiver.avatar };
                let imageBuffer = await fsExtra.readFile(messageContent.path);
                let imageContentType = messageContent.mimetype;
                let imageName = messageContent.originalname;
                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiver.id,
                    conversationType: MessageModel.conversationType.PERSONAL,
                    messageType: MessageModel.messageType.IMAGE,
                    sender: sender,
                    receiver: receiver,
                    file: { data: imageBuffer, contentType: imageContentType, fileName: imageName },
                    createdAt: Date.now()
                };

                let newMessage = await MessageModel.model.createNew(newMessageItem);
                await ContactModel.updateWhenHasNewMessage(sender.id, receiver.id);
                resolve(newMessage);
            }
        } catch (e) {
            reject(e);
        }
    });
};

let addNewAttachmentMessage = (sender, receiverId, messageContent, isGroup) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (isGroup) {
                let getChatGroup = await ChatGroupModel.getChatGroupById(receiverId);
                if (!getChatGroup) {
                    return reject(transError.conversation_not_found);
                }
                let receiver = { id: getChatGroup._id, name: getChatGroup.name, avatar: app.general_avatar_group_chat };

                let attachmentBuffer = await fsExtra.readFile(messageContent.path);
                let attachmentContentType = messageContent.mimetype;
                let attachmentName = messageContent.originalname;
                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiver.id,
                    conversationType: MessageModel.conversationType.GROUP,
                    messageType: MessageModel.messageType.FILE,
                    sender: sender,
                    receiver: receiver,
                    file: { data: attachmentBuffer, contentType: attachmentContentType, fileName: attachmentName },
                    createdAt: Date.now()
                };

                let newMessage = await MessageModel.model.createNew(newMessageItem);
                await ChatGroupModel.updateWhenHasNewMessage(getChatGroup._id, getChatGroup.messageAmount + 1);
                resolve(newMessage);
            } else {
                let getUserReceiver = await UserModel.getUserData(receiverId);

                if (!getUserReceiver) {
                    return reject(transError.conversation_not_found);
                }
                let receiver = { id: getUserReceiver._id, name: getUserReceiver.username, avatar: getUserReceiver.avatar };
                let attachmentBuffer = await fsExtra.readFile(messageContent.path);
                let attachmentContentType = messageContent.mimetype;
                let attachmentName = messageContent.originalname;
                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiver.id,
                    conversationType: MessageModel.conversationType.PERSONAL,
                    messageType: MessageModel.messageType.FILE,
                    sender: sender,
                    receiver: receiver,
                    file: { data: attachmentBuffer, contentType: attachmentContentType, fileName: attachmentName },
                    createdAt: Date.now()
                };

                let newMessage = await MessageModel.model.createNew(newMessageItem);
                await ContactModel.updateWhenHasNewMessage(sender.id, receiver.id);
                resolve(newMessage);
            }
        } catch (e) {
            reject(e);
        }
    });
};

let readMoreAllChat = (currentUserId, skipPersonal, skipGroup) => {
    return new Promise(async (resolve, reject) => {
        try {
            let contacts = await ContactModel.readMoreContacts(currentUserId, skipPersonal, LIMIT_CONVERSATIONS);

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
            let groupConversations = await ChatGroupModel.readMoreChatGroups(currentUserId, skipGroup, LIMIT_CONVERSATIONS);
            let allConversations = userConversations.concat(groupConversations);

            // Sắp xếp theo updatedAt
            allConversations = _.sortBy(allConversations, (item) => {
                return -item.updatedAt;
            });

            let allConversationWithMessagesPromise = allConversations.map(async (conversation) => {
                conversation = conversation.toObject();
                if (conversation.members) {
                    let getMessages = await MessageModel.model.getGroupMessages(conversation._id, LIMIT_MESSAGES);
                    conversation.messages = _.reverse(getMessages);
                } else {
                    let getMessages = await MessageModel.model.getPersonalMessages(currentUserId, conversation._id, LIMIT_MESSAGES);
                    conversation.messages = _.reverse(getMessages);
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

let readMore = (currentUserId, skipMessage, targetId, isChatGroup) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (isChatGroup) {
                let getMessages = await MessageModel.model.readMoreGroupMessages(targetId, skipMessage, LIMIT_MESSAGES);
                getMessages = _.reverse(getMessages);
                return resolve(getMessages);
            }

            let getMessages = await MessageModel.model.readMorePersonalMessages(currentUserId, targetId, skipMessage, LIMIT_MESSAGES);
            getMessages = _.reverse(getMessages);
            return resolve(getMessages);

        } catch (error) {
            reject(error);
        }
    })
};

module.exports = {
    getAllConversationItems,
    addNewMessage,
    addNewImageMessage,
    addNewAttachmentMessage,
    readMoreAllChat,
    readMore
};
