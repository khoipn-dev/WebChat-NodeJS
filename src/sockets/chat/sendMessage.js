import {
    pushSocketIDToArray,
    emitNotiToUser,
    removeSocketIDFromArray
} from "./../../helpers/socketHelper";

import ChatGroupModel from "./../../model/chatGroupModel";

/**
 *
 * @param {*} io from socket.io library
 */
let sendMessage = io => {
    let clients = {};
    io.on("connection", socket => {
        clients = pushSocketIDToArray(clients, socket.request.user._id, socket.id);

        socket.on("send-message", async (data) => {
            if (data.groupId) {
                let response = {
                    groupId: data.groupId,
                    senderId: socket.request.user._id,
                    message: data.message
                };

                let chatGroup = await ChatGroupModel.getChatGroupById(data.groupId);

                chatGroup.members.forEach(member => {
                    if (member.userId != socket.request.user._id && clients[member.userId]) {
                        emitNotiToUser(clients, member.userId, io, "response-send-message", response);
                    }
                });
            }

            if (data.contactId) {
                let response = {
                    senderId: socket.request.user._id,
                    message: data.message
                };
                // Nếu người dùng có ID = contactId online
                if (clients[data.contactId]) {
                    // Emit cho từng socketId của người dùng có ID = contactId
                    emitNotiToUser(clients, data.contactId, io, "response-send-message", response);
                }
            }

        });

        socket.on("send-image-message", async (data) => {
            if (data.groupId) {
                let response = {
                    groupId: data.groupId,
                    senderId: socket.request.user._id,
                    message: data.message
                };

                let chatGroup = await ChatGroupModel.getChatGroupById(data.groupId);

                chatGroup.members.forEach(member => {
                    if (member.userId != socket.request.user._id && clients[member.userId]) {
                        emitNotiToUser(clients, member.userId, io, "response-send-image-message", response);
                    }
                });
            }

            if (data.contactId) {
                let response = {
                    senderId: socket.request.user._id,
                    message: data.message
                };
                // Nếu người dùng có ID = contactId online
                if (clients[data.contactId]) {
                    // Emit cho từng socketId của người dùng có ID = contactId
                    emitNotiToUser(clients, data.contactId, io, "response-send-image-message", response);
                }
            }

        });

        socket.on("disconnect", () => {
            clients = removeSocketIDFromArray(
                clients,
                socket.request.user._id,
                socket
            );
        });
    });
};

module.exports = sendMessage;
