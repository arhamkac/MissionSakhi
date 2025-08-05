import mongoose,{Schema} from "mongoose";

const postSchema=new Schema(
    {
       title:{
        type:String,
        required:true,
       },
       content:{
        type:String,
        required:true
       },
       image:{
        type:String
       },
       owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
       }
    },{timestamps:true}
)

export const Post=mongoose.model(postSchema,"Post")