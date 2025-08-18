import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const Categories=["Womens Safety",
    "Self-Defense & Training",
    "Legal Help & Rights",
    "Harassment & Abuse Support",
    "Mental Health & Wellness",
    "Health & Hygiene",
    "Career & Education",
    "Entrepreneurship & Business",
    "Relationships & Marriage",
    "Friendship & Community",
    "Travel & Safety Tips",
    "Fitness & Sports",
    "Parenting & Family",
    "Self-Love & Confidence",
    "Fashion & Lifestyle",
    "Art, Culture & Creativity",
    "Technology & Learning",
    "Finance & Money Management",
    "News & Awareness",
    "Open Mic (Anything Goes)"]

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
       },
       category:{
        type:[String],
        enum:Categories,
        required:true,
        validate:{
            validator:function(value){
                return value.length>0
            },
            message:"Select at least one category"
        }
       }
    },{timestamps:true}
)

postSchema.plugin(mongooseAggregatePaginate)

export const Post=mongoose.model("Post",postSchema)