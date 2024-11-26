/*This is not being used */
//This is just to help the data mapping

import mongoose from "mongoose";
const postSchema = mongoose.Schema(
    {
        userId: {
            type: String
        },
        firstName:{
            type: String
        },
        lastName:{
            type: String
        },
        location:{
            type: String
        },
        description: String,
        picturePath: String,
        userPicturePath: String,
        likes: {
            type: Map,
            of: Boolean,
        },
        comments:{
            types: Array,
            default: []
        }
    },
    {Timestamps: true}
)