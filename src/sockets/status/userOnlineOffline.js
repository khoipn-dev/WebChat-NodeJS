import { pushSocketIDToArray, emitNotiToUser, removeSocketIDFromArray} from "./../../helpers/socketHelper";

/**
 *
 * @param {*} io from socket.io library
 */
let userOnlineOffline = io => {
    let clients = {};
    io.on("connection", socket => {
        clients = pushSocketIDToArray(clients, socket.request.user._id, socket.id);

        // Gửi list userId online khi người dùng đăng nhập hoặc f5 lại trang
        let listUserIdOnline = Object.keys(clients);
        socket.emit("server-send-list-user-online", listUserIdOnline);
        // Gửi id người dùng vừa online có tất cả user khác
        socket.broadcast.emit("server-send-when-has-user-online", socket.request.user._id);

        socket.on("disconnect", () => {
            clients = removeSocketIDFromArray(clients, socket.request.user._id, socket);
            // Gửi id người dùng vừa offline cho tất cả user khác
            socket.broadcast.emit("server-send-when-has-user-offline", socket.request.user._id);
        });
    });
};

module.exports = userOnlineOffline;
