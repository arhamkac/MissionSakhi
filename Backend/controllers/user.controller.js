import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

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

  const user=await User.findOne({email})
  if(!user){
    throw new ApiError(400,"User with given mail id do not exist")
  }

  const passwordCorrect=await user.isPasswordCorrect(password)
  if(!passwordCorrect){
      throw new ApiError(400,"User password is correct")
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

export {registerUser,loginUser,logOutUser,refreshAccessToken,changePassword}