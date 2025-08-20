import mongoose, { Schema } from "mongoose";

const reportSchema= new mongoose.Schema(
    { 
      type: {
      type: String,
      required: true,
      enum: [
        "Abuse",
        "Harassment",
        "Spam",
        "Fake Profile",
        "Nudity",
        "Hate Speech",
        "Mental Health Concern",
        "Inappropriate Content",
        "Other"
        ],
       },
       content:{
        type:String,
        required:true
       },
       post:{
        type:Schema.Types.ObjectId,
        ref:"Post"
       },
       comment:{
        type:Schema.Types.ObjectId,
        ref:"Comment"
       },
       message:{
        type:Schema.Types.ObjectId,
        ref:"Message"
       },
       room:{
        type:Schema.Types.ObjectId,
        ref:"Room"
       },
       user:{
        type:Schema.Types.ObjectId,
        ref:"User"
       },
       reportedBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
       }
    },{timestamps:true}
)

export const reportCount = await Report.countDocuments({ user: reportedUserId });

export const Report=mongoose.model("Report",reportSchema)