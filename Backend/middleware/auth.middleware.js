import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { getAdmin } from "../utils/firebaseAdmin.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) throw new ApiError(401, "Unauthorized request — no token provided");

    let user = null;

    // 1. Try verifying as our own JWT first (fast, no network call)
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      user = await User.findById(decoded?._id).select("-password -refreshToken");
    } catch {
      // Not a valid backend JWT — try Firebase ID token
    }

    // 2. Fall back to Firebase Admin token verification
    if (!user) {
      try {
        const decoded = await getAdmin().auth().verifyIdToken(token);
        user = await User.findOne({ email: decoded.email }).select("-password -refreshToken");
      } catch {
        throw new ApiError(401, "Invalid or expired token");
      }
    }

    if (!user) throw new ApiError(401, "User not found");

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Authorization error");
  }
});
