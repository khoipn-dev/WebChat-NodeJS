import {check} from "express-validator/check";
import {transValidation} from "./../../lang/vi"
let addNewGroupChat = [
    check("arrUserId", transValidation.add_new_group_userId_incorrect)
        .custom((value) => {
            if (!Array.isArray(value) && value.length < 2) {
                return false;
            }
            return true;
        }),
    check("groupChatName", transValidation.add_new_group_groupName_incorrect)
        .isLength({min: 5, max: 40})
        .matches(/^[@.\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/),
];

module.exports = {
    addNewGroupChat
};
