import express from "express";
import { login } from "../controllers/auth.js";

const router = express.Router();

export default (client, dbName) => {

    router.post("/login", (req, res) => login(req, res, client, dbName));

    return router;
}