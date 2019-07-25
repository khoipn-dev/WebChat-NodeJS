import UserModel from "./../model/userModel";
import bcrypt from "bcrypt";
import uuidv4 from "uuid/v4";
import {transError, transSuccess} from "./../../lang/vi";

let saltRounds = 7;


let register = async (email, gender, password) => {
  return new Promise( async (resolve, reject) => {
    let userByEmail = await UserModel.findByEmail(email);
    // Nếu email đã đăng ký
    if (userByEmail) {
      // Account đã bị xoá
      if (userByEmail.deleteAt != null) {
        return reject(transError.account_removed);
      }
      // Account chưa active
      if (!userByEmail.local.isActive) {
        return reject(transError.account_not_active);
      }
      return reject(transError.account_in_use);
    }
    let salt = bcrypt.genSaltSync(saltRounds);
    // Tạo object thông tin đăng ký
    let userItem = {
      username: email.split("@")[0],
      gender: gender,
      local: {
        email: email,
        password: bcrypt.hashSync(password, salt),
        verifyToken: uuidv4()
      }
    };
    let user = await UserModel.createNew(userItem);
    resolve(transSuccess.userCreated(user.local.email));
  });
};

module.exports = {
  register: register
};
