let userAvatar = null;
let userInfo = {};
let originAvatarSrc = null;
let originUserInfo = {};

function updateUserInfo () {
  $("#input-change-avatar").bind("change", function () {
    let fileData = $(this).prop("files")[0];
    let math = ["image/png", "image/jpg", "image/jpeg"];
    let limit = 10485763; //byte = 1MB

    if ($.inArray(fileData.type, math) === -1) {
      alertify.notify("Kiểu file không hợp lệ. Chỉ chấp nhận png & jpg", "error", 7);
      $(this).val(null);
      return false;
    }

    if (fileData.size > limit) {
      alertify.notify("Tối đa cho phép là 1MB", "error", 7);
      $(this).val(null);
      return false;
    }

    if (typeof FileReader != "undefined") {
      let imagePreview = $("#image-edit-profile");
      imagePreview.empty();

      let fileReader = new FileReader();
      fileReader.onload = function (element) {
        $("<img>", {
          "src": element.target.result,
          "class": "avatar img-circle",
          "id": "user-modal-avatar",
          "alt": "avatar"
        }).appendTo(imagePreview);
      } 
      imagePreview.show();
      fileReader.readAsDataURL(fileData);
  
      let formData = new FormData();
      formData.append("avatar", fileData);

      userAvatar = formData;

    } else {
      alertify.notify("Trình duyệt của bạn không hỗ trợ FileReader", "error", 7);
    }

  });

  $("#input-change-username").bind("change", function () {
    let username = $(this).val();
    let regexUsername = new RegExp("^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$");

    if (!regexUsername.test(username) || username.length < 3 || username.length > 17) {
      alertify.notify("Username giới hạn trong 3-17 kí tự và không được phép chứa ký tự đặc biệt", "error", 7);
      $(this).val(originUserInfo.username);
      delete userInfo.username;
      return false;
    }

    userInfo.username = username;
  });

  $("#input-change-gender-male").bind("click", function () {
    let gender = $(this).val();

    if (gender !== "male") {
      alertify.notify("Bạn thuộc thế giới thứ 3 à, xin lỗi chúng tôi chưa có lựa chọn này", "error", 7);
      $(this).val(originUserInfo.gender);
      delete userInfo.gender;
      return false;
    }

    userInfo.gender = gender;
  });

  $("#input-change-gender-female").bind("click", function () {
    let gender = $(this).val();

    if (gender !== "female") {
      alertify.notify("Bạn thuộc thế giới thứ 3 à, xin lỗi chúng tôi chưa có lựa chọn này", "error", 7);
      $(this).val(originUserInfo.gender);
      delete userInfo.gender;
      return false;
    }
    
    userInfo.gender = gender;
  });

  $("#input-change-address").bind("change", function () {
    let address = $(this).val();

    if (address.length < 3 || address.length > 40) {
      alertify.notify("Địa chỉ giới hạn trong 3-40 kí tự", "error", 7);
      $(this).val(originUserInfo.address);
      delete userInfo.address;
      return false;
    }

    userInfo.address = address;
  });

  $("#input-change-phone").bind("change", function () {
    let phone = $(this).val();
    let regexPhone = new RegExp("^(0)[0-9]{9,10}$");

    if (!regexPhone.test(phone)) {
      alertify.notify("Số điện thoại bắt đầu bằng số 0, giới hạn trong khoảng 10-11 số", "error", 7);
      $(this).val(originUserInfo.phone);
      delete userInfo.phone;
      return false;
    }

    userInfo.phone = phone;
  });

};

function callUpdateUserAvatar() {
  $.ajax({
    url: "/user/update-avatar",
    type: "PUT",
    cache: false,
    contentType: false,
    processData: false,
    data: userAvatar,
    success: function (result) {
      // Hiển thị thônng báo thành công
      $(".user-modal-alert-success").find("span").text(result.message);
      $(".user-modal-alert-success").css("display", "block");

      // Cập nhật avatar ở navbar
      $("#navbar-avatar").attr("src", result.imageSrc);

      // Cập nhật origin src avatar
      originAvatarSrc = result.imageSrc;

      // Reset input file avatar
      $("#input-change-avatar").val(null);

      // Tắt thông báo sau 5 giây
      setTimeout(()=>{
        $("#close-alert-success").click();
      }, 5000);
    },
    error: function (error) {
      // Hiển thị lỗi
      $(".user-modal-alert-error").find("span").text(error.responseText);
      $(".user-modal-alert-error").css("display", "block");

      //reset all
      $("#input-btn-cancel-update-user").click();

      // Tắt thông báo sau 5 giây
      setTimeout(()=>{
        $("#close-alert-error").click();
      }, 5000);

    }

  });
  
}

function callUpdateUserInfo() {
  $.ajax({
    url: "/user/update-info",
    type: "PUT",
    data: userInfo,
    success: function (result) {
      // Hiển thị thônng báo thành công
      $(".user-modal-alert-success").find("span").text(result.message);
      $(".user-modal-alert-success").css("display", "block");

      //Clone thuộc tính bằng object.assign
      originUserInfo = Object.assign(originUserInfo, userInfo);

      //Cập nhật username trên navbar
      $("#navbar-username").text(userInfo.username);

      // Reset all
      $("#input-btn-cancel-update-user").click();

      // Tắt thông báo sau 5 giây
      setTimeout(()=>{
        $("#close-alert-success").click();
      }, 5000);

    },
    error: function (error) {
      // Hiển thị lỗi
      $(".user-modal-alert-error").find("span").text(error.responseText);
      $(".user-modal-alert-error").css("display", "block");

      //reset all
      $("#input-btn-cancel-update-user").click();

      // Tắt thông báo sau 5 giây
      setTimeout(()=>{
        $("#close-alert-error").click();
      }, 5000);
    }
  });
}

$(document).ready(function() {

  originAvatarSrc = $("#user-modal-avatar").attr("src");
  originUserInfo = {
    username: $("#input-change-username").val(),
    gender: ($("#input-change-gender-male").is(":checked")) ? $("#input-change-gender-male").val() : $("#input-change-gender-female").val(),
    address: $("#input-change-address").val(),
    phone: $("#input-change-phone").val()
  };

  //Cập nhật thông tin userInfo khi thay đổi
  updateUserInfo();

  //Click nút cập nhật
  $("#input-btn-update-user").bind("click", function () {

    // Check dữ liệu thay đổi, chưa thì thông báo cho người dùng
    if ($.isEmptyObject(userInfo) && !userAvatar) {
      alertify.notify("Bạn phải thay đổi thông tin trước khi cập nhật dữ liệu", "error", 7);
      return false;
    }
    if (userAvatar) {
      // Gửi request cập nhật avatar
      callUpdateUserAvatar();
    }
    if (!$.isEmptyObject(userInfo)) {
      callUpdateUserInfo();
    }
    
  });

  //Click nút huỷ bỏ
  $("#input-btn-cancel-update-user").bind("click", function () {

    userAvatar = null;
    userInfo = {};
    
    $("#user-modal-avatar").attr("src", originAvatarSrc);

    // Cập nhật lại dữ liệu ban đầu
    $("#input-change-avatar").val(null);
    $("#input-change-username").val(originUserInfo.username);
    (originUserInfo.gender === "male") ? $("#input-change-gender-male").click() : $("#input-change-gender-female").click();
    $("#input-change-address").val(originUserInfo.address);
    $("#input-change-phone").val(originUserInfo.phone);

  });

});
