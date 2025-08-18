import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Vote } from "../models/vote.model.js";

const toggleUpvotePost=asyncHandler(async(req,res)=>{
    const {postId}=req.params
    const {vote}=req.query

    const upvote=await Vote.findOne({
        upvote:true,
        owner:req.user?._id,
        post:postId
    })
    const downvote=await Vote.findOne({
        downvote:true,
        owner:req.user?._id,
        post:postId
    })

    if(upvote){
        const deleteVote=await Vote.deleteOne({owner:req.user?._id, post:postId})
        if(!deleteVote){
            throw new ApiError(400,"Vote deletion failed")
        }
        
        return res
        .status(200)
        .json(
            new ApiResponse(200,{},"Vote deleted successfully")
        )
    }
    
    else if(downvote){
        const deleteVote=await Vote.deleteOne({owner:req.user?._id, post:postId})
        if(!deleteVote){
        throw new ApiError(400,"Vote deletion failed")
        }
    
        return res
        .status(200)
        .json(
            new ApiResponse(200,{},"Vote deleted successfully")
        )
    }

        if(vote==true){
        const upvote=await Vote.create({
            owner:req.user?._id,
            post:postId,
            upvote:true
        })
        if(!upvote){
            throw new ApiError(400,"There was some error in creating upvote")
        }
        return res
        .status(200)
        .json(
            new ApiResponse(200,upvote,"Upvote posted successfully")
        )
        }

        else{
        const downvote=await Vote.create({
            owner:req.user?._id,
            post:postId,
            downvote:true
        })
        if(!downvote){
            throw new ApiError(400,"There was some error in creating downvote")
        }
        return res
        .status(200)
        .json(
            new ApiResponse(200,downvote,"Downvote posted successfully")
        )
        }
    
})

const toggleUpvoteComment=asyncHandler(async(req,res)=>{
    const {commentId}=req.params
    const {vote}=req.query

    const upvote=await Vote.findOne({
        upvote:true,
        owner:req.user?._id,
        comment:commentId
    })
    const downvote=await Vote.findOne({
        downvote:true,
        owner:req.user?._id,
        comment:commentId
    })

    if(upvote){
        const deleteVote=await Vote.deleteOne({owner:req.user?._id, comment:commentId})
        if(!deleteVote){
            throw new ApiError(400,"Vote deletion failed")
        }
        
        return res
        .status(200)
        .json(
            new ApiResponse(200,{},"Vote deleted successfully")
        )
    }
    
    else if(downvote){
        const deleteVote=await Vote.deleteOne({owner:req.user?._id, comment:commentId})
        if(!deleteVote){
        throw new ApiError(400,"Vote deletion failed")
        }
    
        return res
        .status(200)
        .json(
            new ApiResponse(200,{},"Vote deleted successfully")
        )
    }

        if(vote==true){
        const upvote=await Vote.create({
            owner:req.user?._id,
            comment:commentId,
            upvote:true
        })
        if(!upvote){
            throw new ApiError(400,"There was some error in creating upvote")
        }
        return res
        .status(200)
        .json(
            new ApiResponse(200,upvote,"Upvote posted successfully")
        )
        }

        else{
        const downvote=await Vote.create({
            owner:req.user?._id,
            comment:commentId,
            downvote:true
        })
        if(!downvote){
            throw new ApiError(400,"There was some error in creating downvote")
        }
        return res
        .status(200)
        .json(
            new ApiResponse(200,downvote,"Downvote posted successfully")
        )
        }
    
})

export {toggleUpvotePost,toggleUpvoteComment}