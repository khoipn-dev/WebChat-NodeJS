function textAndEmojiChat(inputChatId) {
    $(".emojionearea").unbind("keyup").on("keyup", function (element) {
        let emojioneArea = $(this);
        if (element.which === 13) {
            let targetId = $(`#write-chat-${inputChatId}`).data("chat");
            let messageContent = $(`#write-chat-${inputChatId}`).val();

            if (!targetId || !messageContent.length) {
                return false;
            }

            let dataForSend = {
                uid: targetId,
                messageContent: messageContent
            };

            if ($(`#write-chat-${inputChatId}`).hasClass("chat-in-group")) {
                dataForSend.isGroup = true;
            }

            $.post("/message/send", dataForSend, function (data) {
                let dataForEmit = {
                    message: data.message
                };
                // Success
                let myMessage = $(`<div class="bubble me" data-mess-id="${data.message._id}"></div>`);
                myMessage.text(data.message.text);
                let converted = emojione.toImage(myMessage.text());

                if (dataForSend.isGroup) {
                    let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}">`;
                    myMessage.html(`${senderAvatar} ${converted}`);
                    dataForEmit.groupId = targetId;
                } else {
                    myMessage.html(converted);
                    dataForEmit.contactId = targetId;
                }

                // append tin nhắn
                $(`.right .chat[data-chat=${targetId}]`).append(myMessage);
                nineScrollRight(targetId);

                // Xoá message ở input
                $(`#write-chat-${inputChatId}`).val("");
                emojioneArea.find(".emojionearea-editor").text("");

                // Thay tin nhắn mới nhất ở leftside
                $(`.person[data-chat=${targetId}]`).find("span.time").removeClass("not-seen").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
                $(`.person[data-chat=${targetId}]`).find("span.preview").html(emojione.toImage(data.message.text));

                //Chuyển chat lên đầu
                $(`.person[data-chat=${targetId}]`).on("event.moveConversationToTop", function () {
                    let dataToMove = $(this).parent();
                    $(this).closest("ul").prepend(dataToMove);
                    $(this).off("event.moveConversationToTop");
                });
                $(`.person[data-chat=${targetId}]`).trigger("event.moveConversationToTop");

                // check nếu có typing gif thì chuyển xuống dưới
                let checkTypingExist = $(`.chat[data-chat=${targetId}]`).find('div.bubble-typing-gif');
                if (checkTypingExist.length) {
                    $(`.chat[data-chat=${targetId}]`).append(checkTypingExist);
                }

                // Emit socket
                typingOff(targetId);
                socket.emit("send-message", dataForEmit);

            }).fail(function (res) {
                //Fail
                alertify.notify(res.responseText, "error", 3);
            })
        }
    })
}

$(document).ready(function () {
    socket.on("response-send-message", function (response) {
        let targetId = null;
        let receivedMessage = $(`<div class="bubble you" data-mess-id="${response.message._id}"></div>`);
        receivedMessage.text(response.message.text);
        let converted = emojione.toImage(receivedMessage.text());

        if (response.groupId) {
            let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}">`;
            receivedMessage.html(`${senderAvatar} ${converted}`);
            targetId = response.groupId;
        } else {
            receivedMessage.html(converted);
            targetId = response.senderId;
        }

        // append tin nhắn
        $(`.right .chat[data-chat=${targetId}]`).append(receivedMessage);
        nineScrollRight(targetId);

        // Thay tin nhắn mới nhất ở leftside
        $(`.person[data-chat=${targetId}]`).find("span.time").addClass("not-seen").html(moment(response.message.createdAt).locale("vi").startOf("seconds").fromNow());
        $(`.person[data-chat=${targetId}]`).find("span.preview").html(emojione.toImage(response.message.text));

        //Chuyển chat lên đầu
        $(`.person[data-chat=${targetId}]`).on("event.moveConversationToTop", function () {
            let dataToMove = $(this).parent();
            $(this).closest("ul").prepend(dataToMove);
            $(this).off("event.moveConversationToTop");
        });
        $(`.person[data-chat=${targetId}]`).trigger("event.moveConversationToTop");
    })
});