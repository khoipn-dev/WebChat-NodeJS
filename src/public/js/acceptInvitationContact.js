function acceptInvitationContact() {
    $(".user-accept-contact-received").unbind("click").on("click", function() {
        let targetId = $(this).data("uid");
        $.ajax({
            url: "/contact/accept-invitation-contact",
            type: "PUT",
            data: { uid: targetId },
            success: function(data) {
                if (data.success) {
                    let userInfo = $("#request-contact-received").find(`ul li[data-uid = ${targetId}]`);

                    $(userInfo).find("div.user-accept-contact-received").remove();
                    $(userInfo).find("div.user-remove-invitation-contact").remove();
                    $(userInfo).find("div.contactPanel").append(`<div class="user-talk" data-uid="${targetId}">Trò chuyện</div>
                                                                <div class="user-remove-contact action-danger" data-uid="${targetId}">Xóa liên hệ</div>`);

                    let userInfoHTML = userInfo.get(0).outerHTML;
                    $("#contacts").find("ul").prepend(userInfoHTML);
                    $(userInfo).remove();
                    decreaseNumberNotiContact("count-request-contact-received");
                    increaseNumberNotiContact("count-contacts");

                    decreaseNumberNotification("noti_contact_counter",1);

                    removeContact();

                    socket.emit("accept-invitation-contact", {contactId: targetId});
                }
            }
        });
    });
}

socket.on("response-accept-invitation-contact", (user) => {
    let noti = `<div class="noti-readed-false" data-uid="${ user.id }">
                <img class="avatar-small" src="images/users/${ user.avatar }" alt=""> 
                <strong>${ user.username }</strong> đã chấp nhận lời mời kết bạn của bạn!
              </div>`;
    $(".noti_content").prepend(noti);
    $("ul.list-notifications").prepend(`<li>${noti}</li>`);

    decreaseNumberNotification("noti_contact_counter", 1);
    increaseNumberNotification("noti_counter", 1);

    decreaseNumberNotiContact("count-request-contact-sent");
    increaseNumberNotiContact("count-contacts");

    $("#find-user").find(`ul li[data-uid = ${user.id}]`).remove();
    $("#request-contact-sent").find(`ul li[data-uid = ${user.id}]`).remove();
     let userInfoHTML = `<li class="_contactList" data-uid="${user.id}">
                                  <div class="contactPanel">
                                      <div class="user-avatar">
                                          <img src="images/users/${user.avatar}" alt="">
                                      </div>
                                      <div class="user-name">
                                          <p>
                                            ${user.username}
                                          </p>
                                      </div>
                                      <br>
                                      <div class="user-address">
                                          <span>&nbsp ${user.address}</span>
                                      </div>
                                      <div class="user-talk" data-uid="${user.id}">
                                          Trò chuyện
                                      </div>
                                      <div class="user-remove-contact action-danger" data-uid="${user.id}">
                                          Xóa liên hệ
                                      </div>
                                  </div>
                              </li>`;
    $("#contacts").find("ul").prepend(userInfoHTML);
    removeContact();
});

$(document).ready(function () {
    acceptInvitationContact();
});
