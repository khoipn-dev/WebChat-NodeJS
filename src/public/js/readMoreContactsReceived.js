$(document).ready(function() {
    $("#link-read-more-contacts-received").bind("click", function() {
        let skipNumber = $("#request-contact-received").find("li").length;

        $("#link-read-more-contacts-received").css("display", "none");
        $(".read-more-loader-contacts-received").css("display", "inline-block");

        $.get(`/contact/read-more-contacts-received?skipNumber=${skipNumber}`, function(users) {
            if(!users.length) {
                alertify.notify("Bạn không còn yêu cầu kết bạn nào", "error", 5);
                $("#link-read-more-contacts-received").css("display", "inline-block");
                $(".read-more-loader-contacts-received").css("display", "none");
                return false;
            }

            users.forEach(function(user) {
                $("#request-contact-received").find("ul")
                    .append(`<li class="_contactList" data-uid="${user._id}">
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
                                          <span>&nbsp ${(user.address !== null ? user.address : "")}</span>
                                      </div>
                                      <div class="user-accept-contact-received" data-uid="${user._id}">
                                          Chấp nhận
                                      </div>
                                      <div class="user-remove-invitation-contact action-danger" data-uid="${user._id}">
                                          Xóa yêu cầu
                                      </div>
                                  </div>
                              </li>`);
            });

            removeInvitationContact();
            acceptInvitationContact();

            $("#link-read-more-contacts-received").css("display", "inline-block");
            $(".read-more-loader-contacts-received").css("display", "none");

        });
    });
});
