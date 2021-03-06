import {
  pushSocketIDToArray,
  emitNotiToUser,
  removeSocketIDFromArray
} from "./../../helpers/socketHelper";

/**
 *
 * @param {*} io from socket.io library
 */
let removeRequestContact = io => {
  let clients = {};
  io.on("connection", socket => {
    clients = pushSocketIDToArray(clients, socket.request.user._id, socket.id);

    socket.on("remove-request-contact", data => {
      let currentUser = {
        id: socket.request.user._id
      };

      // Nếu người dùng có ID = contactId online
      if (clients[data.contactId]) {
        // Emit cho từng socketId của người dùng có ID = contactId
        emitNotiToUser(
          clients,
          data.contactId,
          io,
          "response-remove-request-contact",
          currentUser
        );
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

module.exports = removeRequestContact;
