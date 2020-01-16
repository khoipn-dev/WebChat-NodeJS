import { validationResult } from "express-validator";
import { message } from "../service";
import multer from "multer";
import {app} from "../config/app";
import {transError} from "../../lang/vi";
import fsExtra from"fs-extra";

// Xử lý tin nhắn văn bản và emoji
let addNewMessage = async (req, res) => {
    let errorArr = [];
    //validationResult(req) trả về 1 mảng các trường không valid
    let validationError = validationResult(req);

    if (!validationError.isEmpty()) {
        // Lấy tất cả value của object cho vào mảng
        let error = Object.values(validationError.mapped());
        // Lấy ra msg và gán vào errorArr
        error.forEach(item => errorArr.push(item.msg));
        return res.status(500).send(errorArr);
    }

    try {
        let sender = {
            id: req.user._id,
            name: req.user.username,
            avatar: req.user.avatar
        };
        let receiverId = req.body.uid;
        let messageContent = req.body.messageContent;
        let isGroup = req.body.isGroup;
        let newMessage = await message.addNewMessage(sender, receiverId, messageContent, isGroup);

        res.status(200).send({message: newMessage});
    } catch (error) {
        res.status(500).send(error);
    }
};

let $StorageImageMessage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, app.image_message_directory);
    },
    filename: (req, file, callback) => {
        let math = app.image_message_type;
        if (math.indexOf(file.mimetype) === -1) {
            return callback(transError.image_message_type);
        }

        let $ImageName = file.originalname;
        callback(null, $ImageName);
    }
});

let imageMessageUpload = multer({
    storage: $StorageImageMessage,
    limits: { fileSize: app.image_message_limit_size }
}).single("image-message");

// Xử lý tin nhắn hình ảnh
let addNewImage = (req, res) => {
    imageMessageUpload(req, res , async (error) => {
        if (error) {
            if (error.message) {
                return res.status(500).send(transError.image_message_size);
            }
            return res.status(500).send(error);
        }

        try {
            let sender = {
                id: req.user._id,
                name: req.user.username,
                avatar: req.user.avatar
            };
            let receiverId = req.body.uid;
            let messageContent = req.file;
            let isGroup = req.body.isGroup;
            let newMessage = await message.addNewImageMessage(sender, receiverId, messageContent, isGroup);
            await fsExtra.remove(`${app.image_message_directory}/${newMessage.file.fileName}`);
            res.status(200).send({message: newMessage});
        } catch (error) {
            res.status(500).send(error);
        }
    });
};

// Xử lý tin nhắn file đính kèm
let $StorageAttachmentMessage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, app.attachment_message_directory);
    },
    filename: (req, file, callback) => {
        let attachmentName = file.originalname;
        callback(null, attachmentName);
    }
});

let attachmentMessageUpload = multer({
    storage: $StorageAttachmentMessage,
    limits: { fileSize: app.attachment_message_limit_size }
}).single("attachment-message");

let addNewAttachment = (req, res) => {
    attachmentMessageUpload(req, res , async (error) => {
        if (error) {
            if (error.message) {
                return res.status(500).send(transError.attachment_message_size);
            }
            return res.status(500).send(error);
        }

        try {
            let sender = {
                id: req.user._id,
                name: req.user.username,
                avatar: req.user.avatar
            };
            let receiverId = req.body.uid;
            let messageContent = req.file;
            let isGroup = req.body.isGroup;
            let newMessage = await message.addNewAttachmentMessage(sender, receiverId, messageContent, isGroup);

            await fsExtra.remove(`${app.attachment_message_directory}/${newMessage.file.fileName}`);

            res.status(200).send({message: newMessage});
        } catch (error) {
            res.status(500).send(error);
        }
    });
};

module.exports = {
    addNewMessage,
    addNewImage,
    addNewAttachment
};
