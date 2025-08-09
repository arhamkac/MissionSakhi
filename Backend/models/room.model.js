import mongoose,{Schema} from "mongoose";

const roomSchema=new Schema(
    {
        name:{
            type:String,
            unique:true,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        members:[
            {
                type:Schema.Types.ObjectId,
                ref:"User"
            }
        ]
    },
    {timestamps:true}
)

export const Room=mongoose.model("Room",roomSchema)