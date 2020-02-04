function readMoreMessage() {
    $(".right .chat").scroll(function () {
        let $DOMElement = $(this);
        // Reference tin nhắn đầu tiên
        let firstMessage = $(this).find(".bubble:first");
        // Lấy toạ độ của tin nhắn đầu tiên
        let currentOffset = firstMessage.offset().top - $(this).scrollTop();

        if ($(this).scrollTop() === 0) {
            // let iconLoadingMessage = `<img src="images/chat/message-loading.gif" class="message-loading"/>`;
            // $(this).prepend(iconLoadingMessage);


            let targetId = $(this).data("chat");
            let skipMessage = $(this).find("div.bubble").length;
            let isChatGroup = $(this).hasClass("chat-in-group") ? true : false;

            $.get(`/message/read-more?skipMessage=${skipMessage}&targetId=${targetId}&isChatGroup=${isChatGroup}`, function (data) {
                if (data.rightSideHTML.trim() === "") {
                    alertify.notify("Bạn không còn tin nhắn", "error", 5);
                    // $DOMElement.find("img.message-loading").remove();
                    return false;
                }
                // Thêm tin nhắn
                $(`.right .chat[data-chat=${targetId}]`).prepend(data.rightSideHTML);
                convertEmoji();

                $(`.right .chat[data-chat=${targetId}]`).scrollTop(firstMessage.offset().top - currentOffset);

                // Thêm ảnh vào image modal
                $(`#imagesModal_${targetId}`).find("div.all-images").append(data.imageModalHTML);
                gridPhotos(5);

                // Thêm attach vào modal
                $(`#attachmentsModal_${targetId}`).find("ul.list-attachments").append(data.attachmentModalHTML);

                // Tắt loading
                $DOMElement.find("img.message-loading").remove();
            });
        }
    });
}

$(document).ready(function () {
    readMoreMessage();
});