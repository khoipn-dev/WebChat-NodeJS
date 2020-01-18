import addNewContact from "./contact/addNewContact";
import removeRequestContact from "./contact/removeRequestContact";
import removeInvitationContact from "./contact/removeInvitationContact";
import acceptInvitationContact from "./contact/acceptInvitationContact";
import removeContact from "./contact/removeContact";
import sendMessage from "./chat/sendMessage";
import typingRealtime from "./chat/typingRealtime";
import callVideo from "./chat/callVideo";
import userOnlineOffline from "./status/userOnlineOffline";

/**
 * 
 * @param {*} io from socket.io library
 */
let initSockets = (io) => {
  addNewContact(io);
  removeRequestContact(io);
  removeInvitationContact(io);
  acceptInvitationContact(io);
  removeContact(io);
  sendMessage(io);
  typingRealtime(io);
  callVideo(io);
  userOnlineOffline(io);
};

module.exports = initSockets;
