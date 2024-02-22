import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import asyncHandler from "../utils/asyncHandler.js";
let nodeConfig = {
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL, // generated ethereal user
    pass: process.env.PASSWORD, // generated ethereal password
  },
};

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Mailgen",
    link: "https://mailgen.js/",
  },
});

const registerMail = asyncHandler(async (req, res) => {
  const { userName, userEmail, text, subject } = req.body;
  var email = {
    body: {
      name: userName,
      intro: text || "",
      outor: "",
    },
  };

  var emailBody = MailGenerator.generate(email);

  let message = {
    from: process.env.EMAIL,
    to: userEmail,
    subject: subject || "Signup Successful",
    html: emailBody,
  };

  //   send mail

  transporter
    .sendMail(message)
    .then(() => {
      res.status(200).send({ msg: "You should receive an email from us." });
    })
    .catch((error) => res.status(500).send({ error }));
});

export default registerMail;
