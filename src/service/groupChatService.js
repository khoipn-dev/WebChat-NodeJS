import _ from "lodash";
import ChatGroupModel from "./../model/chatGroupModel";

let addNewGroup = (currentUserId, arrMemberId, groupChatName) => {
    return new Promise(async (resolve, reject) => {
        try {
            arrMemberId.unshift({userId: `${currentUserId}`});

            arrMemberId = _.uniqBy(arrMemberId, "userId");

            let groupChatItem = {
                name: groupChatName,
                userAmount: arrMemberId.length,
                userId: `${currentUserId}`,
                members: arrMemberId,
            };

            let newGroupChat = await ChatGroupModel.createNew(groupChatItem);

            return resolve(newGroupChat);
        } catch (err) {
            return reject(err);
        }
    })
};

module.exports = {
    addNewGroup
};
