import nodeMailer from "nodemailer";

let sendMail = (to, subject, htmlContent) => {
  let transporter = nodeMailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    securse: false, //use SSL = TLS
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    }
  });

  let options = {
    from: process.env.MAIL_USER,
    to: to,
    subject: subject,
    html: htmlContent
  };
  return transporter.sendMail(options);
};

module.exports = sendMail;
