import express from "express";
import {getFeedPosts, getUserPosts, likePosts} from "../controllers/posts.js"
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/*READ*/
export default (client, dbName) => {
        router.get("/", verifyToken, (req, res) => getFeedPosts(req, res, client, dbName));
        router.get("/:userId/posts", verifyToken, (req, res) => getUserPosts(req, res, client, dbName));
        router.patch("/:id/like", verifyToken, (req, res) => likePosts(req, res, client, dbName));

        return router;
    }





