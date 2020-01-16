function chatAttachment(divId) {
    $(`#attachment-chat-${divId}`).unbind("change").on("change", function () {
        let fileData = $(this).prop("files")[0];
        let limit = 1000000; //byte = 1MB

        if (fileData.size > limit) {
            alertify.notify("Tối đa cho phép là 1MB", "error", 7);
            $(this).val(null);
            return false;
        }

        let targetId = $(this).data("chat");
        let isGroup = false;
        let $AttachmentFormData = new FormData();
        $AttachmentFormData.append("attachment-message", fileData);
        $AttachmentFormData.append("uid", targetId);

        if ($(this).hasClass("chat-in-group")) {
            $AttachmentFormData.append("isGroup", true);
            isGroup = true;
        }

        $.ajax({
            url: "/message/attachment",
            type: "POST",
            cache: false,
            contentType: false,
            processData: false,
            data: $AttachmentFormData,
            success: function (data) {
                let dataForEmit = {
                    message: data.message
                };
                // Tạo html
                let myMessage = $(`<div class="bubble me bubble-attachment-file" data-mess-id="${data.message._id}"></div>`);
                let attachmentChat = `<a href="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}" download="${data.message.file.fileName}">${data.message.file.fileName}</a>`;
                if (isGroup) {
                    let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}">`;
                    myMessage.html(`${senderAvatar} ${attachmentChat}`);
                    dataForEmit.groupId = targetId;
                } else {
                    myMessage.html(attachmentChat);
                    dataForEmit.contactId = targetId;
                }

                // append tin nhắn
                $(`.right .chat[data-chat=${targetId}]`).append(myMessage);
                nineScrollRight(targetId);

                // Thay tin nhắn mới nhất ở leftside
                $(`.person[data-chat=${targetId}]`).find("span.time").removeClass("not-seen").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
                $(`.person[data-chat=${targetId}]`).find("span.preview").html("Tệp đính kèm");

                //Chuyển chat lên đầu
                $(`.person[data-chat=${targetId}]`).on("event.moveConversationToTop", function () {
                    let dataToMove = $(this).parent();
                    $(this).closest("ul").prepend(dataToMove);
                    $(this).off("event.moveConversationToTop");
                });
                $(`.person[data-chat=${targetId}]`).trigger("event.moveConversationToTop");

                // Emit realtime
                socket.emit("send-attachment-message", dataForEmit);

                // Thêm tệp vào modal attachment
                let attachmentChatModal = `<li><a href="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}" download="${data.message.file.fileName}">${data.message.file.fileName}</a></li>`;
                $(`#attachmentsModal_${divId}`).find("ul.list-attachments").append(attachmentChatModal);

            },
            error: function (error) {
                alertify.notify(error.responseText, "error", 5);
            }
        });


    })
}

$(document).ready(function () {
    socket.on("response-send-attachment-message", function (data) {
        let targetId = null;
        let receivedMessage = $(`<div class="bubble you bubble-attachment-file" data-mess-id="${data.message._id}"></div>`);
        let attachmentChat = `<a href="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}" download="${data.message.file.fileName}">${data.message.file.fileName}</a>`;

        if (data.groupId) {
            let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}">`;
            receivedMessage.html(`${senderAvatar} ${attachmentChat}`);
            targetId = data.groupId;
        } else {
            receivedMessage.html(attachmentChat);
            targetId = data.senderId;
        }

        // append tin nhắn
        $(`.right .chat[data-chat=${targetId}]`).append(receivedMessage);
        nineScrollRight(targetId);

        // Thay tin nhắn mới nhất ở leftside
        $(`.person[data-chat=${targetId}]`).find("span.time").addClass("not-seen").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
        $(`.person[data-chat=${targetId}]`).find("span.preview").html("Tệp đính kèm");

        //Chuyển chat lên đầu
        $(`.person[data-chat=${targetId}]`).on("event.moveConversationToTop", function () {
            let dataToMove = $(this).parent();
            $(this).closest("ul").prepend(dataToMove);
            $(this).off("event.moveConversationToTop");
        });
        $(`.person[data-chat=${targetId}]`).trigger("event.moveConversationToTop");

        // Thêm tệp vào modal attachment
        let attachmentChatModal = `<li><a href="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}" download="${data.message.file.fileName}">${data.message.file.fileName}</a></li>`;
        $(`#attachmentsModal_${targetId}`).find("ul.list-attachments").append(attachmentChatModal);
    })
});
