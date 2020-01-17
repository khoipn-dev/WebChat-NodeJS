import {pushSocketIDToArray, emitNotiToUser, removeSocketIDFromArray} from "./../../helpers/socketHelper";
import ChatGroupModel from "./../../model/chatGroupModel";

/**
 *
 * @param {*} io from socket.io library
 */
let callVideo = io => {
    let clients = {};
    io.on("connection", socket => {
        clients = pushSocketIDToArray(clients, socket.request.user._id, socket.id);

        socket.on("check-listener-online", async (data) => {
            if (clients[data.listenerId]) {
                //Listener online
                let response = {
                    callerId: socket.request.user._id,
                    callerName: data.callerName,
                    listenerId: data.listenerId
                };

                emitNotiToUser(clients, data.listenerId, io, "request-peerId-listener", response);
            } else {
                //Listener offline
                socket.emit("listener-offline");
            }
        });

        socket.on("listener-send-peerId", (data) => {
            if (clients[data.callerId]) {
                emitNotiToUser(clients, data.callerId, io, "server-send-listener-peerId-to-caller", data);
            }
        });

        socket.on("caller-request-call-to-server", (data) => {
            if (clients[data.listenerId]) {
                emitNotiToUser(clients, data.listenerId, io, "server-send-request-call-to-listener", data);
            }
        });

        socket.on("caller-cancel-request-to-server", (data) => {
            if (clients[data.listenerId]) {
                emitNotiToUser(clients, data.listenerId, io, "server-send-cancel-request-call-to-listener", data);
            }
        });

        socket.on("listener-reject-request-call-to-server", (data) => {
            if (clients[data.callerId]) {
                emitNotiToUser(clients, data.callerId, io, "server-send-reject-request-call-to-caller", data);
            }
        });

        socket.on("listener-accept-request-call-to-server", (data) => {
            if (clients[data.callerId]) {
                emitNotiToUser(clients, data.callerId, io, "server-send-accept-request-call-to-caller", data);
            }
            if (clients[data.listenerId]) {
                emitNotiToUser(clients, data.listenerId, io, "server-send-accept-request-call-to-listener", data);
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

module.exports = callVideo;
