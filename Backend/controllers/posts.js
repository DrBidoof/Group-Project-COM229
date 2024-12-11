import { ObjectId } from "mongodb";

export const createPost = async (req, res, client, dbName) => {
    try {
        const { userID, description } = req.body;

        // Validate userID format
        if (!ObjectId.isValid(userID)) {
            return res.status(400).json({ message: "Invalid userID format" });
        }

        // Check if a file is uploaded
        const picturePath = req.file ? req.file.filename : null;

        const db = client.db(dbName);
        const userCollection = db.collection("Users");

        // Fetch the current user
        const currentUser = await userCollection.findOne({ _id: new ObjectId(userID) });
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create a new post object
        const newPost = {
            userID: currentUser._id,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            location: currentUser.location,
            description,
            picturePath,
            userPicturePath: currentUser.picturePath || null,
            likes: {}, // Initialize as an empty object
            comments: [],
            createdAt: new Date(),
        };

        const postCollection = db.collection("Posts");

        // Insert the post into the database
        const result = await postCollection.insertOne(newPost);

        // Fetch all posts to return
        const allPosts = await postCollection.find().toArray();
            console.log(allPosts);
        res.status(201).json({
            message: "Post created successfully",
            newPostId: result.insertedId,
            allPosts,
        });
    } catch (err) {
        console.error("Error creating post:", err);
        res.status(500).json({ message: err.message });
    }
};

export const getFeedPosts = async (req,res,client,dbName) =>{
    try{
        const { userId } = req.params;

        const db = client.db(dbName);
        const postCollection = db.collection("Posts");
        const allPosts = await postCollection.find({ userID: new ObjectId(userId) }).toArray(); 
        res.status(201).json({
            message: "All user post",
            allPosts,
        });
    } catch(err){
        res.status(404).json({ message: err.message }) 
    }
}

export const getUserPosts = async (req,res,client,dbName) => {
    try{
        const { id } = req.params; //id of the post
        const db = client.db(dbName);
        const postCollection = db.collection("Posts");
        const userPosts = await postCollection.find({_id:id}).toArray();
        res.status(200).json({
            message: "Post fetched successfully",
            userPosts,
        });
    } catch(err){
        res.status(404).json({ message: err.message }) ;
    };
}


export const likePosts = async (req, res, client, dbName) => {
    try {
        const { id } = req.params; // Post ID from the URL
        const { userId } = req.body; // User ID from the request body

        // if (!ObjectId.isValid(id) || !ObjectId.isValid(userId)) {
        //     return res.status(400).json({ message: "Invalid ID format" });
        // }

        const db = client.db(dbName);
        const postCollection = db.collection("Posts");

        // Find the post and toggle the like
        const post = await postCollection.findOne({ _id: new ObjectId(id) });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const isLiked = post.likes[userId];
        const updatedLikes = { ...post.likes };

        if (isLiked) {
            delete updatedLikes[userId];
        } else {
            updatedLikes[userId] = true;
        }

        const updatedPost = await postCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { likes: updatedLikes } },
            { returnDocument: "after" }
        );

        res.status(200).json({
            message: "Post updated successfully",
            updatedPost: updatedPost,
        });
    } catch (err) {
        console.error("Error updating post likes:", err);
        res.status(500).json({ message: err.message });
    }
};