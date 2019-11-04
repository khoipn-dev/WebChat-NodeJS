import {
    pushSocketIDToArray,
    emitNotiToUser,
    removeSocketIDFromArray
} from "./../../helpers/socketHelper";

/**
 *
 * @param {*} io from socket.io library
 */
let acceptInvitationContact = io => {
    let clients = {};
    io.on("connection", socket => {
        clients = pushSocketIDToArray(clients, socket.request.user._id, socket.id);

        socket.on("accept-invitation-contact", data => {
            let currentUser = {
                id: socket.request.user._id,
                username: socket.request.user.username,
                avatar: socket.request.user.avatar,
                address: (socket.request.user.address !== 0) ? socket.request.user.address : "",
            };

            // Nếu người dùng có ID = contactId online
            if (clients[data.contactId]) {
                // Emit cho từng socketId của người dùng có ID = contactId
                emitNotiToUser(clients, data.contactId, io, "response-accept-invitation-contact", currentUser);
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

module.exports = acceptInvitationContact;
