import {validationResult} from "express-validator";
import {groupChat} from "../service";

let addNewGroupChat = async (req, res) => {
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
        let currentUserId = req.user._id;
        let arrMemberId = req.body.arrUserId;
        let groupChatName = req.body.groupChatName;

        let newGroupChat = await groupChat.addNewGroup(currentUserId, arrMemberId, groupChatName);

        return res.status(200).send({groupChat: newGroupChat});
    } catch (error) {
        return res.status(500).send(error);
    }
};

module.exports = {
    addNewGroupChat
};
