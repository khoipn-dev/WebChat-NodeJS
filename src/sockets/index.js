import addNewContact from "./contact/addNewContact";
import removeRequestContact from "./contact/removeRequestContact";
import removeInvitationContact from "./contact/removeInvitationContact";
/**
 * 
 * @param {*} io from socket.io library
 */
let initSockets = (io) => {
  addNewContact(io);
  removeRequestContact(io);
  removeInvitationContact(io);
};

module.exports = initSockets;
