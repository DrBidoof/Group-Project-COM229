import express from "express";
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

export default (client, dbName) => {
    router.get("/:id", verifyToken, (req, res) => getUser(req, res, client, dbName));
    router.get("/:id/friends", verifyToken, (req, res) => getUserFriends(req, res, client, dbName));
    router.patch("/:id/:friendId", verifyToken, (req, res) => addRemoveFriend(req, res, client, dbName));
  
    return router;
  };
