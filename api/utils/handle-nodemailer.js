require("dotenv").config();
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

exports.reset_password_mail = async (userId, username, email, token) => {
  const link = `http://osicrypto.com/reset-password?usr=${userId}&token=${token}`;
  const fallback = `http://osicrypto.com/reset-password?usr=${userId}&fallback=${token}`;

  const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const Mailgenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Osicrypto",
      link: "osicrypto.com",
      copyright: "Copyright © 2023 Osicrypto. All rights reserved.",
    },
  });

  const mail = await Mailgenerator.generate({
    body: {
      name: username,
      intro: "Password reset request",
      action: {
        instructions: `Click button to change password`,
        button: {
          color: "#22BC66",
          fallback: fallback,
          text: "Reset password",
          link: link,
        },
      },
    },
  });
  const currentDate = new Date();

  transporter.sendMail({
    from: "Osicrypto",
    to: email,
    date: currentDate.getUTCDate(),
    subject: "Reset Password",
    html: mail,
  });
};

exports.verify_mail_token = async (userId, username, email, token) => {
  const link = `http://osicrypto.com/user?usr=${userId}&token=${token}`;
  const fallback = `http://osicrypto.com/user?usr=${userId}&fallback=${token}`;

  const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const Mailgenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Osicrypto",
      link: "osicrypto.com",
      copyright: "Copyright © 2023 Osicrypto. All rights reserved.",
    },
  });

  const mail = await Mailgenerator.generate({
    body: {
      name: username,
      intro: "Confirm the email address",
      action: {
        instructions: `Click button to confirm your email address`,
        button: {
          color: "#22BC66",
          fallback: fallback,
          text: "Confirm the email",
          link: link,
        },
      },
    },
  });
  const currentDate = new Date();

  transporter.sendMail({
    from: "Osicrypto",
    to: email,
    date: currentDate.getUTCDate(),
    subject: "Email Confirmation",
    html: mail,
  });
};

exports.completed_registration = async (username, email) => {
  const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const Mailgenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Osicrypto",
      link: "osicrypto.com",
      copyright: "Copyright © 2023 Osicrypto. All rights reserved.",
    },
  });

  const mail = await Mailgenerator.generate({
    body: {
      name: username,
      intro: "Thank you for registering with us",
      intro: [
        "Your registration was successful. Welcome to Osicrypto!",
        "With your Customer Account, you can receive Bitcoin cashback, track your exchange history and operation statuses.",
      ],
      intro:
        "Don't hesitate to make your first <a href='http://osicrypto.com' target='_blank' rel='noopener noreferrer'>crypto exchange</a> and experience our service right now!",
      outro: [
        "Need help, or have questions?",
        "Just reply to this email, we'd love to help.",
      ],
      instructions: "",
      button: {
        text: "Read our FAQ",
        link: "https://osicrypto.com/faq",
      },
    },
  });
  const currentDate = new Date();

  transporter.sendMail({
    from: "Osicrypto",
    to: email,
    date: currentDate.getUTCDate(),
    subject: "Registration completion",
    html: mail,
  });
};
