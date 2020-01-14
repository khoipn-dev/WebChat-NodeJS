import mongoose from "mongoose";

let Schema = mongoose.Schema;

let MessageSchema = new Schema({
  senderId: String,
  receiverId: String,
  conversationType: String,
  messageType: String,
  sender: {
    id: String,
    name: String,
    avatar: String
  },
  receiver: {
    id: String,
    name: String,
    avatar: String
  },
  text: String,
  file: {data: Buffer, contentType: String, fileName: String},
  createdAt: {type: Number, default: Date.now},
  updatedAt: {type: Number, default: null},
  deleteAt: {type: Number, default: null}
});

const MESSAGE_TYPE = {
  TEXT: "text",
  IMAGE: "image",
  FILE: "file"
};

const CONVERSATION_TYPE = {
  PERSONAL: "personal",
  GROUP: "group"
};

MessageSchema.statics = {
  createNew(item) {
    return this.create(item);
  },

  getPersonalMessages(senderId, receiverId, limit) {
    return this.find({
      $or: [
          { $and: [
            {senderId: senderId},{receiverId: receiverId}
            ]},
          { $and: [
              {senderId: receiverId},{receiverId: senderId}
              ]}
      ]
    }).sort({createdAt: 1}).limit(limit).exec();
  },

  getGroupMessages(receiverId, limit) {
    return this.find({ receiverId: receiverId }).sort({createdAt: 1}).limit(limit).exec();
  },
};

module.exports = {
  model: mongoose.model("message", MessageSchema),
  conversationType: CONVERSATION_TYPE,
  messageType: MESSAGE_TYPE
};
