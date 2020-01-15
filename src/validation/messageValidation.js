import {check} from "express-validator/check";
import {transValidation} from "./../../lang/vi"
let checkMessageLength = [
    check("messageContent", transValidation.message_incorrect)
        .isLength({min: 1, max: 500})
];

module.exports = {
    checkMessageLength
};
