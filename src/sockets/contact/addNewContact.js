/**
 * 
 * @param {*} io from socket.io library
 */
let addNewContact = (io) => {
  io.on("connection", (socket) => {
    socket.on("add-new-contact", (data) => {
      console.log(socket.request.user);
    })
  })
}

module.exports = addNewContact;