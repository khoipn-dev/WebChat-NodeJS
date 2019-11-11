$(document).ready(function() {
    $("#link-read-more-contacts").bind("click", function() {
        let skipNumber = $("#contacts").find("li").length;

        $("#link-read-more-contacts").css("display", "none");
        $(".read-more-loader-contacts").css("display", "inline-block");

        $.get(`/contact/read-more-contacts?skipNumber=${skipNumber}`, function(users) {
            if(!users.length) {
                alertify.notify("Bạn không còn bạn bè", "error", 5);
                $("#link-read-more-contacts").css("display", "inline-block");
                $(".read-more-loader-contacts").css("display", "none");
                return false;
            }

            users.forEach(function(user) {
                $("#contacts").find("ul")
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
                                      <div class="user-talk" data-uid="${user._id}">
                                          Trò chuyện
                                      </div>
                                      <div class="user-remove-contact action-danger" data-uid="${user._id}">
                                          Xóa liên hệ
                                      </div>
                                  </div>
                              </li>`);
            });

            removeContact();

            $("#link-read-more-contacts").css("display", "inline-block");
            $(".read-more-loader-contacts").css("display", "none");

        });
    });
});
