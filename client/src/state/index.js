//file for redux and toolkit

import { Token } from "@mui/icons-material";
import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

//state stored in global, accessible throughout the application
const initialState = {
    mode: "light",    //dark/light mode
    user: null,
    token: null,
    posts: [],
};
export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        //functions that involve modigying global state
        setMode: (state) => {
            //to change mode 
            state.mode = state.mode === 'light' ? "dark" : "light";
        },
        setLogin: (state, action) => {
            //logging in 
            state.user = action.payload.user;
            state.token - action.payload.token;
        },
        setLogout: (state) => {
            //when logged out
            state.user = null;
            state.token = null;
        },
        setFriends: (state, action) => {
            //friends
            if (state.user) {
                state.user.friends = action.payload.friends;
            }
            else {
                console.error("No Friends... :(")
            }
        },
        setPosts: (state, action) => {
            //posts
            state.posts = action.payload.posts;
        },
        setPost: (state, action) => {
            // return the post
            const updatedPosts = state.posts.map((post) => {
                if (post._id === action.payload.post_id)
                    return action.payload.post;
                return post;
            });
            state.posts = updatedPosts;
        }
    }
})

export const{ setMode, setLogin, setLogout, setFriends, setPosts, setPost } = authSlice.actions;
export default authSlice.reducer;