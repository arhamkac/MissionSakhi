import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Post} from "../models/post.model.js"
import {Comment} from "../models/comment.model.js"
import {Message} from "../models/message.model.js"
import {Room} from "../models/room.model.js"
import {User} from "../models/user.model.js"
import { BlockedEmail } from "../models/blockedEmails.js";

import { Report } from "../models/report.model.js";

async function getReportedUserId(type, id) {
  if (type === "user") return id;

  if (type === "post") {
    const post = await Post.findById(id).select("owner");
    return post?.owner;
  }
  if (type === "comment") {
    const comment = await Comment.findById(id).select("postedBy");
    return comment?.postedBy;
  }
  if (type === "message") {
    const message = await Message.findById(id).select("sender");
    return message?.sender;
  }
  if (type === "room") {
    const room = await Room.findById(id).select("admin");
    return room?.admin;
  }

  return null;
}

const createReport=asyncHandler(async(req,res)=>{
    const {content}=req.body;
    let reportType = req.body.type || "Other";
    const {type, id}=req.params;
    
    if(!type || !id){
        throw new ApiError(404,"Valid target type and ID are required to report")
    }
    
    const reportedUserId=await getReportedUserId(type, id);

    let reportData = {
        reportedBy: req.user?._id,
        user: reportedUserId,
        type: reportType,
        content: content || "No content provided",
    };
    reportData[type] = id;

    const report=await Report.create(reportData);

    if (reportedUserId) {
      const reportCount=await Report.countDocuments({user:reportedUserId});
      if(reportCount>=5){
          const userObj=await User.findById(reportedUserId);
          if(userObj){
              await BlockedEmail.create(
              {
                  email:userObj.email, 
                  bannedTill:Date.now()+48*60*60*1000 
              })
          }
      }
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,report,"Report created successfully")
    )
})

export {createReport}