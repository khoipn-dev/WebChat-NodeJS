$(document).ready(function() {
  $("#input-find-user-contact").bind("keypress", callFindUser);
  $("#btn-find-user-contact").bind("click", callFindUser);
});

function callFindUser(event) {
  if(event.which === 13 || event.type === "click") {
    let keyword = $("#input-find-user-contact").val();
    let regexKeyword = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);

    if (!keyword.length) {
      alertify.notify("Chưa nhập nội dung tìm kiếm ", "error", 5);
      return false;
    }

    if (!regexKeyword.test(keyword)) {
      alertify.notify("Lỗi từ khoá tìm kiếm, chỉ cho phép chữ cái và số , cho phép khoảng trắng", "error", 5);
      return false;
    }

    $.get(`/contact/find-user/${keyword}`, function (data) {
      $("#find-user ul").html(data);
    });

    console.log(keyword);
  }
}
