function removeRequestContact() {
  $(".user-remove-request-contact").unbind("click").on("click", function() {
    let targetId = $(this).data("uid");

    $.ajax({
      url: "/contact/remove-request-contact",
      type: "DELETE",
      data: { uid: targetId },
      success: function(data) {
        if (data.success) {
          $("#find-user")
            .find(`div.user-remove-request-contact[data-uid = ${targetId}]`)
            .hide();
          $("#find-user")
            .find(`div.user-add-new-contact[data-uid = ${targetId}]`)
            .css("display", "inline-block");

          decreaseNumberNotification("noti_contact_counter", 1);

          decreaseNumberNotiContact("count-request-contact-sent"); //calculateNotiContact.js

          $("#request-contact-sent").find(`li[data-uid=${targetId}]`).remove();

          socket.emit("remove-request-contact", {contactId: targetId});
        }
      }
    });
  });
}

socket.on("response-remove-request-contact", (user) => {
  
  $(".noti_content").find(`div[data-uid = ${user.id}]`).remove();
  $("ul.list-notifications").find(`li>div[data-uid = ${user.id}]`).parent().remove();

  $("#request-contact-received").find(`li[data-uid=${user.id}]`).remove();

  decreaseNumberNotiContact("count-request-contact-received");
  decreaseNumberNotification("noti_contact_counter", 1);
  decreaseNumberNotification("noti_counter", 1);
});

$(document).ready(function () {
  removeRequestContact();
});
