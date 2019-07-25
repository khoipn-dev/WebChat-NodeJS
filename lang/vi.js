export const transValidation = {
  email_incorrect: "Email không hợp lệ",
  gender_incorrect: "Vui lòng nhập giới tính",
  password_incorrect: "Mật khẩu phải chứa ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và kí tự đặc biệt",
  password_confirmation_incorrect: "Nhập lại mật khẩu không chính xác"
};

export const transError = {
  account_in_use: "Email đã được sử dụng",
  account_not_active: "Email đã được đăng ký nhưng chưa active tài khoản. Vui lòng check email của bạn hoặc liên hệ với bộ phận hỗ trợ của chúng tôi",
  account_removed: "Email này đã bị gỡ khỏi hệ thống, nếu là hiểu nhầm vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi"
};

export const transSuccess = {
  userCreated: (userEmail) => {
    return `Tài khoản <strong>${userEmail}</strong> đã được tạo. Vui lòng kiểm tra email để active tài khoản trước khi đăng nhập`;
  }
};