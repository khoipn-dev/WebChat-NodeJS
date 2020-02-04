$(document).ready(function() {
    $("#link-read-more-all-chat").bind("click", function() {
        let skipPersonal = $("#all-chat").find("li:not(.group-chat)").length;
        let skipGroup = $("#all-chat").find("li.group-chat").length;

        $("#link-read-more-all-chat").css("display", "none");
        $(".read-more-loader-all-chat").css("display", "inline-block");

        $.get(`/message/read-more-all-chat?skipPersonal=${skipPersonal}&skipGroup=${skipGroup}`, function(data) {
            // {leftSideHTML, rightSideHTML, imageModalHTML, attachmentModalHTML}
            if (data.leftSideHTML.trim() === "") {
                alertify.notify("Bạn không còn cuộc trò chuyện", "error", 5);
                $("#link-read-more-all-chat").css("display", "inline-block");
                $(".read-more-loader-all-chat").css("display", "none");
                return false;
            }

            $("#all-chat").find("ul").append(data.leftSideHTML);
            resizeNineScrollLeft();
            nineScrollLeft();

            $("#screen-chat").append(data.rightSideHTML);
            changeScreenChat();
            convertEmoji();

            $("body").append(data.imageModalHTML);
            gridPhotos(5);
            $("body").append(data.attachmentModalHTML);


            $("#link-read-more-all-chat").css("display", "inline-block");
            $(".read-more-loader-all-chat").css("display", "none");

        });
    });
});
