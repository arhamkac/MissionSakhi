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
        },
        nickname:{
            type:String,
            required:true,
        }
    },
    {
        timestamps:true
    }
)

userSchema.methods.isPasswordCorrect=async function (password) {
    return await bcrypt.compare(password,this.password); 
}

import { uniqueNamesGenerator, adjectives, animals,colors } from 'unique-names-generator';

userSchema.pre("save",async function(next){
    if(!this.username){
        const config={
            dictionaries:[adjectives, animals],
            separator:'',
            style:'capital',
            length:2
        }
        const randomNo=Math.floor(Math.random()*1000);
        const username=uniqueNamesGenerator(config)+randomNo;

        this.username=username;

        if(!this.isModified("password")){return next();}
        this.password=await bcrypt.hash(this.password,10);

        next();
    }
})

userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id:this.id,
            username:this.username,
            email:this.email,
            nickname:this.nickname
        },
        process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this.id
        },
        process.env.REFRESH_TOKEN_SECRET,{
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User=mongoose.model("User",userSchema);