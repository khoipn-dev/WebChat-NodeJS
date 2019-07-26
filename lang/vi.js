export const transValidation = {
  email_incorrect: "Email không hợp lệ",
  gender_incorrect: "Vui lòng nhập giới tính",
  password_incorrect: "Mật khẩu phải chứa ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và kí tự đặc biệt",
  password_confirmation_incorrect: "Nhập lại mật khẩu không chính xác",
  update_username: "Username giới hạn trong 3-17 kí tự và không được phép chứa ký tự đặc biệt",
  update_gender: "Bạn thuộc thế giới thứ 3 à, xin lỗi chúng tôi chưa có lựa chọn này",
  update_address: "Địa chỉ giới hạn trong 3-40 kí tự",
  update_phone: "Số điện thoại bắt đầu bằng số 0, giới hạn trong khoảng 10-11 số",
};

export const transError = {
  account_in_use: "Email đã được sử dụng",
  account_not_active: "Email đã được đăng ký nhưng chưa active tài khoản. Vui lòng check email của bạn hoặc liên hệ với bộ phận hỗ trợ của chúng tôi",
  account_removed: "Email này đã bị gỡ khỏi hệ thống, nếu là hiểu nhầm vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi",
  token_undefined: "Token không hợp lệ",
  login_failed: "Tài khoản hoặc mật khẩu không hợp lệ",
  server_error: "Có lỗi ở phía server. Vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi. Xin cảm ơn",
  avatar_type: "Kiểu file không hợp lệ. Chỉ chấp nhận png & jpg",
  avatar_size: "Tối đa cho phép là 1MB",
};

export const transSuccess = {
  userCreated: (userEmail) => {
    return `Tài khoản <strong>${userEmail}</strong> đã được tạo. Vui lòng kiểm tra email để active tài khoản trước khi đăng nhập`;
  },
  account_actived: "Kích hoạt tài khoản thành công. Bạn đã có thể đăng nhập",
  login_success: (username) => {
    return `Xin chào ${username}, chúc bạn một ngày tốt lành`;
  },
  logout_success: "Đăng xuất thành công. Hẹn gặp lại bạn!",
  user_info_updated: "Cập nhật thông tin người dùng thành công",
};

export const transMail = {
  subject: "Xác nhận kích hoạt tài khoản eChat",
  template: (linkVerify) => {
    return `
      <h2>Bạn nhận được email này vì đăng ký tài khoản ứng dụng eChat</h2>
      <h3>Vui lòng click vào link bên dưới để kích hoạt tài khoản</h3>
      <h3><a href="${linkVerify}" target="blank">${linkVerify}</a></h3>
      <h4>Nếu là nhầm lẫn vui lòng bỏ qua email này. Xin cảm ơn</h4>
    `;
  },
  send_failed: "Có lỗi trong qúa trình gửi mail. Vui lòng thử lại"
};
