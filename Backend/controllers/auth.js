import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



const validateUser = (user) => {
    const errors = [];
    
    // Check required fields
    if (!user.firstNmae || user.firstNmae.length < 2 || user.firstNmae.length > 50) {
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

export const register = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(req.body.password, salt)
        const User = {
            firstNmae: req.body.firstNmae,
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
            return res.status(400).json({ errors });
        }
        // connectiong to mongo db 
        const database = client.db(dbName);
        const collection = database.collection("Users");
        const result = await collection.insertOne(User);
        console.log(`Document inserted with _id: ${result.insertedId}`);
        res.status(201).json({ message: "User registered successfully!"});
    } catch(err) {
        console.error("Error inserting document:", err);
        res.status(500).json({error: "Internal server error."});
    }
};