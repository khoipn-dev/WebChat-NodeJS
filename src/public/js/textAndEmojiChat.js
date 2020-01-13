function textAndEmojiChat(inputChatId) {
    $(".emojionearea").unbind("keyup").on("keyup", function (element) {
        if (element.which === 13) {
            let targetId = $(`#write-chat-${inputChatId}`).data("chat");
            let message = $(`#write-chat-${inputChatId}`).val();

            if (!targetId || !message.length) {
                return false;
            }

            let dataForSend = {
                uid: targetId,
                message: message
            };

            if ($(`#write-chat-${inputChatId}`).hasClass("chat-in-group")) {
                dataForSend.isGroup = true;
            }

            $.post("/message/send", dataForSend, function (data) {
                // Success
            }).fail(function (res) {
                //Fail
            })
        }
    })
}