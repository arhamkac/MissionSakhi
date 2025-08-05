import mongoose,{Schema} from "mongoose";

const voteSchema=new Schema(
    {
      upvote:{
        type:Boolean
      },
      post:{
        type:Schema.Types.ObjectId,
        ref:"Post"
      },
      comment:{
        type:Schema.Types.ObjectId,
        ref:"Comment"
      },
      owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
      }
    },{timestamps:true}
)

export const Vote=mongoose.model(voteSchema,"Vote")