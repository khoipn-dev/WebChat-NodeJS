import { validationResult } from "express-validator";
import {contact, message} from "../service";
import multer from "multer";
import {app} from "../config/app";
import {transError} from "../../lang/vi";
import fsExtra from"fs-extra";
import {bufferToBase64} from "./../helpers/clientHelper";
import ejs from "ejs";
import {promisify} from "util";

// Chuyển function ejs.renderFile thành promise
const renderFile = promisify(ejs.renderFile).bind(ejs);

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

let readMoreAllChat = async (req, res) => {
    try {
        let skipPersonal = +(req.query.skipPersonal);
        let skipGroup = +(req.query.skipGroup);

        let nextAllChat = await message.readMoreAllChat(req.user._id, skipPersonal, skipGroup);
        let dataForRender = {
            user: req.user,
            nextAllChat,
            getLastItemOfArray,
            timeStampToHumanTime,
            bufferToBase64
        };

        let leftSideHTML = await renderFile("src/views/main/readMoreConversation/_leftSide.ejs", dataForRender);
        let rightSideHTML = await renderFile("src/views/main/readMoreConversation/_rightSide.ejs", dataForRender);
        let imageModalHTML = await renderFile("src/views/main/readMoreConversation/_imageModal.ejs", dataForRender);
        let attachmentModalHTML = await renderFile("src/views/main/readMoreConversation/_attachmentModal.ejs", dataForRender);

        return res.status(200).send({leftSideHTML, rightSideHTML, imageModalHTML, attachmentModalHTML});
    } catch (error) {
        return res.status(500).send(error);
    }
};

let readMore = async (req, res) => {
    try {
        let skipMessage = +(req.query.skipMessage);
        let targetId = req.query.targetId;
        let isChatGroup = (req.query.isChatGroup === "true");


        let nextMessage = await message.readMore(req.user._id, skipMessage, targetId, isChatGroup);
        let dataForRender = {
            user: req.user,
            nextMessage,
            bufferToBase64
        };
        let rightSideHTML = await renderFile("src/views/main/readMoreMessage/_rightSide.ejs", dataForRender);
        let imageModalHTML = await renderFile("src/views/main/readMoreMessage/_imageModal.ejs", dataForRender);
        let attachmentModalHTML = await renderFile("src/views/main/readMoreMessage/_attachmentModal.ejs", dataForRender);

        return res.status(200).send({rightSideHTML, imageModalHTML, attachmentModalHTML});
    } catch (error) {
        return res.status(500).send(error);
    }
};

module.exports = {
    addNewMessage,
    addNewImage,
    addNewAttachment,
    readMoreAllChat,
    readMore
};
