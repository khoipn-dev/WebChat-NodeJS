function markNoticationAsRead(targetUsers) {
  $.ajax({
    url: "/notifications/mark-all-as-read",
    type: "PUT",
    data: {targetUsers: targetUsers},
    success: function(result) {
      if (result) {
        targetUsers.forEach(function (uid) {
          $(".noti_content").find(`div[data-uid = ${uid}]`).removeClass("noti-readed-false");
          $("ul.list-notifications").find(`li>div[data-uid = ${uid}]`).removeClass("noti-readed-false");
        });

        decreaseNumberNotification("noti_counter", targetUsers.length);
      }
    }
  })
}

$(document).ready(function() {
  $("#popup-mark-as-read").bind("click", function() {
    let targetUsers = [];
    $(".noti_content").find("div.noti-readed-false").each(function(index, notification) {
      targetUsers.push($(notification).data("uid"));
    });
    if (!targetUsers.length) {
      alertify.notify("Bạn không còn thông báo nào chưa đọc", "error", 5);
      return false;
    };
    markNoticationAsRead(targetUsers);

  });

  $("#modal-mark-noti-as-read").bind("click", function() {
    let targetUsers = [];
    $("ul.list-notifications").find("li>div.noti-readed-false").each(function(index, notification) {
      targetUsers.push($(notification).data("uid"));
    });
    if (!targetUsers.length) {
      alertify.notify("Bạn không còn thông báo nào chưa đọc", "error", 5);
      return false;
    };
    markNoticationAsRead(targetUsers);
  });
});
