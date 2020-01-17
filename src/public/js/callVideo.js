function callVideo(divId) {
    $(`#video-chat-${divId}`).unbind("click").on("click", function () {
       let targetId = $(this).data("chat");
       let callerName = $("#navbar-username").text();

       let dataForEmit = {
           listenerId: targetId,
           callerName: callerName
       };

        // Check listener online
        socket.emit("check-listener-online",dataForEmit);
    });
}

function playVideoStream(videoTagId, stream) {
    let video = document.getElementById(videoTagId);
    video.srcObject = stream;
    video.onloadeddata = function () {
        video.play();
    }
}

function closeVideoStream(stream) {
    return stream.getTracks().forEach(track => track.stop());
}

$(document).ready(function () {
    // Lắng nghe listener offline
    socket.on("listener-offline", function () {
        alertify.notify("Người dùng hiện không online", "error",5);
    });

    let timeInterval;
    let iceServerList = JSON.parse($("#ice-server-list").val());

    let peerId = null;
    const peer = new Peer({
        key: "peerjs",
        secure: true,
        port: 443,
        config: { "iceServers": iceServerList},
        debug: 3
    });
    peer.on("open", function (PeerId) {
        peerId = PeerId;
    });

    // Lắng nghe server yêu cầu peerId
    socket.on("request-peerId-listener", function (response) {
        let listenerName = $("#navbar-username").text();
        let dataForEmit = {
            callerId: response.callerId,
            callerName: response.callerName,
            listenerId: response.listenerId,
            listenerName: listenerName,
            listenerPeerId: peerId
        };

        socket.emit("listener-send-peerId", dataForEmit);
    });

    // Lắng nghe server trả về peerId của listener và gửi yêu cầu call
    socket.on("server-send-listener-peerId-to-caller", function (response) {
        // Gửi yêu cầu gọi đến server
        socket.emit("caller-request-call-to-server", response);

        // Bật modal chờ
        Swal.fire({
            title: `Đang gọi đến &nbsp; <span style="color: #0e7792">${response.listenerName}</span> &nbsp; <i class="fa fa-volume-control-phone"></i>`,
            html: `Thời gian: <strong style="color: #d43f3a"></strong> giây <br> <br>
                   <button id="btn-cancel-call" class="btn btn-danger">Huỷ cuộc gọi</button>      
                  `,
            backdrop: "rgba(58, 58, 58, 0.4)",
            width: "52rem",
            timer: 30000,
            allowOutsideClick: false,
            onBeforeOpen: () => {
                $("#btn-cancel-call").unbind("click").on("click", function () {
                    Swal.close();
                    clearInterval(timeInterval);

                    socket.emit("caller-cancel-request-to-server", response);
                });

                if (Swal.getContent().querySelector !== null) {
                    Swal.showLoading();
                    timeInterval = setInterval(()=> {
                        Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
                    }, 1000);
                }
            },
            onOpen: function () {
                socket.on("server-send-reject-request-call-to-caller", function (response) {
                    Swal.close();
                    clearInterval(timeInterval);
                    Swal.fire({
                        type: "info",
                        title: `<span style="color: #0e7792">${response.listenerName}</span> &nbsp; hiện tại không thể nghe máy`,
                        backdrop: "rgba(58, 58, 58, 0.4)",
                        width: "52rem",
                        allowOutsideClick: false,
                        confirmButtonColor: "#2ECC71",
                        confirmButtonText: "Xác nhận",
                    });
                });
            },
            onClose: () => {
                clearInterval(timeInterval);
            }
        }).then((result) => {
            return false;
        });
    });

    // Lắng nghe khi có yêu cầu call
    socket.on("server-send-request-call-to-listener", function (response) {
        // Bật modal có yêu cầu call
        Swal.fire({
            title: `Có cuộc gọi từ &nbsp; <span style="color: #0e7792">${response.callerName}</span> &nbsp; <i class="fa fa-volume-control-phone"></i>`,
            html: `Thời gian: <strong style="color: #d43f3a"></strong> giây <br> <br>
                   <button id="btn-reject-call" class="btn btn-danger">Từ chối</button>      
                   <button id="btn-accept-call" class="btn btn-success">Nghe</button>      
                  `,
            backdrop: "rgba(58, 58, 58, 0.4)",
            width: "52rem",
            timer: 30000,
            allowOutsideClick: false,
            onBeforeOpen: () => {
                // Sự kiện người nghe từ chối cuộc gọi
                $("#btn-reject-call").unbind("click").on("click", function () {
                    Swal.close();
                    clearInterval(timeInterval);

                    socket.emit("listener-reject-request-call-to-server", response);
                });

                // Sự kiện người nghe chấp nhận cuộc gọi
                $("#btn-accept-call").unbind("click").on("click", function () {
                    Swal.close();
                    clearInterval(timeInterval);

                    socket.emit("listener-accept-request-call-to-server", response);
                });

                if (Swal.getContent().querySelector !== null) {
                    Swal.showLoading();
                    timeInterval = setInterval(()=> {
                        Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
                    }, 1000);
                }
            },
            onOpen: () => {
                // Sự kiện người gọi huỷ yêu cầu
                socket.on("server-send-cancel-request-call-to-listener", function (response) {
                    Swal.close();
                    clearInterval(timeInterval);
                });
            },
            onClose: () => {
                clearInterval(timeInterval);
            }
        }).then((result) => {
            return false;
        });
    });

    socket.on("server-send-accept-request-call-to-listener", function (response) {
        Swal.close();
        clearInterval(timeInterval);
        let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
        peer.on("call", function(call) {
            getUserMedia({video: true, audio: true}, function(stream) {
                // mở modal stream
                $("#streamModal").modal("show");
                // Hiện thị video local-stream
                playVideoStream("local-stream", stream);
                call.answer(stream); // Answer the call with an A/V stream.

                call.on("stream", function(remoteStream) {
                    // Hiện thị video remote-stream
                    playVideoStream("remote-stream", remoteStream);
                });

                call.on("close", function() {
                    console.log("close");
                    $("#streamModal").modal("hide");
                });

                // Đóng modal === tắt cuộc gọi
                $("#streamModal").on("hidden.bs.modal", function () {
                    closeVideoStream(stream);
                    showPopupWhenEndCallVideo(response.callerName);
                    call.close();
                });
            }, function(err) {
                if (err.toString() === "NotAllowedError: Permission denied") {
                    alertify.notify("Không có quyền truy cập camera và microphone", "error", 5);
                }

                if (err.toString() === "NotFoundError: Requested device not found") {
                    alertify.notify("Không tìm thấy camera và microphone", "error", 5);
                }
            });
        });
    });

    socket.on("server-send-accept-request-call-to-caller", function (response) {
        Swal.close();
        clearInterval(timeInterval);
        //Connect
        let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
        getUserMedia({video: true, audio: true}, function(stream) {
            // mở modal stream
            $("#streamModal").modal("show");
            // Hiện thị video local-stream
            playVideoStream("local-stream", stream);
            // Gọi listener
            let call = peer.call(response.listenerPeerId, stream);

            // Kết nối thành công
            call.on("stream", function(remoteStream) {
                // Hiện thị video remote-stream
                playVideoStream("remote-stream", remoteStream);
            });

            call.on("close", function() {
                console.log("close");
                $("#streamModal").modal("hide");
            });

            // Đóng modal === tắt cuộc gọi
            $("#streamModal").on("hidden.bs.modal", function () {
                closeVideoStream(stream);
                showPopupWhenEndCallVideo(response.listenerName);
                call.close();
            });
        }, function(err) {
            if (err.toString() === "NotAllowedError: Permission denied") {
                alertify.notify("Không có quyền truy cập camera và microphone", "error", 5);
            }

            if (err.toString() === "NotFoundError: Requested device not found") {
                alertify.notify("Không tìm thấy camera và microphone", "error", 5);
            }
        });

    });

});

function showPopupWhenEndCallVideo(username) {
    Swal.fire({
        type: "info",
        title: `Cuộc gọi với &nbsp; <span style="color: #0e7792">${username}</span>&nbsp; đã kết thúc`,
        backdrop: "rgba(58, 58, 58, 0.4)",
        width: "52rem",
        allowOutsideClick: false,
        confirmButtonColor: "#2ECC71",
        confirmButtonText: "Xác nhận",
    });
}
