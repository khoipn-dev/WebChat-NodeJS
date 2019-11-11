import mongoose from "mongoose";

let Schema = mongoose.Schema;

let ContactSchema = new Schema({
  userId: String,
  contactId: String,
  status: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: null },
  deleteAt: { type: Number, default: null }
});

ContactSchema.statics = {
  createNew(item) {
    return this.create(item);
  },

  findAllByUser(userId) {
    return this.find({
      $or: [{ userId: userId }, { contactId: userId }]
    }).exec();
  },
  /**
   * Kiểm tra 2 user đã là bạn bè chưa
   * @param {string} userId
   * @param {string} contactId
   */
  checkExists(userId, contactId) {
    return this.findOne({
      $or: [
        { $and: [{ userId: userId }, { contactId: contactId }] },
        { $and: [{ userId: contactId }, { contactId: userId }] }
      ]
    }).exec();
  },

  removeContact(userId, contactId) {
    return this.deleteOne({
      $or: [
        { $and: [{ userId: userId }, { contactId: contactId }, { status: true }] },
        { $and: [{ userId: contactId }, { contactId: userId }, { status: true }] }
      ]
    }).exec();
  },
  /**
   * Xoá bản ghi contact
   * @param {string} userId
   * @param {string} contactId
   */
  removeRequest(userId, contactId) {
    return this.deleteOne({
      $and: [{ userId: userId }, { contactId: contactId }, { status: false }]
    }).exec();
  },

  removeInvitation(userId, contactId) {
    return this.deleteOne({
      $and: [{ userId: contactId }, { contactId: userId }, { status: false }]
    }).exec();
  },

  acceptInvitation(userId, contactId) {
    return this.updateOne({
      $and: [{ userId: contactId }, { contactId: userId }, { status: false }]
    }, { status: true }).exec();
  },

  getContacts(userId, limit) {
    return this.find({
      $and: [
        {$or: [
          {userId: userId},
          {contactId: userId}
        ]}
        , {status: true}]
    }).sort({createdAt: -1}).limit(limit).exec();
  },

  getContactsSent(userId, limit) {
    return this.find({
      $and: [{userId: userId}, {status: false}]
    }).sort({createdAt: -1}).limit(limit).exec();
  },

  getContactsReceived(userId, limit) {
    return this.find({
      $and: [{contactId: userId}, {status: false}]
    }).sort({createdAt: -1}).limit(limit).exec();
  },

  countContacts(userId) {
    return this.countDocuments({
      $and: [
        {$or: [
            {userId: userId},
            {contactId: userId}
          ]}
        , {status: true}]
    }).exec();
  },

  countContactsSent(userId) {
    return this.countDocuments({
      $and: [{userId: userId}, {status: false}]
    }).exec();
  },

  countContactsReceived(userId) {
    return this.countDocuments({
      $and: [{contactId: userId}, {status: false}]
    }).exec();
  },

  readMoreContacts(userId, skipNumber, limit) {
    return this.find({
      $and: [
        {$or: [
            {userId: userId},
            {contactId: userId}
          ]}
        , {status: true}]
    }).sort({createdAt: -1}).skip(skipNumber).limit(limit).exec();
  },

  readMoreContactsSent(userId, skipNumber, limit) {
    return this.find({
      $and: [{userId: userId}, {status: false}]
    }).sort({createdAt: -1}).skip(skipNumber).limit(limit).exec();
  },

  readMoreContactsReceived(userId, skipNumber, limit) {
    return this.find({
      $and: [{contactId: userId}, {status: false}]
    }).sort({createdAt: -1}).skip(skipNumber).limit(limit).exec();
  },

};

module.exports = mongoose.model("contact", ContactSchema);
