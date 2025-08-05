import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema=new Schema(
    {
        username:{
            type:String,
            unique:true,
            trim:true
        },
        email:{
            type:String,
            required:true,
            trim:true
        },
        password:{
            type:String,
            required:true
        },
        refreshToken:{
            type:String
        },
        joinedGroups:{
            type:Schema.Types.ObjectId,
            ref:"Room"
        }
    },
    {
        timestamps:true
    }
)

userSchema.pre("save",async function(next){
    if(!this.isModified(password)){return next();}
    this.password=await bcrypt.hash(this.password,10);
    next();
})

userSchema.methods.isPasswordCorrect=async function (password) {
    return await bcrypt.compare(password,this.password); 
}

userSchema.pre("save",async function(next){
    if(!this.isModified("username")){
        const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
        const config={
            dictionaries:[adjectives, animals],
            separator:'',
            style:'capital',
            length:2
        }
        const randomNo=Math.floor(Math.random()*1000);
        const username=uniqueNamesGenerator(config)+randomNo;

        this.username=username;
        next();
    }
})

userSchema.methods.generateAccessToken=async function(){
    return jwt.sign(
        {
            _id:this.id,
            username:this.username,
            password:this.password
        },
        process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken=async function(){
    return jwt.sign(
        {
            _id:this.id
        },
        process.env.REFRESH_TOKEN_SECRET,{
            expiresIn:REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User=mongoose.model(userSchema,"User");