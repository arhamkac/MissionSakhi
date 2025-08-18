import mongoose,{Schema} from "mongoose";

const voteSchema=new Schema(
    {
      upvote:{
        type:Boolean,
        default:false
      },
      downvote:{
        type:Boolean,
        default:false
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

export const Vote=mongoose.model("Vote",voteSchema)