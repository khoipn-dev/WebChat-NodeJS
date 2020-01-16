function bufferToBase64(buffer) {
    return btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
}

function chatImage(divId) {
    $(`#image-chat-${divId}`).unbind("change").on("change", function () {
        let fileData = $(this).prop("files")[0];
        let math = ["image/png", "image/jpg", "image/jpeg"];
        let limit = 1000000; //byte = 1MB

        if ($.inArray(fileData.type, math) === -1) {
            alertify.notify("Kiểu file không hợp lệ. Chỉ chấp nhận png & jpg", "error", 7);
            $(this).val(null);
            return false;
        }

        if (fileData.size > limit) {
            alertify.notify("Tối đa cho phép là 1MB", "error", 7);
            $(this).val(null);
            return false;
        }

        let targetId = $(this).data("chat");
        let isGroup = false;
        let $ImageFormData = new FormData();
        $ImageFormData.append("image-message", fileData);
        $ImageFormData.append("uid", targetId);

        if ($(this).hasClass("chat-in-group")) {
            $ImageFormData.append("isGroup", true);
            isGroup = true;
        }

        $.ajax({
            url: "/message/image",
            type: "POST",
            cache: false,
            contentType: false,
            processData: false,
            data: $ImageFormData,
            success: function (data) {
                let dataForEmit = {
                    message: data.message
                };
                // Success
                let myMessage = $(`<div class="bubble me bubble-image-file" data-mess-id="${data.message._id}"></div>`);
                let imageChat = `<img src="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}" class="show-image-chat">`;

                if (isGroup) {
                    let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}">`;
                    myMessage.html(`${senderAvatar} ${imageChat}`);
                    dataForEmit.groupId = targetId;
                } else {
                    myMessage.html(imageChat);
                    dataForEmit.contactId = targetId;
                }

                // append tin nhắn
                $(`.right .chat[data-chat=${targetId}]`).append(myMessage);
                nineScrollRight(targetId);

                // Thay tin nhắn mới nhất ở leftside
                $(`.person[data-chat=${targetId}]`).find("span.time").removeClass("not-seen").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
                $(`.person[data-chat=${targetId}]`).find("span.preview").html("Hình ảnh");

                //Chuyển chat lên đầu
                $(`.person[data-chat=${targetId}]`).on("event.moveConversationToTop", function () {
                    let dataToMove = $(this).parent();
                    $(this).closest("ul").prepend(dataToMove);
                    $(this).off("event.moveConversationToTop");
                });
                $(`.person[data-chat=${targetId}]`).trigger("event.moveConversationToTop");

                // Emit realtime
                socket.emit("send-image-message", dataForEmit);

                // Thêm ảnh vào modal hình ảnh
                let imageChatModal = `<img src="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}">`;
                $(`#imagesModal_${divId}`).find("div.all-images").append(imageChatModal);
            },
            error: function (error) {
                alertify.notify(error.responseText, "error", 5);
            }
        });
    });
}

$(document).ready(function () {
    socket.on("response-send-image-message", function (data) {
        let targetId = null;
        let receivedMessage = $(`<div class="bubble you bubble-image-file" data-mess-id="${data.message._id}"></div>`);
        let imageChat = `<img src="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}" class="show-image-chat">`;

        if (data.groupId) {
            let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}">`;
            receivedMessage.html(`${senderAvatar} ${imageChat}`);
            targetId = data.groupId;
        } else {
            receivedMessage.html(imageChat);
            targetId = data.senderId;
        }

        // append tin nhắn
        $(`.right .chat[data-chat=${targetId}]`).append(receivedMessage);
        nineScrollRight(targetId);

        // Thay tin nhắn mới nhất ở leftside
        $(`.person[data-chat=${targetId}]`).find("span.time").addClass("not-seen").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
        $(`.person[data-chat=${targetId}]`).find("span.preview").html("Hình ảnh");

        //Chuyển chat lên đầu
        $(`.person[data-chat=${targetId}]`).on("event.moveConversationToTop", function () {
            let dataToMove = $(this).parent();
            $(this).closest("ul").prepend(dataToMove);
            $(this).off("event.moveConversationToTop");
        });
        $(`.person[data-chat=${targetId}]`).trigger("event.moveConversationToTop");

        // Thêm ảnh vào modal hình ảnh
        let imageChatModal = `<img src="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}">`;
        $(`#imagesModal_${targetId}`).find("div.all-images").append(imageChatModal);
    })
});
