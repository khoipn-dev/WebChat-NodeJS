let userAvatar = null;
let userInfo = {};
let originAvatarSrc = null;
let originUserInfo = {};
let userUpdatePassword = {};

function updateUserInfo() {
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
    let regexUsername = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);

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
    let regexPhone = new RegExp(/^(0)[0-9]{9,10}$/);

    if (!regexPhone.test(phone)) {
      alertify.notify("Số điện thoại bắt đầu bằng số 0, giới hạn trong khoảng 10-11 số", "error", 7);
      $(this).val(originUserInfo.phone);
      delete userInfo.phone;
      return false;
    }

    userInfo.phone = phone;
  });

  $("#input-change-current-password").bind("change", function () {
    let currentPassword = $(this).val();
    let regexPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);

    if (!regexPassword.test(currentPassword)) {
      alertify.notify("Mật khẩu phải chứa ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và kí tự đặc biệt", "error", 7);
      $(this).val(null);
      delete userUpdatePassword.currentPassword;
      return false;
    }

    userUpdatePassword.currentPassword = currentPassword;
  });

  $("#input-change-new-password").bind("change", function () {
    let newPassword = $(this).val();
    let regexPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);

    if (!regexPassword.test(newPassword)) {
      alertify.notify("Mật khẩu phải chứa ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và kí tự đặc biệt", "error", 7);
      $(this).val(null);
      delete userUpdatePassword.newPassword;
      return false;
    }

    userUpdatePassword.newPassword = newPassword;
  });

  $("#input-change-confirm-new-password").bind("change", function () {
    let confirmNewPassword = $(this).val();

    if (!userUpdatePassword.newPassword) {
      alertify.notify("Bạn chưa nhập khẩu mới", "error", 7);
      $(this).val(null);
      delete userUpdatePassword.confirmNewPassword;
      return false;
    }

    if (confirmNewPassword !== userUpdatePassword.newPassword) {
      alertify.notify("Nhập lại mật khẩu không khớp", "error", 7);
      $(this).val(null);
      delete userUpdatePassword.confirmNewPassword;
      return false;
    }

    userUpdatePassword.confirmNewPassword = confirmNewPassword;
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
      setTimeout(() => {
        $(".user-modal-alert-success").css("display", "none");
      }, 5000);
    },
    error: function (error) {
      // Hiển thị lỗi
      $(".user-modal-alert-error").find("span").text(error.responseText);
      $(".user-modal-alert-error").css("display", "block");

      //reset all
      $("#input-btn-cancel-update-user").click();

      // Tắt thông báo sau 5 giây
      setTimeout(() => {
        $(".user-modal-alert-error").css("display", "none");
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
      setTimeout(() => {
        $(".user-modal-alert-success").css("display", "none");
      }, 5000);

    },
    error: function (error) {
      // Hiển thị lỗi
      $(".user-modal-alert-error").find("span").text(error.responseText);
      $(".user-modal-alert-error").css("display", "block");

      //reset all
      $("#input-btn-cancel-update-user").click();

      // Tắt thông báo sau 5 giây
      setTimeout(() => {
        $(".user-modal-alert-error").css("display", "none");
      }, 5000);
    }
  });
}

function callUpdateUserPassword() {
  $.ajax({
    url: "/user/update-password",
    type: "PUT",
    data: userUpdatePassword,
    success: function (result) {
      // Hiển thị thônng báo thành công
      $(".user-modal-password-alert-success").find("span").text(result.message);
      $(".user-modal-password-alert-success").css("display", "block");

      // Reset all
      $("#btn-cancel-update-password").click();

      // Đăng xuất sau khi đổi mật khẩu thành công
      callLogout();

      // Tắt thông báo sau 5 giây
      setTimeout(() => {
        $(".user-modal-password-alert-success").css("display", "none");
      }, 5000);

    },
    error: function (error) {
      // Hiển thị lỗi
      $(".user-modal-password-alert-error").find("span").text(error.responseText);
      $(".user-modal-password-alert-error").css("display", "block");

      //reset all
      $("#btn-cancel-update-password").click();

      // Tắt thông báo sau 5 giây
      setTimeout(() => {
        $(".user-modal-password-alert-error").css("display", "none");
      }, 5000);
 
    }
  });
}


function callLogout() {
  let timeInterval;
  Swal.fire({
    position: "top-end",
    type: "success",
    title: "Tự động đăng xuất sau 5 giây",
    html: "Thời gian: <strong></strong>",
    timer: 5000,
    onBeforeOpen: () => {
      Swal.showLoading();
      timeInterval = setInterval(()=> {
        Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
      }, 1000);
    },
    onClose: () => {
      clearInterval(timeInterval);
    }
  }).then((result) => {
    $.get("/logout", function () {
      location.reload();
    });
  });
}

$(document).ready(function () {

  originAvatarSrc = $("#user-modal-avatar").attr("src");
  originUserInfo = {
    username: $("#input-change-username").val(),
    gender: ($("#input-change-gender-male").is(":checked")) ? $("#input-change-gender-male").val() : $("#input-change-gender-female").val(),
    address: $("#input-change-address").val(),
    phone: $("#input-change-phone").val()
  };

  //Cập nhật thông tin userInfo khi thay đổi
  updateUserInfo();

  //Click nút cập nhật thông tin
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

  //Click nút huỷ bỏ cập nhật thông tin
  $("#input-btn-cancel-update-user").bind("click", function () {

    userAvatar = null;
    userInfo = {};

    $("#user-modal-avatar").attr("src", originAvatarSrc);

    // Cập nhật lại dữ liệu ban đầu
    $("#input-change-avatar").val(null);
    $("#input-change-username").val(originUserInfo.username);
    (originUserInfo.gender === "male") ? $("#input-change-gender-male").prop('checked', true) : $("#input-change-gender-female").prop('checked', true);
    $("#input-change-address").val(originUserInfo.address);
    $("#input-change-phone").val(originUserInfo.phone);

  });

  //Click cập nhật password
  $("#btn-update-password").bind("click", function () {

    // Check dữ liệu thay đổi, chưa thì thông báo cho người dùng
    if (!userUpdatePassword.currentPassword || !userUpdatePassword.newPassword || !userUpdatePassword.confirmNewPassword) {
      alertify.notify("Bạn phải nhập đầy đủ thông tin", "error", 7);
      return false;
    }

    Swal.fire({
      title: "Bạn chắc chắn muốn thay đổi mật khẩu?",
      text: "Sau khi thực hiện bạn không thể hoàn tác lại. Hãy chắc chắn",
      type: "info",
      showCancelButton: true,
      confirmButtonColor: "#2ECC71",
      cancelButtonColor: "#ff7675",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Huỷ"
    }).then((result) => {
      if (!result.value) {
        $("#btn-cancel-update-password").click();
        return false;
      }

      callUpdateUserPassword();
    });

  });

  //Click huỷ bỏ cập nhật password
  $("#btn-cancel-update-password").bind("click", function () {
    userUpdatePassword = {};
    $("#input-change-current-password").val(null);
    $("#input-change-new-password").val(null);
    $("#input-change-confirm-new-password").val(null);
  });

});

