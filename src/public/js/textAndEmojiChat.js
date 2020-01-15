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
                // Success
                let myMessage = $(`<div class="bubble me" data-mess-id="${data.message._id}"></div>`);
                myMessage.text(data.message.text);
                let converted = emojione.toImage(myMessage.text());

                if (dataForSend.isGroup) {
                    let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}">`;
                    myMessage.html(`${senderAvatar} ${converted}`);
                } else {
                    myMessage.html(converted);
                }

                // append tin nhắn
                $(`.right .chat[data-chat=${targetId}]`).append(myMessage);
                nineScrollRight(targetId);

                // Xoá message ở input
                $(`#write-chat-${inputChatId}`).val("");
                emojioneArea.find(".emojionearea-editor").text("");

                // Thay tin nhắn mới nhất ở leftside
                $(`.person[data-chat=${targetId}]`).find("span.time").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
                $(`.person[data-chat=${targetId}]`).find("span.preview").html(emojione.toImage(data.message.text));

                //Chuyển chat lên đầu
                $(`.person[data-chat=${targetId}]`).on("click.moveConversationToTop", function () {
                    let dataToMove = $(this).parent();
                    $(this).closest("ul").prepend(dataToMove);
                    $(this).off("click.moveConversationToTop");
                });
                $(`.person[data-chat=${targetId}]`).click();

            }).fail(function (res) {
                //Fail
                alertify.notify(res.responseText, "error", 3);
            })
        }
    })
}