import nodemailer from "nodemailer";

export const sendEmail_Util = async ({ to, subject, htmlBody }) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "login",
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    let mailOptions = {
      to: to,
      subject: subject,
      html: htmlBody,
    };
    await transporter.sendMail(mailOptions);
    return {
      ok: true,
      message: "Email sent",
    };
  } catch (error) {
    return new Error("Error while sending email");
  }
};
