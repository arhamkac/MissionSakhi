import mongoose, { Schema } from "mongoose";

const resourceSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        fullAddress: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true,
            trim: true,
            index: true 
        },
        contactNumber: {
            type: String
        },
        category: {
            type: String,
            required: true,
            enum: ["NGO", "Shelter", "Legal", "Medical"]
        },
        mapUrl: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

export const Resource = mongoose.model("Resource", resourceSchema);
