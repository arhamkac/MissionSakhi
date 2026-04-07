import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { otpSender, generateOTP } from "../middleware/otp.middleware.js";
import { BlockedEmail } from "../models/blockedEmails.js";
import { getAdmin } from "../utils/firebaseAdmin.js";

const otp = generateOTP();
let currOTP = 111111;

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error in generating access and refresh token", error);
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, nickname, password, username } = req.body;

  if ([email, password].some((f) => f?.trim() === "")) {
    throw new ApiError(400, "All fields must be present");
  }

  const blocked = await BlockedEmail.findOne({ email });
  if (blocked) {
    if (blocked.bannedTill < Date.now()) {
      throw new ApiError(400, "Your account is temporarily banned due to various reports");
    } else {
      await BlockedEmail.deleteOne({ email });
    }
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ApiError(400, "User with email already exists");

  const user = await User.create({ email, nickname, password, ...(username && { username }) });
  if (!user) throw new ApiError(400, "User creation failed");

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  return res.status(200).json(new ApiResponse(200, createdUser, "User creation successful"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((f) => f?.trim() === "")) {
    throw new ApiError(400, "Please enter email address and password to proceed");
  }

  const blocked = await BlockedEmail.findOne({ email });
  if (blocked) {
    if (blocked.bannedTill < Date.now()) {
      throw new ApiError(400, "Your account is temporarily banned due to various reports");
    } else {
      await BlockedEmail.deleteOne({ email });
    }
  }

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(400, "User with given email does not exist");

  const passwordCorrect = await user.isPasswordCorrect(password);
  if (!passwordCorrect) throw new ApiError(400, "Incorrect password");

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const isProduction = process.env.NODE_ENV === "production";
  const options = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
});

const logOutUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  if (!user) throw new ApiError(400, "User is not logged in");

  await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } }, { new: true });

  const isProduction = process.env.NODE_ENV === "production";
  const options = { httpOnly: true, secure: isProduction, sameSite: isProduction ? "None" : "Lax", path: "/" };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) throw new ApiError(400, "Unauthorized request");

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id);
    if (!user) throw new ApiError(400, "Unauthorized request");
    if (incomingRefreshToken !== user?.refreshToken) throw new ApiError(400, "Refresh token mismatch");

    const isProduction = process.env.NODE_ENV === "production";
    const options = { httpOnly: true, secure: isProduction, sameSite: isProduction ? "None" : "Lax" };
    const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Refreshed access token successfully"));
  } catch (error) {
    throw new ApiError(500, "Error in refreshing access token", error);
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  if (!user) throw new ApiError(400, "Unauthorized request");

  const { oldPassword, newPassword } = req.body;
  if ([oldPassword, newPassword].some((f) => f?.trim() === "")) {
    throw new ApiError(404, "Password is required");
  }

  const passwordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!passwordCorrect) throw new ApiError(404, "Old password is incorrect");

  const newUser = await User.findByIdAndUpdate(user._id, { $set: { password: newPassword } }, { new: true });
  if (!newUser) throw new ApiError(500, "Server error updating password");

  return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

const sendOTP = asyncHandler(async (req, res) => {
  const { emailId } = req.body;
  if (!emailId) throw new ApiError(400, "Unauthorized user");

  await otpSender(otp, emailId);
  const user = await User.findOne({ email: emailId });
  if (!user) throw new ApiError(404, "No such user exists");

  user.otp = otp;
  user.otpExpiry = Date.now() + 5 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, "Sent OTP"));
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { emailId, receivedOTP } = req.body;
  if (!emailId || !receivedOTP) throw new ApiError(404, "OTP and email are required");

  const user = await User.findOne({ email: emailId });
  if (receivedOTP != user.otp) throw new ApiError(400, "Invalid OTP");
  if (receivedOTP == user.otp && Date.now() > user.otpExpiry) throw new ApiError(400, "OTP has expired");

  await user.updateOne({ $set: { OTPVerified: 1 } });

  return res.status(200).json(new ApiResponse(200, {}, "OTP verified successfully"));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { emailId, newPassword } = req.body;
  if ([emailId, newPassword].some((f) => f.trim() === "")) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email: emailId });
  if (!user) throw new ApiError(404, "Invalid email");
  if (!user.OTPVerified) throw new ApiError(400, "OTP not verified");

  const passwordUpdate = await user.updateOne({ password: newPassword });
  if (!passwordUpdate) throw new ApiError(400, "Password not changed");

  return res.status(200).json(new ApiResponse(200, {}, "Password updated successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).select("-password -refreshToken");
  if (!user) throw new ApiError(400, "User does not exist");

  return res.status(200).json(new ApiResponse(200, user, "User details fetched successfully"));
});

/**
 * Firebase Google Login
 * Receives a Firebase ID token from the frontend (from signInWithPopup),
 * verifies it with Firebase Admin SDK, then upserts the user in MongoDB
 * and issues our own JWT cookies.
 */
const googleLogin = asyncHandler(async (req, res) => {
  const { tokenId } = req.body;
  if (!tokenId) throw new ApiError(400, "Firebase ID token not received");

  // Verify the Firebase ID token — works for Google sign-in AND email/password sign-in
  let decodedToken;
  try {
    decodedToken = await getAdmin().auth().verifyIdToken(tokenId);
  } catch (err) {
    throw new ApiError(401, "Invalid or expired Firebase token");
  }

  const { email, name, picture, uid } = decodedToken;

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      email,
      googleId: uid,
      username: name,
      provider: "google",
      picture,
      OTPVerified: true,
    });
  } else if (!user.googleId) {
    // Link Google to existing account
    user.googleId = uid;
    user.provider = "google";
    if (picture) user.picture = picture;
    await user.save({ validateBeforeSave: false });
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  const isProduction = process.env.NODE_ENV === "production";
  const options = {
    httpOnly: true,
    sameSite: isProduction ? "None" : "Lax",
    secure: isProduction,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: { id: user._id, email: user.email, username: user.username, picture: user.picture }, accessToken, refreshToken },
        "Google login successful"
      )
    );
});

export {
  registerUser, loginUser, logOutUser, refreshAccessToken,
  changePassword, sendOTP, verifyOTP, resetPassword, getCurrentUser, googleLogin,
};
