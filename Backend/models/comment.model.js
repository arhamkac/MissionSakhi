import mongoose,{Schema} from "mongoose";

const commentSchema=new Schema(
    {
        content:{
         type:String,
         required:true
        },
        post:{
            type:Schema.Types.ObjectId,
            ref:"Post"
        },
        postedBy:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    },
    {timestamps:true}
)

export const Comment=mongoose.model(commentSchema,"Comment")