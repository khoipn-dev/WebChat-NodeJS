import mongoose from "mongoose";
import bcrypt from "bcrypt";

let Schema = mongoose.Schema;

let UserSchema = new Schema({
  username: String,
  gender: { type: String, default: "male" },
  phone: { type: String, default: null },
  address: { type: String, default: null },
  avatar: { type: String, default: "avatar-default.jpg" },
  role: { type: String, default: "user" },
  local: {
    email: { type: String, trim: true },
    password: String,
    isActive: { type: Boolean, default: false },
    verifyToken: String
  },
  facebook: {
    uid: String,
    token: String,
    email: { type: String, trim: true }
  },
  google: {
    uid: String,
    token: String,
    email: { type: String, trim: true }
  },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: null },
  deleteAt: { type: Number, default: null }
});

UserSchema.statics = {
  createNew(item) {
    return this.create(item);
  },

  findByEmail(email) {
    return this.findOne({ "local.email": email }).exec();
  },

  removeById(id) {
    return this.findByIdAndRemove(id).exec();
  },

  findByToken(token) {
    return this.findOne({ "local.verifyToken": token }).exec();
  },

  findUserById(id) {
    return this.findById(id).exec();
  },

  findUserByIdForSession(id) {
    return this.findById(id, { 'local.password': 0, "local.verifyToken": 0 }).exec();
  },

  getUserData(id) {
    return this.findById(id, {_id: 1, username: 1, address: 1, avatar: 1}).exec();
  },

  verify(token) {
    return this.findOneAndUpdate(
      { "local.verifyToken": token },
      { "local.isActive": true, "local.verifyToken": null }
    ).exec();
  },

  findByFacebookUid(uid) {
    return this.findOne({ "facebook.uid": uid }).exec();
  },

  findByGoogleUid(uid) {
    return this.findOne({ "google.uid": uid }).exec();
  },

  updateUser(id, item) {
    return this.findByIdAndUpdate(id, item).exec();
  },

  updatePassword(id, hashedPassword) {
    return this.findByIdAndUpdate(id, {
      "local.password": hashedPassword
    }).exec();
  },
  /**
   * Tìm user để kết bạn
   * @param {array: deprecatedUserIds} deprecatedUserIds
   * @param {string: keyword search} keyword
   */
  findUserForAddContact(deprecatedUserIds, keyword) {
    return this.find(
      {
        $and: [
          { _id: { $nin: deprecatedUserIds } },
          { "local.isActive": true },
          {
            $or: [
              { username: { $regex: new RegExp(keyword, "i") } },
              { "local.email": keyword },
              { "google.email": keyword },
              { "facebook.email": keyword }
            ]
          }
        ]
      },
      {_id: 1, username: 1, address: 1, avatar: 1}
    ).exec();
  },

  findUserForAddChatGroup(friendIds, keyword) {
    return this.find(
      {
        $and: [
          { _id: { $in: friendIds } },
          { "local.isActive": true },
          {
            $or: [
              { username: { $regex: new RegExp(keyword, "i") } },
              { "local.email": keyword },
              { "google.email": keyword },
              { "facebook.email": keyword }
            ]
          }
        ]
      },
      {_id: 1, username: 1, address: 1, avatar: 1}
    ).exec();
  }
};

UserSchema.methods = {
  comparePassword(password) {
    return bcrypt.compare(password, this.local.password); // return Promise kết quả true hoặc false
  }
};

module.exports = mongoose.model("user", UserSchema);
