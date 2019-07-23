import express from "express";
import ConnectDB from "./config/connectDB";
import ContactModel from "./model/contact.model";

let app = express();
// Connect to MongoDB
ConnectDB();

app.get('/test-database',async function (req, res) {
  try {
    let item = {
      userId: "12345",
      contactId: "23243546"
    };
    let contact = await ContactModel.createNew(item);
    res.send(contact);
  } catch (err) {
    console.log(err);
  }
});

app.listen(process.env.APP_PORT, process.env.APP_HOST, () => console.log(`Server running on port: ${process.env.APP_PORT}`));