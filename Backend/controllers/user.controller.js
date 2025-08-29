import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import { otpSender,generateOTP } from "../middleware/otp.middleware.js";
import { BlockedEmail } from "../models/blockedEmails.js";

const otp=generateOTP()
let currOTP=111111;

const generateAccessAndRefreshToken=async(userId)=>{
  try {
    const user=await User.findById(userId)
    const accessToken=user.generateAccessToken();
    const refreshToken=user.generateRefreshToken()
    user.refreshToken=refreshToken
    await user.save({validateBeforeSave:false})
  
    return {accessToken,refreshToken}

  } catch (error) {
    throw new ApiError(500,"Error in generating access and refresh token",error)
  }
}

const registerUser=asyncHandler(async(req,res)=>{
    const {email,nickname,password,username}=req.body;
    if([email,nickname,password].some((field)=>field?.trim()==="")){
       throw new ApiError(400,"All fields must be present")
    }

    const blocked=await BlockedEmail.findOne({email:email})
    if(blocked){
    const blocktime=blocked.bannedTill
    if(blocktime<Date.now()){
      throw new ApiError(400,"Your account is temproraily banned due to various reports")
    }
    else{
      await BlockedEmail.deleteOne({email})
    }
    }

    const existingUser=await User.findOne({email})
    if(existingUser){
        throw new ApiError(400,"User with email already exists")
    }

    if(username){
    const user=await User.create({
        email,
        nickname,
        password,
        username
    })

    if(!user){
       throw new ApiError(400,"User creation failed")
    }

    const createdUser=await User.findById(user._id).select("-password -refreshToken")

    return res
    .status(200)
    .json(200,createdUser,"User creation successful")
    }

    else{
      const user=await User.create({
        email,
        nickname,
        password
      })
      if(!user){
        throw new ApiError(400,"User creation failed")
      }

      const createdUser=await User.findById(user._id).select("-password -refreshToken")

      return res
      .status(200)
      .json(
        new ApiResponse(200,createdUser,"User creation successful")
      )
    }
})

const loginUser=asyncHandler(async(req,res)=>{
  const {email,password}=req.body
  if([email,password].some((field)=>field?.trim()==="")){
    throw new ApiError(400,"Please enter email address and password to proceed")
  }
  const blocked=await BlockedEmail.findOne({email:email})
  if(blocked){
    const blocktime=blocked.bannedTill
    if(blocktime<Date.now()){
      throw new ApiError(400,"Your account is temproraily banned due to various reports")
    }
    else{
      await BlockedEmail.deleteOne({email})
    }
  }

  const user=await User.findOne({email})
  if(!user){
    throw new ApiError(400,"User with given mail id do not exist")
  }

  const passwordCorrect=await user.isPasswordCorrect(password)
  if(!passwordCorrect){
      throw new ApiError(400,"User password is incorrect")
  }

  const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id)
  const loggedInuser=await User.findById(user._id).select("-password -refreshToken")
  const options={
    httpOnly:true,
    secure:true
  }

  return res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(
      200,
      {user:loggedInuser,accessToken,refreshToken},
      "User logged in successfully"
    )
  )
})

const logOutUser=asyncHandler(async(req,res)=>{
  const user=await User.findById(req.user?._id)
  if(!user){
    throw new ApiError(400,"User is not logged in")
  }

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset:{
        refreshToken:1
      }
    },
    {
      new:true
    }
  )

  const options={
    httpOnly:true,
    secure:true
  }

  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(
    new ApiResponse(200,{},"User logged out successfully")
  )

})

const refreshAccessToken=asyncHandler(async(req,res)=>{
  const incomingRefreshToken=req.cookies.refreshToken||req.body.refreshToken
  if(!incomingRefreshToken){
    throw new ApiError(400,"Unauthorized request")
  }

  try {
    const decodedToken=jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )
    
    const user=await User.findById(decodedToken._id)
    if(!user){
      throw new ApiError(400,"Unauthorized request")
    }

    if(incomingRefreshToken!==user?.refreshToken){
      throw new ApiError(400,"Refresh token not matched with user refresh token")
    }
    const options={
      httpOnly:true,
      secure:true
    }

    const {accessToken,newRefreshToken}=await generateAccessAndRefreshToken(user._id)

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",newRefreshToken,options)
    .json(
      new ApiResponse(200,
        {accessToken,refreshToken:newRefreshToken},
        "Refreshed Access Token successfully"
      )
    )
  } catch (error) {
    throw new ApiError(500,"Error in refreshing access token",error)
  }

})

const changePassword=asyncHandler(async(req,res)=>{
  const user=await User.findById(req.user?._id)
  if(!user){
    throw new ApiError(400,"Unauthorized request. LogIn or Sign Up first")
  }

  const {oldPassword,newPassword}=req.body
  if([oldPassword,newPassword].some((field)=>field?.trim()==="")){
    throw new ApiError(404,"Password is required to change password")
  }

  const passwordCorrect=await user.isPasswordCorrect(oldPassword)
  if(!passwordCorrect){
    throw new ApiError(404,"The password you entered doesn't match your old password")
  }
  const newUser=await User.findByIdAndUpdate(
    user._id,{
      $set:{
        password:newPassword
      }
    },
    {
      new:true
    }
  )
  if(!newUser){
    throw new ApiError(500,"Sorry some db or server error")
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200,{},"Password changed successfully")
  )

})

const sendOTP=asyncHandler(async(req,res)=>{
  const {emailId}=req.body;
  if(!emailId){
    throw new ApiError(400,"Unauthorized user")
  }
  
  await otpSender(otp,emailId);
  const user=await User.findOne({email:emailId})
  if(!user){
    throw new ApiError(404,"No such user exists")
  }
  const currOTP=otp
  user.otp=currOTP
  user.otpExpiry=Date.now()+5*60*1000
  await user.save({validateBeforeSave:false})

  return res
  .status(200)
  .json(
    new ApiResponse(200,{},"Sent OTP")
  )
})

const verifyOTP=asyncHandler(async(req,res)=>{
  const {emailId,receivedOTP}=req.body
  if(!emailId||!receivedOTP){
    throw new ApiError(404,"Can't proceed without otp and email entering")
  }

  const user=await User.findOne({email:emailId})

  if(receivedOTP!=user.otp){
    throw new ApiError(400,"OTP passed is invalid")
  }
  if(receivedOTP==user.otp && Date.now()>user.otpExpiry){
    throw new ApiError(400,"OTP has expired")
  }

  await user.updateOne(
    {
      $set:{OTPVerified:1}
    }
  )

  return res
  .status(200)
  .json(
    new ApiResponse(200,{},"OTP verified successfully")
  )
})

const resetPassword=asyncHandler(async(req,res)=>{
  const {emailId,newPassword}=req.body
  if([emailId,newPassword].some((field)=>field.trim()==="")){
    throw new ApiError(400,"Email id and password are required to continue")
  }

  const user=await User.findOne({email:emailId})
  if(!user){
    throw new ApiError(404,"Email Id is invalid")
  }

  const verified=user.OTPVerified
  if(!verified){
    throw new ApiError(400,"Your otp is not verified")
  }

  const passwordUpdate=await user.updateOne({
    password:newPassword
  })
  if(!passwordUpdate){
    throw new ApiError(400,"Password not changed")
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200,{},"Password updated succesfully")
  )

})

const getCurrentUser=asyncHandler(async(req,res)=>{
    const userId=req.user?._id
    const user=await User.findById(userId).select("-password -refreshToken");
    if(!user){
      throw new ApiError(400,"User does not exist")
    }

    return res
    .status(200)
    .json(
      new ApiResponse(200,user,"User details fetched successfully")
    )
})

const googleLogin=asyncHandler(async(req,res)=>{
  const {idToken}=req.body
  if(!tokenId){
    throw new ApiError(400,"Id token not recieved for google login")
  }

  const ticket=await client.verifyIdToken({
    idToken,
    audience:process.env.GOOGLE_CLIENT_ID
  })
  const payload=ticket.getPayload();
  const {email,name,picture,sub}=payload;

  let user=await User.findOne({email:email})
  if(!user){
    user=await User.create({
      email:email,
      googleId:sub,
      username:name,
      provider:"google",
      picture,
      otpVerified:true
    })
  }

   const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

   const options = {
    httpOnly: true,
    sameSite:"lax",
    secure: process.env.NODE_ENV === "production"
    };

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
      new ApiResponse(200,{ user: { id: user._id, email: user.email, username: user.username, picture: user.picture }, accessToken, refreshToken },
      "Google login successful")
    )
})

export {registerUser,loginUser,logOutUser,refreshAccessToken,changePassword,sendOTP,verifyOTP,resetPassword,getCurrentUser,googleLogin}