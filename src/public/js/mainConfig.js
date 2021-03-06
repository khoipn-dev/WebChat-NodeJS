/**
 * Created by https://trungquandev.com's author on 25/02/2018.
 */

const socket = io();

function nineScrollLeft() {
  $('.left').niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
}

function nineScrollRight(divId) {
  $(`.right .chat[data-chat = ${divId}]`).niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
  $(`.right .chat[data-chat = ${divId}]`).scrollTop($(`.right .chat[data-chat = ${divId}]`)[0].scrollHeight);
}

function enableEmojioneArea(inputChatId) {
  $(`#write-chat-${inputChatId}`).emojioneArea({
    standalone: false,
    pickerPosition: 'top',
    filtersPosition: 'bottom',
    tones: false,
    autocomplete: true,
    inline: true,
    hidePickerOnBlur: true,
    search: false,
    shortnames: false,
    events: {
      // Gắn giá trị vào thẻ input bị ẩn
      keyup: function(editor, event) {
        $(`#write-chat-${inputChatId}`).val(this.getText());
      },
      // Bật listen DOM khi click vào input( Lắng nghe event keyup enter để gửi tin nhắn )
      click: function () {
        textAndEmojiChat(inputChatId);
        typingOn(inputChatId);
      },
      blur: function () {
        typingOff(inputChatId);
      }
    },
  });
  $('.icon-chat').bind('click', function(event) {
    event.preventDefault();
    $('.emojionearea-button').click();
    $('.emojionearea-editor').focus();
  });
}

function spinLoaded() {
  $('.master-loader').css('display', 'none');
}

function spinLoading() {
  $('.master-loader').css('display', 'block');
}

function ajaxLoading() {
  $(document)
    .ajaxStart(function() {
      spinLoading();
    })
    .ajaxStop(function() {
      spinLoaded();
    });
}

function showModalContacts() {
  $('#show-modal-contacts').click(function() {
    $(this).find('.noti_contact_counter').fadeOut('slow');
  });
}

function configNotification() {
  $('#noti_Button').click(function() {
    $('#notifications').fadeToggle('fast', 'linear');
    // $('.noti_counter').fadeOut('slow');
    return false;
  });
  $(".main-content").click(function() {
    $('#notifications').fadeOut('fast', 'linear');
  });
}

function gridPhotos(layoutNumber) {
  $(".show-images").unbind("click").on("click", function () {
    let modalImageId = $(this).attr("href");
    let originalData = $(modalImageId).find("div.modal-body").html();

    let countRows = Math.ceil($(modalImageId).find("div.all-images>img").length / layoutNumber);
    let layoutStr = new Array(countRows).fill(layoutNumber).join("");
    $(modalImageId).find("div.all-images").photosetGrid({
      highresLinks: true,
      rel: "withhearts-gallery",
      gutter: "2px",
      layout: layoutStr,
      onComplete: function() {
        $(modalImageId).find(".all-images").css({
          "visibility": "visible"
        });
        $(modalImageId).find(".all-images a").colorbox({
          photo: true,
          scalePhotos: true,
          maxHeight: "90%",
          maxWidth: "90%"
        });
      }
    });

    // Bắt sự kiêjn đóng modal hình ảnh
    $(modalImageId).on("hidden.bs.modal", function () {
      $(this).find("div.modal-body").html(originalData);
    });
  });
}


function flashMasterNotify () {
  let notify = $(".master-success-message").text();
  if (notify.length) {
    alertify.notify(notify, "success", 7);
  }
}

function changeTypeChat () {
  $("#select-type-chat").bind("change", function () {
    let optionSelected = $("option:selected", this);
    optionSelected.tab("show");

    if ($(this).val() === "user-chat") {
      $(".create-group-chat").hide();
    } else {
      $(".create-group-chat").show();
    }
  })
}

function changeScreenChat() {
  $(".room-chat").unbind("click").on("click", function () {
    let divId = $(this).find('li').data('chat');

    $(".person").removeClass("active");
    $(`.person[data-chat=${divId}]`).addClass("active");
    $(this).tab("show");

    //Cấu hình thanh cuộn khung chat
    nineScrollRight(divId);

    // Bật emoji, tham số truyền vào là id của box nhập nội dung tin nhắn
    enableEmojioneArea(divId);

    // Lắng nghe chat image
    chatImage(divId);

    // Lắng nghe chat attachment
    chatAttachment(divId);

    // Lắng nghe call video
    callVideo(divId);
  })
}

function convertEmoji() {
  $(".convert-emoji").each(function() {
    var original = $(this).html();
    // use .shortnameToImage if only converting shortnames (for slightly better performance)
    var converted = emojione.toImage(original);
    $(this).html(converted);
  });
}

function resizeNineScrollLeft() {
  $(".left").getNiceScroll().resize();
}

function bufferToBase64(buffer) {
  return btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
}

$(document).ready(function() {
  // Hide số thông báo trên đầu icon mở modal contact
  showModalContacts();

  // Bật tắt popup notification
  configNotification();

  // Cấu hình thanh cuộn
  nineScrollLeft();

  // Icon loading khi chạy ajax
  ajaxLoading();

  // Hiển thị hình ảnh grid slide trong modal tất cả ảnh, tham số truyền vào là số ảnh được hiển thị trên 1 hàng.
  // Tham số chỉ được phép trong khoảng từ 1 đến 5
  gridPhotos(5);

  // Flash message ở màn hình master
  flashMasterNotify();

  // Thay đổi kiểu trò chuyện
  changeTypeChat();

  // Thay đổi màn hình chat
  changeScreenChat();

  //Convert unicode thành emoji icon
  convertEmoji();

  $("ul.people").find("a")[0].click();

  $("#video-chat-group").bind("click", function () {
    alertify.notify("Tính năng không khả dụng với nhóm trò chuyện", "error", 5);
  })

});
