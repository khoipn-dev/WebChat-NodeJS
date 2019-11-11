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
                    }
                }
            });
        });
    });
}

socket.on("response-remove-contact", (user) => {
    $("#contacts").find(`ul li[data-uid = ${user.id}]`).remove();
    decreaseNumberNotiContact("count-contacts");
});

$(document).ready(function () {
    removeContact();
});
