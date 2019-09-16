import { notification } from "./../service"

let readMore = async (req, res) => {
  try {
    let skipNumber = +(req.query.skipNumber);
    
    let nextNotification = await notification.readMore(req.user._id, skipNumber);
    return res.status(200).send(nextNotification);
  } catch (error) {
    return res.status(500).send(error);
  }
}

module.exports = {
  readMore
}
