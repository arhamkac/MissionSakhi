import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Room } from "../models/room.model.js";
import { Message } from "../models/message.model.js";

const getRoomMessages=asyncHandler(async(req,res)=>{
    const {roomId}=req.params
    if(!roomId){
        throw new ApiError(400,"Can't access room messages wihtout room Id")
    }

    const room=await Room.findById(roomId);
    if(!room){
        throw new ApiError(400,"Room with given Id doesn't exist")
    }
    const messages=await Message.find({group:roomId}).sort({createdAt:1});
    if(!messages){
        throw new ApiError(400,"Error in finding group messages")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,messages,"Messages fetched successfully")
    )

})

const createRoom=asyncHandler(async(req,res)=>{
    const {name,description}=req.body
    if([name,description].some((field)=>field.trim()==="")){
        throw new ApiError(400,"Room ID and description are required to create room")
    }

    const room=await Room.create({
        name:name,
        description:description,
        admin:req.user._id
    })
    if(!room){
        throw new ApiError(500,"There was some server error in creating room")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,room,"Room created successfully")
    )
})

const getRooms=asyncHandler(async(req,res)=>{
    const {page=1,limit=10}=req.query
    const aggregate=Room.aggregate([{
        $sort:{
            createdAt:-1
        }
    }])
    if(!aggregate){
        throw new ApiError(500,"Server issue in rendering rooms(aggregation pipeline)")
    }

    const options={
        page:parseInt(page),
        limit:parseInt(limit),
        customLabels:{
            totalDocs:'totalRooms',
            docs:'rooms'
        }
    }

    const rooms=await Room.aggregatePaginate(aggregate,options)

    return res
    .status(200)
    .json(
        new ApiResponse(200,rooms,"Rooms fetched successfully")
    )
})

const getRoomById=asyncHandler(async(req,res)=>{
    const {roomId}=req.params
    if(!roomId){
        throw new ApiError(400,"Provide room id so we can continue further")
    }
    const room=await Room.findById(roomId)
    if(!room){
        throw new ApiError(400,"Room with given id doesn't exist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,room,"Room fetched successfully")
    )
})

export {getRoomMessages,createRoom,getRooms,getRoomById}