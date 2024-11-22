import { MongoClient } from "mongodb";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        firstName:{
            type: string,
            required: true,
            min: 2,
            max: 50,
        },
        lastName:{
            type: string,
            required: true,
            min: 2,
            max: 50,
        },
        email:{
            type: string,
            required: true,
            max: 50,
            unique: true
        },
        password:{
            type: string,
            required: true,
            min: 5,
            max: 50,
        },
        picturePath: {
            type: string,
            default: "",
        },
        friends: {
            type: array,
            default: [],
        },
        location: string,
        occupation: string,
        viewedProfile: number,
        impressions: number,
    },
    {timestamps: true}
);

const User = mongoose.model("User", UserSchema);

export default User;