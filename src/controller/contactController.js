import {contact, notification} from "./../service";
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

let addNew = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let newContact = await contact.addNew(currentUserId, contactId);

    return res.status(200).send({ success: !!newContact });
  } catch (error) {
    return res.status(500).send(error);
  }
};

let removeRequest = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let removeReq = await contact.removeRequest(currentUserId, contactId);

    return res.status(200).send({ success: !!removeReq });
  } catch (error) {
    return res.status(500).send(error);
  }
};

let removeInvitation = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let removeReq = await contact.removeInvitation(currentUserId, contactId);

    return res.status(200).send({ success: !!removeReq });
  } catch (error) {
    return res.status(500).send(error);
  }
};

let readMoreContacts = async (req, res) => {
  try {
    let skipNumber = +(req.query.skipNumber);
    let nextContacts = await contact.readMoreContacts(req.user._id, skipNumber);
    return res.status(200).send(nextContacts);
  } catch (error) {
    return res.status(500).send(error);
  }
};

let readMoreContactsSent = async (req, res) => {
  try {
    let skipNumber = +(req.query.skipNumber);
    let nextContactsSent = await contact.readMoreContactsSent(req.user._id, skipNumber);
    return res.status(200).send(nextContactsSent);
  } catch (error) {
    return res.status(500).send(error);
  }
};

let readMoreContactsReceived = async (req, res) => {
  try {
    let skipNumber = +(req.query.skipNumber);
    let nextContactsReceived = await contact.readMoreContactsReceived(req.user._id, skipNumber);
    return res.status(200).send(nextContactsReceived);
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
  findUserContact,
  addNew,
  removeRequest,
  removeInvitation,
  readMoreContacts,
  readMoreContactsSent,
  readMoreContactsReceived,
};
