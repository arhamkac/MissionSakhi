import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

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
        ],
        admin:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    },
    {timestamps:true}
)

roomSchema.plugin(mongooseAggregatePaginate)

export const Room=mongoose.model("Room",roomSchema)