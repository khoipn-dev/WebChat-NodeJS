function removeContact() {
    $(".user-remove-contact").unbind("click").on("click", function() {
        let targetId = $(this).data("uid");
        let targetUsername = $(this).parent().find("div.user-name p").text();

        Swal.fire({
            title: `Bạn chắc chắn muốn xoá ${targetUsername} khỏi danh bạ ?`,
            text: "Sau khi thực hiện bạn không thể hoàn tác lại. Hãy chắc chắn",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#2ECC71",
            cancelButtonColor: "#ff7675",
            confirmButtonText: "Xác nhận",
            cancelButtonText: "Huỷ"
        }).then((result) => {
            if (!result.value) {
                return false;
            }

            $.ajax({
                url: "/contact/remove-contact",
                type: "DELETE",
                data: { uid: targetId },
                success: function(data) {
                    if (data.success) {
                        $("#contacts").find(`ul li[data-uid = ${targetId}]`).remove();
                        decreaseNumberNotiContact("count-contacts");
                        socket.emit("remove-contact", {contactId: targetId});

                        // Check open screen chat
                        let isOpening = $("#all-chat").find(`li[data-chat=${targetId}]`).hasClass("active");

                        // Remove in left side
                        $("#all-chat").find(`ul a[href= "#uid_${targetId}"]`).remove();
                        $("#user-chat").find(`ul a[href= "#uid_${targetId}"]`).remove();

                        // Remove in right side
                        $("#screen-chat").find(`div#to_${targetId}`).remove();

                        // Remove image modal
                        $("body").find(`div#imagesModal_${targetId}`).remove();

                        // Remove attachment modal
                        $("body").find(`div#attachmentsModal_${targetId}`).remove();

                        if (isOpening) {
                            $("ul.people").find("a")[0].click();
                        }
                    }
                }
            });
        });
    });
}

socket.on("response-remove-contact", (user) => {
    $("#contacts").find(`ul li[data-uid = ${user.id}]`).remove();
    decreaseNumberNotiContact("count-contacts");

    // Check open screen chat
    let isOpening = $("#all-chat").find(`li[data-chat=${user.id}]`).hasClass("active");

    // Remove in left side
    $("#all-chat").find(`ul a[href= "#uid_${user.id}"]`).remove();
    $("#user-chat").find(`ul a[href= "#uid_${user.id}"]`).remove();

    // Remove in right side
    $("#screen-chat").find(`div#to_${user.id}`).remove();

    // Remove image modal
    $("body").find(`div#imagesModal_${user.id}`).remove();

    // Remove attachment modal
    $("body").find(`div#attachmentsModal_${user.id}`).remove();

    if (isOpening) {
        $("ul.people").find("a")[0].click();
    }
});

$(document).ready(function () {
    removeContact();
});
