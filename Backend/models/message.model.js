import mongoose,{Schema} from "mongoose";

const messageSchema=new Schema(
    {
      group:{
        type:Schema.Types.ObjectId,
        ref:"Room",
        required:true
      },
      sender:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
      },
      content:{
        type:String,
        required:true
      }  
    },
    {timestamps:true}
)

export const Message=mongoose.model("Message",messageSchema)