import bcrypt from "bcrypt";
import { MongoClient } from "mongodb";
import jwt from "jsonwebtoken";


const validateUser = (user) => {
    const errors = [];
    
    // Check required fields
    if (!user.firstName || user.firstName.length < 2 || user.firstName.length > 50) {
        errors.push("First name must be between 2 and 50 characters.");
    }
    if (!user.lastName || user.lastName.length < 2 || user.lastName.length > 50) {
        errors.push("Last name must be between 2 and 50 characters.");
    }
    if (!user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
        errors.push("A valid email is required.");
    }
    if (!user.password || user.password.length < 5) {
        errors.push("Password must be at least 5 characters long.");
    }
    if (user.picturePath && typeof user.picturePath !== "string") {
        errors.push("Picture path must be a string.");
    }
    if (user.location && typeof user.location !== "string") {
        errors.push("Location must be a string.");
    }
    if (user.occupation && typeof user.occupation !== "string") {
        errors.push("Occupation must be a string.");
    }

    // Check numeric fields
    if (typeof user.viewedProfile !== "number" || user.viewedProfile < 0) {
        errors.push("Viewed profile must be a non-negative number.");
    }
    if (typeof user.impressions !== "number" || user.impressions < 0) {
        errors.push("Impressions must be a non-negative number.");
    }

    return errors;
};

export const register = async (req, res, client, dbName) => {
    try {
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(req.body.password, salt)
        const User = {
            firstName: req.body.firstName, 
            lastName: req.body.lastName,
            password: passwordHash,
            email:req.body.email,
            picturePath:req.body.picturePath,
            location:req.body.location,
            occupation:req.body.occupation,
            friends:[],
            viewedProfile: 0,
            impressions: 0,
            createdAt:new Date(),
        }
        //error checking for user object 
        const errors = validateUser(User);
        if(errors.length >0){
            //console.log(User.firstNmae, User.lastName, User.email, User.location, User.occupation);
            console.log(req.body.firstName);
            return res.status(400).json({ errors });
        }
        // connectiong to mongo db
        const database = client.db(dbName);
        const collection = database.collection("Users");
        // logic to check for duplicate emails
        
        const existingUser = await collection.findOne({ email: User.email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use." });
        }

        const result = await collection.insertOne(User);
        console.log(`Document inserted with _id: ${result.insertedId}`);
        res.status(201).json({ message: "User registered successfully!"});
    } catch(err) {
        console.error("Error inserting document:", err);
        res.status(500).json({error: "Internal server error."});
    } finally{
       
    }
};


/*
     Check if email already exists
        const existingUser = await collection.findOne({ email: User.email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use." });
        }
        
*/

// LOGGIN LOGIC GOES BELOW HERE
export const login = async (req, res, client, dbName) => {
    try {
        const { email, password } = req.body;
        const database = client.db(dbName);
        const collection = database.collection("Users");

        // Check if the user exists
        const user = await collection.findOne({ email });
        if (!user) {
            console.log("User not found for email:", email);
            return res.status(404).json({ error: "User not found. Please register first." });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log("Invalid password for email:", email);
            return res.status(400).json({ error: "Invalid email or password." });
        }

        // Generate a token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        console.log("Generated JWT Token:", token);

        res.status(200).json({
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                picturePath: user.picturePath || "",
                location: user.location || "",
                occupation: user.occupation || "",
                friends: user.friends || [],
                viewedProfile: user.viewedProfile || 0,
                impressions: user.impressions || 0,
            },
        });
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ error: "Internal server error." });
    }
};
