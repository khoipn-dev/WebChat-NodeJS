import UserModel from "./../model/userModel";
import { Promise } from "mongoose";
import { resolve } from "path";
import { rejects } from "assert";
import {transError} from "./../../lang/vi";
import bcrypt from "bcrypt";

const saltRound = 7;

let updateUser = (id, item) => {
  return UserModel.updateUser(id, item);
};

let updatePassword = (id, updateData) => {
  return new Promise(async (resolve, reject) => {
    let currentUser = await UserModel.findUserById(id);
    if (!currentUser) {
      return reject(transError.account_undefined);
    }

    let checkCurrentPassword = await currentUser.comparePassword(updateData.currentPassword);

    if (!checkCurrentPassword) {
      return reject(transError.user_current_password_failed);
    }

    let salt = bcrypt.genSaltSync(saltRound);

    await UserModel.updatePassword(id, bcrypt.hashSync(updateData.newPassword, salt));
    resolve(true);
  });
};

module.exports = {
  updateUser: updateUser,
  updatePassword: updatePassword
};
