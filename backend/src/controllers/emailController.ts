import { Request, Response } from "express";
import { createTransport } from "nodemailer";

const transporter = createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "trailblazetravelsupport@gmail.com",
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  }
})

export const sendEmail = async (req: Request, res: Response) => {
  try {
    const {email, subject, message} = req.body;
    if (!email || !subject || !message) {
      return res.status(400).json({ error: "Email subject and message is required."});
    }

    const mailOptions = {
      from: "trailblazetravelsupport@gmail.com",
      to: email,
      subject: subject,
      text: message
    }
    await transporter.sendMail(mailOptions);
    res.status(200).json({message: "Email sent successfully!"})
  } catch (error) {
    console.error("Email error: ", error);
    res.status(500).json({message: "Error in sending email"})
  }
}