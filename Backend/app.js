import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import { register } from "./controllers/auth.js";
import authRoutes from "./routes/auth.js";
import userRoutes from  "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { verifyToken } from "./middleware/auth.js";
import { createPost } from "./controllers/posts.js";


// node app.js or nodemon 

/* Configuratuons */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.contentSecurityPolicy());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended:true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended:true}));
app.use(
    cors({
      origin: "https://com229-frontend-y849.onrender.com", // Correct frontend URL
      methods: ["GET", "POST", "PATCH", "DELETE"],
      credentials: true,
    })
  );  
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/*file storage */
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, "public/assets");
    },
    filename: function(req,file,cb){
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

/*MongoDb*/
const Dbconnect = process.env.connect;
const PORT =  process.env.PORT || 6001;

const client = new MongoClient(Dbconnect);
const dbName = "Social_Media_App";

client.connect().then(() =>{
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
}).catch((error) => console.log(`${error} did not connect`)) 

/* Routes with files */
app.post("/auth/register", upload.single("picture"), (req,res) =>{
    register(req,res,client,dbName);
});
app.post("/posts", verifyToken, upload.single("picture"),  (req,res)=> 
{
    createPost(req,res,client,dbName);
});


/*ROUTES*/
app.use("/auth", authRoutes(client,dbName));
app.use("/users", userRoutes(client,dbName));
app.use("/posts", postRoutes(client,dbName));
