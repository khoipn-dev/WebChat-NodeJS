import addNewContact from "./contact/addNewContact";
import removeRequestContact from "./contact/removeRequestContact";
import removeInvitationContact from "./contact/removeInvitationContact";
import acceptInvitationContact from "./contact/acceptInvitationContact";

/**
 * 
 * @param {*} io from socket.io library
 */
let initSockets = (io) => {
  addNewContact(io);
  removeRequestContact(io);
  removeInvitationContact(io);
  acceptInvitationContact(io);
};

module.exports = initSockets;
