import { ObjectId } from "mongodb";

/* Create */
export const createPost = async (req, res, client, dbName) => {
    try {
        const post = {
            userID: req.body.userID,
            description: req.body.description,
            picturePath: req.body.picturePath,
        };

        const db = client.db(dbName);
        const userCollection = db.collection("Users");

        // Convert userID to ObjectId
        const userIdObjectId = new ObjectId(post.userID);
        const currentUser  = await userCollection.findOne({ _id: userIdObjectId });

        if (!currentUser ) {
            return res.status(404).json({ message: "User  not found" });
        }

        const newPost = {
            userID: currentUser ._id,
            firstName: currentUser .firstName,
            lastName: currentUser .lastName,
            location: currentUser .location,
            description: post.description,
            picturePath: post.picturePath,
            userPicturePath: currentUser .userPicturePath,
            likes: new Map([]), // Initialize as an empty map
            comments: [],
            createdAt: new Date(),
        };

        const postCollection = db.collection("Posts");
        const result = await postCollection.insertOne(newPost);
        const allPosts = await postCollection.find().toArray();

        res.status(201).json({
            message: "Post created successfully",
            newPostId: result.insertedId,
            allPosts,
        });

    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};

export const getFeedPosts = async (req,res,client,dbName) =>{
    try{
        const db = client.db(dbName);
        const postCollection = db.collection("Posts");
        const allPosts = await postCollection.find().toArray();
        res.status(201).json({
            message: "Post retrieved successfully",
            allPosts,
        });
    } catch(err){
        res.status(404).json({ message: err.message }) 
    }
}

export const getUserPosts = async (req,res,client,dbName) => {
    try {
        const { id } = req.params; // id of the post
        const db = client.db(dbName);
        const postCollection = db.collection("Posts");
        
        // Convert id to ObjectId
        const userPosts = await postCollection.find({ _id: ObjectId(id) }).toArray();
        
        res.status(200).json({
            message: "Posts retrieved successfully",
            userPosts,
        });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

/*Update*/

export const likePosts = async (req, res, client, dbName) => {
    try {
        const { id } = req.params; // id of the post
        const { userId } = req.params; // userId from the request parameters
        const db = client.db(dbName);
        const postCollection = db.collection("Posts");
        
        // Update the likes for the post
        const updatedPost = await postCollection.findOneAndUpdate(
            { _id: ObjectId(id) }, // Find post by ID
            {
                $set: {
                    [`likes.${userId}`]: {
                        $cond: [
                            { $eq: [`$likes.${userId}`, true] },
                            false,
                            true,
                        ],
                    },
                },
            },
            { returnDocument: "after" } 
        );

        if (!updatedPost.value) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({
            message: "Post updated successfully",
            updatedPost: updatedPost.value,
        });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}