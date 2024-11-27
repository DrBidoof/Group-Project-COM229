/*import express from "express";
import { login, register } from "../controllers/auth.js";

const router = express.Router();

// Register Route
router.post("/register", register);

// Login Route
router.post("/login", login);

export default router;*/

import express from "express";
import { login, register } from "../controllers/auth.js";
import multer from "multer";

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/assets");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

export default (client, dbName) => {
    const router = express.Router();

    // Register Route with picture upload
    router.post("/register", upload.single("picture"), (req, res) => {
        register(req, res, client, dbName);
    });
    

    // Login Route
    router.post("/login", (req, res) => {
        login(req, res, client, dbName);
    });

    return router;
};

