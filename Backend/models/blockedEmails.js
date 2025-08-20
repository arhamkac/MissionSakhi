import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const blockedEmailSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    bannedAt:{
        type:Date,
        default:Date.now
    },
    bannedTill:{
        type:Date
    }
});

export const BlockedEmail=mongoose.model("BlockedEmail",blockedEmailSchema)