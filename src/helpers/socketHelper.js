export let pushSocketIDToArray = (clients, userID, socketID) => {
  if (clients[userID]) {
    clients[userID].push(socketID);
  } else {
    clients[userID] = [socketID];
  }
  return clients;
};

export let emitNotiToUser = (clients, userID, io, eventName, data) => {
  clients[userID].forEach(socketId =>
    io.sockets.connected[socketId].emit(eventName, data)
  );
};

export let removeSocketIDFromArray = (clients, userID, socket) => {
  //  Xoá socketID khi người dùng disconnect
  clients[userID] = clients[userID].filter(
    socketId => socketId !== socket.id
  );

  // Xoá key khỏi mảng khi người dùng tắt toàn bộ tab
  if (!clients[userID].length) {
    delete clients[userID];
  }
  return clients;
};
