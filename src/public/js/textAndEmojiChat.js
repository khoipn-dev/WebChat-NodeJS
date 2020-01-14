function textAndEmojiChat(inputChatId) {
    $(".emojionearea").unbind("keyup").on("keyup", function (element) {
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
                console.log(data);
            }).fail(function (res) {
                //Fail
                alertify.notify(res.responseText, "error", 3);
            })
        }
    })
}