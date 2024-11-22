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


// node app.js or nodemon 

/* Configuratuons */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended:true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended:true}));
app.use(cors());
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
const dbName = "comp229week2";
client.connect().then(() =>{
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
}).catch((error) => console.log(`${error} did not connect`)) 

/* Routes with files */
app.post("/auth/register", upload.single("picture"), register);