import UserModel from "./../model/userModel";
import bcrypt from "bcrypt";
import uuidv4 from "uuid/v4";
import {transError, transSuccess, transMail} from "./../../lang/vi";
import sendMail from "./../config/mailer";

let saltRounds = 7;


let register = async (email, gender, password, protocol, host) => {
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
    let linkVerify = `${protocol}://${host}/verify/${user.local.verifyToken}`;
    sendMail(user.local.email, transMail.subject, transMail.template(linkVerify))
      .then(success => {
        resolve(transSuccess.userCreated(user.local.email));
      })
      .catch(async error => {
        //send mail failed
        await UserModel.removeById(user._id);
        console.log(error);
        reject(transMail.send_failed);
      })
    resolve(transSuccess.userCreated(user.local.email));
  });
};

let verifyAccount = (token) => {
  return new Promise(async (resolve, reject) => {
    let userByToken = await UserModel.findByToken(token);
    if (!userByToken) {
      return reject(transError.token_undefined);
    }
    await UserModel.verify(token);
    resolve(transSuccess.account_actived);
  });
};

module.exports = {
  register: register,
  verifyAccount: verifyAccount
};
