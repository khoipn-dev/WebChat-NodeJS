import { contact } from "./../service";
import { validationResult } from "express-validator/check";

let findUserContact = async (req, res) => {
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
    let keyword = req.params.keyword;

    let users = await contact.findUserContact(currentUserId, keyword);
    return res.render("main/contact/sections/_findUserContact", { users });
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
  findUserContact
};
