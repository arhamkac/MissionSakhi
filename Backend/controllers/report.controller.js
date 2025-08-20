import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Post} from "../models/post.model.js"
import {Comment} from "../models/comment.model.js"
import {Message} from "../models/message.model.js"
import {Room} from "../models/room.model.js"
import {User} from "../models/user.model.js"
import { BlockedEmail } from "../models/blockedEmails.js";

async function getReportedUserId({ postId, commentId, messageId, roomId, userId }) {
  if (userId) return userId;

  if (postId) {
    const post = await Post.findById(postId).select("owner");
    return post?.user;
  }
  if (commentId) {
    const comment = await Comment.findById(commentId).select("postedBy");
    return comment?.user;
  }
  if (messageId) {
    const message = await Message.findById(messageId).select("sender");
    return message?.sender;
  }
  if (roomId) {
    const room = await Room.findById(roomId).select("admin");
    return room?.owner;
  }

  return null;
}

const createReport=asyncHandler(async(req,res)=>{
    const {type,content}=req.body
    const {postId,commentId,userId,messageId,roomId}=req.params
    if(!postId && !commentId && !userId && !messageId &&!roomId){
        throw new ApiError(404,"One of the ids is required to continue the report")
    }
    const reportedUserId=getReportedUserId({postId,commentId,userId,messageId,roomId})

    const report=await Report.create({
        reportedBy:req.user?._id,
        user:reportedUserId,
        type,
        content,
        post:postId,comment:commentId,message:messageId,room:roomId,user:userId
    })

    const reportCount=await Report.countDocuments({reportedUser:reportedUserId})
    if(reportCount>=5){
        const user=await User.findById(reportedUserId)
        if(user){
            await BlockedEmail.create(
            {
                email:user.email, 
                bannedTill:Date.now()+48*60*60*1000 
            }
            )
        }
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,report,"Report created successfully")
    )
})

export {createReport}