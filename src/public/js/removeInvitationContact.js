function removeInvitationContact() {
    $(".user-remove-invitation-contact").unbind("click").on("click", function() {
        let targetId = $(this).data("uid");

        $.ajax({
            url: "/contact/remove-invitation-contact",
            type: "DELETE",
            data: { uid: targetId },
            success: function(data) {
                if (data.success) {
                    // Xoá thông báo
                    //$(".noti_content").find(`div[data-uid = ${user.id}]`).remove();
                    //$("ul.list-notifications").find(`li>div[data-uid = ${user.id}]`).parent().remove();
                    //decreaseNumberNotification("noti_contact_counter", 1);
                    //decreaseNumberNotification("noti_counter", 1);
                    decreaseNumberNotification("noti_contact_counter", 1);

                    decreaseNumberNotiContact("count-request-contact-received"); //calculateNotiContact.js

                    $("#request-contact-received").find(`li[data-uid=${targetId}]`).remove();

                    socket.emit("remove-invitation-contact", {contactId: targetId});
                }
            }
        });
    });
}

socket.on("response-remove-invitation-contact", (user) => {

    $("#find-user")
        .find(`div.user-remove-request-contact[data-uid = ${user.id}]`)
        .hide();
    $("#find-user")
        .find(`div.user-add-new-contact[data-uid = ${user.id}]`)
        .css("display", "inline-block");

    $("#request-contact-sent").find(`li[data-uid=${user.id}]`).remove();

    decreaseNumberNotiContact("count-request-contact-sent");
});

$(document).ready(function () {
    removeInvitationContact();
});
