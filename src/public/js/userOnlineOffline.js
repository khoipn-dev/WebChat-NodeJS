socket.on("server-send-list-user-online", function (listUserIdOnline) {
    console.log(listUserIdOnline);
    listUserIdOnline.forEach(function (userId) {
        let $LiElement = $(`.person[data-chat=${userId}]`);
        $LiElement.find("div.dot").addClass("online");
        $LiElement.find("img").addClass("avatar-online");
    })
});

socket.on("server-send-when-has-user-online", function (userId) {
    let $LiElement = $(`.person[data-chat=${userId}]`);
    $LiElement.find("div.dot").addClass("online");
    $LiElement.find("img").addClass("avatar-online");
});

socket.on("server-send-when-has-user-offline", function (userId) {
    let $LiElement = $(`.person[data-chat=${userId}]`);
    $LiElement.find("div.dot").removeClass("online");
    $LiElement.find("img").removeClass("avatar-online");
});

