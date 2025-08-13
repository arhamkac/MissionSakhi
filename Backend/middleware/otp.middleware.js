import nodemailer from "nodemailer";

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const otp=generateOTP()

const otpSender=async (otp,emailId) => {
  try {

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "arhamkachhara@gmail.com",
        pass: "mhkrxkhfqqwrnvgy"
      }
    });

    const info = await transporter.sendMail({
      from: '"SakhiVerse" <arhamkachhara@gmail.com>',
      to: `${emailId}`,
      subject: "OTP (One Time Password)",
      text: `This OTP is ${otp}. It is valid for a five minutes only.`,
      html: `<p>Your OTP is <b>${otp}</b>. It is valid for a five minutes only.</p>`
    });

    console.log("Message sent:", info.messageId);
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info) || "No preview URL available");
  } catch (error) {
    console.error("Error. Something went wrong:", error);
  }
}

export {otpSender,generateOTP}
