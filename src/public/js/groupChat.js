function callSearchFriends(event) {
    if (event.which === 13 || event.type === "click") {
        let keyword = $("#input-search-friend-to-add-group-chat").val();
        let regexKeyword = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ \@\.]+$/);

        if (!keyword.length) {
            alertify.notify("Chưa nhập nội dung tìm kiếm ", "error", 5);
            return false;
        }

        if (!regexKeyword.test(keyword)) {
            alertify.notify("Lỗi từ khoá tìm kiếm, chỉ cho phép chữ cái và số , cho phép khoảng trắng", "error", 5);
            return false;
        }

        $.get(`/contact/search-friend/${keyword}`, function (data) {
            $("ul#group-chat-friends").html(data);
            // Thêm người dùng vào danh sách liệt kê trước khi tạo nhóm trò chuyện
            addFriendsToGroup();
            // Action hủy việc tạo nhóm trò chuyện
            cancelCreateGroup();
        });
    }
}

function callCreateGroupChat() {
    $("#btn-create-group-chat").unbind("click").on("click", function () {
        $ListUser = $("ul#friends-added>li");

        if ($ListUser.length < 2) {
            alertify.notify("Cần chọn ít nhất hai bạn bè để tạo nhóm trò chuyện", "error", 5);
            return false;
        }

        let groupChatName = $("#input-name-group-chat").val();
        let regexGroupChatName = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
        if (!regexGroupChatName.test(groupChatName) || groupChatName.length < 5 || groupChatName.length > 40) {
            alertify.notify("Tên nhóm trò chuyện tối thiểu 5 kí tự và tối đa 40 kí tự và không chứa ký tự đặc biệt", "error", 5);
            return false;
        }

        let arrUserId = [];
        $ListUser.each(function (index, item) {
            arrUserId.push({userId: $(item).data("uid")});
        });

        Swal.fire({
            title: `Bạn chắc chắn muốn tạo nhóm &nbsp; ${groupChatName}?`,
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#2ECC71",
            cancelButtonColor: "#ff7675",
            confirmButtonText: "Xác nhận",
            cancelButtonText: "Huỷ"
        }).then((result) => {
            if (!result.value) {
                return false;
            }

            $.post("/group-chat/create-group", {
                arrUserId: arrUserId,
                groupChatName: groupChatName
            }, function (response) {
                console.log(response);
                // hide modal
                $("#input-name-group-chat").val('');
                $("#btn-cancel-group-chat").click();
                $("#groupChatModal").modal("hide");

                // Add left side conversation
                let subGroupChatName = response.groupChat.name;
                if (subGroupChatName.length > 15) {
                    subGroupChatName = subGroupChatName.substr(0, 14) + ". . .";
                }
                let leftConversation = `<a href="#uid_${response.groupChat._id}" class="room-chat" data-target="#to_${response.groupChat._id}">
                              <li class="person group-chat" data-chat="${response.groupChat._id}">
                                  <div class="left-avatar">
                                      <!-- <div class="dot"></div> -->
                                      <img src="images/users/group-avatar-trungquandev.png" alt="">
                                  </div>
                                  <span class="name">
                                      <span class="group-chat-name">${subGroupChatName}</span>
                                  </span>
                                  <span class="time"></span>
                                  <span class="preview convert-emoji"></span>
                              </li>
                          </a>`;

                $("#all-chat").find("ul").prepend(leftConversation);
                $("#group-chat").find("ul").prepend(leftConversation);

                // Add right side conversation
                let rightConversation = ` <div class="right tab-pane" data-chat="${response.groupChat._id}" id="to_${response.groupChat._id}">
                    <div class="top">
                        <span>To: <span class="name">${response.groupChat.name}</span>
                            <span>( ${response.groupChat.userAmount} thành viên )</span>
                        </span>
                        <span class="chat-menu-right">
                  <a href="#attachmentsModal_${response.groupChat._id}" class="show-attachments" data-toggle="modal">
                      Tệp đính kèm
                      <i class="fa fa-paperclip"></i>
                  </a>
              </span>
                        <span class="chat-menu-right">
                  <a href="javascript:void(0)">&nbsp;</a>
              </span>
                        <span class="chat-menu-right">
                  <a href="#imagesModal_${response.groupChat._id}" class="show-images" data-toggle="modal">
                      Hình ảnh
                      <i class="fa fa-photo"></i>
                  </a>
              </span>
                    </div>
                    <div class="content-chat">
                        <div class="chat" data-chat="${response.groupChat._id}"></div>
                    </div>
                    <div class="write" data-chat="${response.groupChat._id}">
                        <input type="text" class="write-chat chat-in-group" id="write-chat-${response.groupChat._id}" data-chat="${response.groupChat._id}">
                        <div class="icons">
                            <a href="#" class="icon-chat" data-chat="${response.groupChat._id}"><i class="fa fa-smile-o"></i></a>
                            <label for="image-chat-${response.groupChat._id}">
                                <input type="file" id="image-chat-${response.groupChat._id}" name="my-image-chat" class="image-chat chat-in-group" data-chat="${response.groupChat._id}">
                                <i class="fa fa-photo"></i>
                            </label>
                            <label for="attachment-chat-${response.groupChat._id}">
                                <input type="file" id="attachment-chat-${response.groupChat._id}" name="my-attachment-chat" class="attachment-chat chat-in-group" data-chat="${response.groupChat._id}">
                                <i class="fa fa-paperclip"></i>
                            </label>
                            <a href="javacsript:void(0);" id="video-chat-group">
                                <i class="fa fa-video-camera"></i>
                            </a>
                        </div>
                    </div>
                </div>`;

                $("#screen-chat").prepend(rightConversation);

                // Add event
                changeScreenChat();

                // Add image modal
                let imageModal = `<div class="modal fade" id="imagesModal_${response.groupChat._id}" role="dialog">
                                      <div class="modal-dialog modal-lg">
                                          <div class="modal-content">
                                              <div class="modal-header">
                                                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                                                  <h4 class="modal-title">Tất cả hình ảnh</h4>
                                              </div>
                                              <div class="modal-body">
                                                  <div class="all-images" style="visibility: hidden;"></div>
                                              </div>
                                          </div>
                                      </div>
                                    </div>`;
                $("body").append(imageModal);

                // Add event open image modal
                gridPhotos(5);

                // Add attach modal
                let attachmentModal = `<div class="modal fade" id="attachmentsModal_${response.groupChat._id}" role="dialog">
                                          <div class="modal-dialog modal-lg">
                                              <div class="modal-content">
                                                  <div class="modal-header">
                                                      <button type="button" class="close" data-dismiss="modal">&times;</button>
                                                      <h4 class="modal-title">Tất cả file đính kèm</h4>
                                                  </div>
                                                  <div class="modal-body">
                                                      <ul class="list-attachments"></ul>
                                                  </div>
                                              </div>
                                          </div>
                                        </div>`;
                $("body").append(attachmentModal);

                // Emit realtime

                socket.emit("new-group-created", {groupChat: response.groupChat});

            }).fail(function (response) {
                alertify.notify(response.responseText, "error", 5);
            });
        });
    });
}

function addFriendsToGroup() {
    $("ul#group-chat-friends").find("div.add-user").bind("click", function () {
        let uid = $(this).data("uid");
        $(this).remove();
        let html = $("ul#group-chat-friends").find("div[data-uid=" + uid + "]").html();

        let promise = new Promise(function (resolve, reject) {
            $("ul#friends-added").append(html);
            $("#groupChatModal .list-user-added").show();
            resolve(true);
        });
        promise.then(function (success) {
            $("ul#group-chat-friends").find("div[data-uid=" + uid + "]").remove();
        });
    });
}

function cancelCreateGroup() {
    $("#btn-cancel-group-chat").bind("click", function () {
        $("#groupChatModal .list-user-added").hide();
        if ($("ul#friends-added>li").length) {
            $("ul#friends-added>li").each(function (index) {
                $(this).remove();
            });
        }
    });
}

$(document).ready(function () {
    $("#input-search-friend-to-add-group-chat").bind("keypress", callSearchFriends);
    $("#btn-search-friend-to-add-group-chat").bind("click", callSearchFriends);
    callCreateGroupChat();

    socket.on("response-new-group-created", function (response) {
        // Add left side conversation
        let subGroupChatName = response.groupChat.name;
        if (subGroupChatName.length > 15) {
            subGroupChatName = subGroupChatName.substr(0, 14) + ". . .";
        }
        let leftConversation = `<a href="#uid_${response.groupChat._id}" class="room-chat" data-target="#to_${response.groupChat._id}">
                              <li class="person group-chat" data-chat="${response.groupChat._id}">
                                  <div class="left-avatar">
                                      <!-- <div class="dot"></div> -->
                                      <img src="images/users/group-avatar-trungquandev.png" alt="">
                                  </div>
                                  <span class="name">
                                      <span class="group-chat-name">${subGroupChatName}</span>
                                  </span>
                                  <span class="time"></span>
                                  <span class="preview convert-emoji"></span>
                              </li>
                          </a>`;

        $("#all-chat").find("ul").prepend(leftConversation);
        $("#group-chat").find("ul").prepend(leftConversation);

        // Add right side conversation
        let rightConversation = ` <div class="right tab-pane" data-chat="${response.groupChat._id}" id="to_${response.groupChat._id}">
                    <div class="top">
                        <span>To: <span class="name">${response.groupChat.name}</span>
                            <span>( ${response.groupChat.userAmount} thành viên )</span>
                        </span>
                        <span class="chat-menu-right">
                  <a href="#attachmentsModal_${response.groupChat._id}" class="show-attachments" data-toggle="modal">
                      Tệp đính kèm
                      <i class="fa fa-paperclip"></i>
                  </a>
              </span>
                        <span class="chat-menu-right">
                  <a href="javascript:void(0)">&nbsp;</a>
              </span>
                        <span class="chat-menu-right">
                  <a href="#imagesModal_${response.groupChat._id}" class="show-images" data-toggle="modal">
                      Hình ảnh
                      <i class="fa fa-photo"></i>
                  </a>
              </span>
                    </div>
                    <div class="content-chat">
                        <div class="chat" data-chat="${response.groupChat._id}"></div>
                    </div>
                    <div class="write" data-chat="${response.groupChat._id}">
                        <input type="text" class="write-chat chat-in-group" id="write-chat-${response.groupChat._id}" data-chat="${response.groupChat._id}">
                        <div class="icons">
                            <a href="#" class="icon-chat" data-chat="${response.groupChat._id}"><i class="fa fa-smile-o"></i></a>
                            <label for="image-chat-${response.groupChat._id}">
                                <input type="file" id="image-chat-${response.groupChat._id}" name="my-image-chat" class="image-chat chat-in-group" data-chat="${response.groupChat._id}">
                                <i class="fa fa-photo"></i>
                            </label>
                            <label for="attachment-chat-${response.groupChat._id}">
                                <input type="file" id="attachment-chat-${response.groupChat._id}" name="my-attachment-chat" class="attachment-chat chat-in-group" data-chat="${response.groupChat._id}">
                                <i class="fa fa-paperclip"></i>
                            </label>
                            <a href="javacsript:void(0);" id="video-chat-group">
                                <i class="fa fa-video-camera"></i>
                            </a>
                        </div>
                    </div>
                </div>`;

        $("#screen-chat").prepend(rightConversation);

        // Add event
        changeScreenChat();

        // Add image modal
        let imageModal = `<div class="modal fade" id="imagesModal_${response.groupChat._id}" role="dialog">
                                      <div class="modal-dialog modal-lg">
                                          <div class="modal-content">
                                              <div class="modal-header">
                                                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                                                  <h4 class="modal-title">Tất cả hình ảnh</h4>
                                              </div>
                                              <div class="modal-body">
                                                  <div class="all-images" style="visibility: hidden;"></div>
                                              </div>
                                          </div>
                                      </div>
                                    </div>`;
        $("body").append(imageModal);

        // Add event open image modal
        gridPhotos(5);

        // Add attach modal
        let attachmentModal = `<div class="modal fade" id="attachmentsModal_${response.groupChat._id}" role="dialog">
                                          <div class="modal-dialog modal-lg">
                                              <div class="modal-content">
                                                  <div class="modal-header">
                                                      <button type="button" class="close" data-dismiss="modal">&times;</button>
                                                      <h4 class="modal-title">Tất cả file đính kèm</h4>
                                                  </div>
                                                  <div class="modal-body">
                                                      <ul class="list-attachments"></ul>
                                                  </div>
                                              </div>
                                          </div>
                                        </div>`;
        $("body").append(attachmentModal);
    });
});