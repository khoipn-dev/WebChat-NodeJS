function typingOn(divId) {
    let targetId = $(`#write-chat-${divId}`).data("chat");
    if ($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
        socket.emit("user-typing-on", { groupId: targetId });
    } else {
        socket.emit("user-typing-on", { contactId: targetId});
    }
}

function typingOff(divId) {
    let targetId = $(`#write-chat-${divId}`).data("chat");
    if ($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
        socket.emit("user-typing-off", { groupId: targetId });
    } else {
        socket.emit("user-typing-off", { contactId: targetId});
    }
}

$(document).ready(function () {
    socket.on("response-user-typing-on", function (response) {
        let messageTyping =  `<div class="bubble you bubble-typing-gif"><img src="/images/chat/typing.gif"></div>`;
        let chatId = (response.groupId) ? response.groupId: response.senderId;
        let checkTypingExist = $(`.chat[data-chat=${chatId}]`).find('div.bubble-typing-gif');

        // Check nếu chưa có nút typing
        if (!checkTypingExist.length) {
            $(`.chat[data-chat=${chatId}]`).append(messageTyping);
            nineScrollRight(chatId);
        }
    });
    socket.on("response-user-typing-off", function (response) {
        let chatId = (response.groupId) ? response.groupId: response.senderId;
        $(`.chat[data-chat=${chatId}]`).find('div.bubble-typing-gif').remove();
        nineScrollRight(chatId);
    });
});