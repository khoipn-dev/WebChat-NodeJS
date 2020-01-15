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
let typingRealtime = io => {
    let clients = {};
    io.on("connection", socket => {
        clients = pushSocketIDToArray(clients, socket.request.user._id, socket.id);

        socket.on("user-typing-on", async (data) => {
            if (data.groupId) {
                let response = {
                    groupId: data.groupId,
                    senderId: socket.request.user._id
                };

                let chatGroup = await ChatGroupModel.getChatGroupById(data.groupId);

                chatGroup.members.forEach(member => {
                    if (member.userId != socket.request.user._id && clients[member.userId]) {
                        emitNotiToUser(clients, member.userId, io, "response-user-typing-on", response);
                    }
                });
            }

            if (data.contactId) {
                let response = {senderId: socket.request.user._id};
                if (clients[data.contactId]) {
                    emitNotiToUser(clients, data.contactId, io, "response-user-typing-on", response);
                }
            }

        });

        socket.on("user-typing-off", async (data) => {
            if (data.groupId) {
                let response = {
                    groupId: data.groupId,
                    senderId: socket.request.user._id
                };

                let chatGroup = await ChatGroupModel.getChatGroupById(data.groupId);

                chatGroup.members.forEach(member => {
                    if (member.userId != socket.request.user._id && clients[member.userId]) {
                        emitNotiToUser(clients, member.userId, io, "response-user-typing-off", response);
                    }
                });
            }

            if (data.contactId) {
                let response = {senderId: socket.request.user._id};
                if (clients[data.contactId]) {
                    emitNotiToUser(clients, data.contactId, io, "response-user-typing-off", response);
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

module.exports = typingRealtime;
