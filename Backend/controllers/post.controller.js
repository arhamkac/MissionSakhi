import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Post} from "../models/post.model.js"
import { User } from "../models/user.model.js";
import {deleteOnCloudinary, uploadOnCloudinary} from "../utils/cloudinary.js"
import { isValidObjectId, Types } from "mongoose";
import { checkPost } from "../app.js";

function extractPublicId(url) {
  const parts = url.split('/');
  const fileName = parts[parts.length - 1];
  const publicId = fileName.split('.')[0]
  return publicId;
}

const uploadPost=asyncHandler(async(req,res)=>{
    const {title,content,category}=req.body
    if([title,content].some((field)=>field.trim()==="") && category.length===0){
        throw new ApiError(400,"Please enter title and content and category for the post to proceed")
    }

    const scores=await checkPost(content);
    if(scores.TOXICITY?.summaryScore.value > 0.6 || scores.SEXUALLY_EXPLICIT?.summaryScore.value > 0.5 ||
    scores.THREAT?.summaryScore.value > 0.5 || scores.INSULT?.summaryScore.value > 0.5||scores.PROFANITY?.summaryScore.value > 0.5){
       throw new ApiError(400,"Post cannot be uploaded due to potential use of flag keywords and content")
    }
    const score=await checkPost(title);
    if(score.TOXICITY?.summaryScore.value > 0.6 || score.SEXUALLY_EXPLICIT?.summaryScore.value > 0.5 ||
    score.THREAT?.summaryScore.value > 0.5 || score.INSULT?.summaryScore.value > 0.5||score.PROFANITY?.summaryScore.value > 0.5){
       throw new ApiError(400,"Post cannot be uploaded due to potential use of flag keywords and content")
    }

    
    const imageLocalPath=req.files?.image[0]?.path
    if(imageLocalPath){
      const uploadedPhoto=await uploadOnCloudinary(imageLocalPath)
      if(!uploadedPhoto){
        throw new ApiError(500,"File upload failed. Sorry for inconvenience")
      }

      const post=await Post.create({
        title:title,
        content:content,
        image:uploadedPhoto?.url,
        category:category,
        owner:req.user?._id
       })
       if(!post){
        throw new ApiError(500,"There was some error in post upload")
       }
       
       return res
       .status(200)
       .json(
        new ApiResponse(200,post,"Post uploaded successfully")
        )
    }

    else{
    const post=await Post.create({
        title:title,
        content:content,
        category:category,
        image:null,
        owner:req.user?._id
    })
    if(!post){
        throw new ApiError(500,"There was some error in creating user")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,post,"Post uploaded succesfully")
    )
    }
})

const updatePost=asyncHandler(async(req,res)=>{
    const {postId}=req.params
    const {title,content}=req.body
    if(!postId){
        throw new ApiError(400,"How can you expect to update the post without giving me its id?")
    }

    if(content){
    const scores=await checkPost(content);
    if(scores.TOXICITY?.summaryScore.value > 0.6 || scores.SEXUALLY_EXPLICIT?.summaryScore.value > 0.5 ||
    scores.THREAT?.summaryScore.value > 0.5 || scores.INSULT?.summaryScore.value > 0.5||scores.PROFANITY?.summaryScore.value > 0.5){
       throw new ApiError(400,"Post cannot be uploaded due to potential use of flag keywords and content")
    }
    }

    if(title){
    const score=await checkPost(title);
    if(score.TOXICITY?.summaryScore.value > 0.6 || score.SEXUALLY_EXPLICIT?.summaryScore.value > 0.5 ||
    score.THREAT?.summaryScore.value > 0.5 || score.INSULT?.summaryScore.value > 0.5||score.PROFANITY?.summaryScore.value > 0.5){
       throw new ApiError(400,"Post cannot be uploaded due to potential use of flag keywords and content")
    }
    }

    const posts=await Post.findById(postId)
    if(posts.owner.toString()!==req.user?._id.toString()){
        console.log(posts.owner)
        console.log(req.user._id)
        throw new ApiError(400,"You aren't allowed to update this post as this is not your account")
    }

    if(!content){
        const post=await Post.findByIdAndUpdate(
            postId,
            {
                title:title
            },
            {
                new:true
            }
        )
        if(!post){
            throw new ApiError(400,"Update failed for title")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(400,post,"Post title updated successfully")
        )
    }

    else if(!title){
        const post=await Post.findByIdAndUpdate(
            postId,
            {
                content:content
            },
            {
                new:true
            }
        )
        if(!post){
            throw new ApiError(400,"Update failed for content")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(400,post,"Post updated successfully")
        )
    }

    else{
        const post=await Post.findByIdAndUpdate(
            postId,
            {
                title:title,
                content:content
            },
            {
                new:true
            }
        )
        if(!post){
            throw new ApiError(400,"Update failed for post")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(400,post,"Post updated successfully")
        )
    }
})

const deletePost=asyncHandler(async(req,res)=>{
    const {postId}=req.params
    const posts=await Post.findById(postId)
    if(posts.owner.toString()!==req.user._id.toString()){
        throw new ApiError(400,"Kis hak se tum iss post ko delte karna chahti ho(You are not allowed to delete this post)")
    }

    const post=await Post.findByIdAndDelete(postId)
    if(post.image!=null){
        const pid=extractPublicId(post.image)
        const deletion=await deleteOnCloudinary(pid)
        if(deletion.result!=="ok"){
            throw new ApiError(400,"Image deletion failed")
        }
    }
    
    if(!post){
        throw new ApiError(500,"Error in deleting post")
    }

    return res 
    .status(200)
    .json(
        new ApiResponse(200,{},"Post deleted succcessfuly")
    )
})

const getPostById=asyncHandler(async(req,res)=>{
    const {postId}=req.params
    const post=await Post.findById(postId)
    if(!post){
        throw new ApiError(400,"Post doesn't exist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,post,"Post fetched successfully")
    )

})

const getUserPosts=asyncHandler(async(req,res)=>{
    const {page=1, limit=10, query, sortBy, sortType ,userId}=req.query
    if(!userId){
        throw new ApiError(400,"Are you mad or what how can I give you posts of the user without their id?")
    }

    const pipeline=[
        {
            $match:{
                ...(isValidObjectId(userId) && {owner:new mongoose.Types.ObjectId(userId)}),
                ...(search && {
                    title:{$regex:query, $options:"imx"},
                    content:{$regex:query, $options:"imx"}
                })
            }
        }
    ]
})

const getPosts=asyncHandler(async(req,res)=>{
    const {page=1, limit=10, query, search, sortBy, sortType}=req.query
    const pipeline=[
        {
            $match:{
                ...(search && {title:{$regex:query, $options:"im"}})
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"ownerDetails",
                pipeline:[
                    {
                        $project:{
                            username:1,
                            nickname:1
                        }
                    }
                ]
            }
        },
        {
            $sample:{size:parseInt(limit)}
        }
    ]
    if(!pipeline){
        throw new ApiError(500,"Some error in creating pipline for posts")
    }

    const posts=await Post.aggregatePaginate(Post.aggregate(pipeline),
    {
        page:parseInt(page),
        limit:parseInt(limit),
        sort:{[sortBy]:parseInt(sortType)},
        customLabels:{
            docs:"posts"
        }
    }
    )
    if(!posts){
        throw new ApiError(500,"Error in fetching posts")
    }

    if(posts.posts.length==0){
        throw new ApiError(404,"Such post doesn't exist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,posts,"Posts fetched successfully")
    )
})

export {uploadPost,updatePost,deletePost,getPostById,getPosts}