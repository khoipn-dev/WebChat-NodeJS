import { validationResult } from "express-validator";
import { message } from "../service";

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

module.exports = {
    addNewMessage
};
