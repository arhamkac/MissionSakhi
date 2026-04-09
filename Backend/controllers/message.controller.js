import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Message } from "../models/message.model.js";
import { checkPost } from "../app.js";
import { Room } from "../models/room.model.js";

const createMessage = asyncHandler(async(req, res) => {
    const { roomId } = req.params;
    const { content } = req.body;
    
    if (!roomId || !content) {
        throw new ApiError(400, "Room ID and content are required to create a message");
    }

    const room = await Room.findById(roomId);
    if (!room) {
        throw new ApiError(404, "Room not found");
    }

    const scores = await checkPost(content);
    const thresholds = { TOXICITY: 0.6, SEXUALLY_EXPLICIT: 0.5, THREAT: 0.5, INSULT: 0.5, PROFANITY: 0.5 };
    for (let attr in thresholds) {
        if (scores[attr]?.summaryScore?.value > thresholds[attr]) {
            throw new ApiError(400, `Message contains unsafe content: ${attr}`);
        }
    }

    const newMessage = await Message.create({
        group: roomId,
        sender: req.user?._id,
        content: content
    });

    if (!newMessage) {
        throw new ApiError(500, "Message couldn't be created");
    }

    // Populate sender details for immediate frontend rendering
    await newMessage.populate("sender", "username nickname");

    return res
    .status(200)
    .json(
        new ApiResponse(200, newMessage, "Message created successfully")
    );
});

const editMessage=asyncHandler(async(req,res)=>{
    const {messageId}=req.params
    const {content}=req.body
    if(!messageId){
        throw new ApiError(400,"Message id is required to edit message")
    }

    const message=await Message.findById(messageId)
    if(message.sender.toString()!=req.user?._id){
        throw new ApiError(400,"User doesn't have access to edit this message")
    }

    const scores = await checkPost(content);
    const thresholds = { TOXICITY: 0.6, SEXUALLY_EXPLICIT: 0.5, THREAT: 0.5, INSULT: 0.5, PROFANITY: 0.5 };
    for (let attr in thresholds) {
        if (scores[attr]?.summaryScore?.value > thresholds[attr]) {
            throw new ApiError(404,`Unsafe content detected: ${attr}`);
        }
    }

    const updatedMessage=await Message.findByIdAndUpdate({content:content})
    if(!updatedMessage){
        throw new ApiError(400,"Message couldn't be updated")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,updatedMessage,"Message updated successfully")
    )
})

const deleteMessage=asyncHandler(async(req,res)=>{
    const {messageId}=req.params
    if(!messageId){
        throw new ApiError(400,"Provide message id to proceed with deletion")
    }

    const mess=await Message.findById(messageId)
    if(mess.sender.toString()!=req.user?._id){
        throw new ApiError(400,"User doesn't have access to delete this message")
    }

    const message=await Message.findByIdAndDelete(messageId);
    if(!message){
        throw new ApiError(400,"There was an error in deleting message")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"Message deleted successfully")
    )
})

export {createMessage,editMessage,deleteMessage}