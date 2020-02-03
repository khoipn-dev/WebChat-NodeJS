import {
    pushSocketIDToArray,
    emitNotiToUser,
    removeSocketIDFromArray
} from "./../../helpers/socketHelper";

/**
 *
 * @param {*} io from socket.io library
 */
let typingRealtime = io => {
    let clients = {};
    io.on("connection", socket => {
        clients = pushSocketIDToArray(clients, socket.request.user._id, socket.id);

        socket.on("new-group-created", data => {
            data.groupChat.members.forEach(member => {
                if (member.userId != socket.request.user._id && clients[member.userId]) {
                    emitNotiToUser(clients, member.userId, io, "response-new-group-created", data);
                }
            });
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
