import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Post} from "../models/post.model.js"
import { User } from "../models/user.model.js";
import {Comment} from "../models/comment.model.js"
import mongoose, { Types } from "mongoose";

const postComment=asyncHandler(async(req,res)=>{
    const {postId}=req.params
    const post=await Post.findById(postId)
    if(!post){
        throw new ApiError(400,"Post does not exist")
    }

    const {content}=req.body
    const comment=await Comment.create({
        content:content,
        post:postId,
        postedBy:req.user?._id
    })
    if(!comment){
        throw new ApiError(400,"Comment could not be created")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,comment,"Comment posted succesfully")
    )
})

const updateComment=asyncHandler(async(req,res)=>{
    const {commentId}=req.params
    const commt=await Comment.findById(commentId)
    if(!commt){
        throw new ApiError(400,"Comment does not exist")
    }

    if(commt.postedBy.toString()!==req.user._id.toString()){
        throw new ApiError(400,"You don't have access to edit this post")
    }

    const {content}=req.body
    const comment=await Comment.findByIdAndUpdate(
        commentId,
        {
            $set:{
                content:content
            }
        },
        {new:true}
    )
    if(!comment){
        throw new ApiError(400,"Comment could not be updated due to some issue")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,comment,"Comment posted succesfully")
    )
})

const deleteComment=asyncHandler(async(req,res)=>{
    const {commentId}=req.params
    const commt=await Comment.findById(commentId)
    if(!commt){
        throw new ApiError(400,"Comment does not exist")
    }

    if(commt.postedBy.toString()!==req.user._id.toString()){
        throw new ApiError(400,"You don't have access to delete this post")
    }

    const deleteCommt=await Comment.findByIdAndDelete(commentId)
    if(!deleteComment){
        throw new ApiError(500,"Comment could not be deleted due to some server error")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"Comment deleted successfully")
    )

})

const getPostComments=asyncHandler(async(req,res)=>{
    const {postId}=req.params
    if(!postId){
        throw new ApiError(400,"Please enter post id, you are expecting a love letter without specifiying who it is for")
    }

    const commentagg=[
        {
            $match:{post:new mongoose.Types.ObjectId(postId)}
        },
        {
            $lookup:{
                from:"users",
                localField:"postedBy",
                foreignField:"_id",
                as:"owner",
                pipeline:[
                    {
                        $project:{
                            username:1,
                            nickname:1
                        }
                    }
                ]
            }
        }
    ]

    const comment=await Comment.aggregatePaginate(Comment.aggregate(commentagg),
    {
      $page:1,
      customLabels:{
        docs:"comments"
      }
    }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200,comment,"Post comments fetched successfully")
    )

})

export {postComment,updateComment,deleteComment,getPostComments}