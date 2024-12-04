import { MongoClient } from "mongodb";


import { ObjectId } from "mongodb";

export const getUser = async (req, res, client, dbName) => {
    try {
        const { id } = req.params;

        console.log("Fetching user with ID:", id);

        // Validate ID format
        if (!ObjectId.isValid(id)) {
            console.log("Invalid ID format");
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const db = client.db(dbName);
        const userCollection = db.collection("Users");

        // Find user in the database
        const user = await userCollection.findOne({ _id: new ObjectId(id) });
        if (!user) {
            console.log("User not found in database");
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};



export const getUserFriends = async (req, res, client, dbName) => {
    try {
        const { id } = req.params;  
        const db = client.db(dbName);
        const userCollection = db.collection("Users");
        const currentUser = await userCollection.findOne({ _id: id });
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const friends = await Promise.all(currentUser.friends.map(async (_id) => {
            const friend = await userCollection.findOne({ _id });
            return friend;
        }));
        const formattedFriends = friends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => {
            return { _id, firstName, lastName, occupation, location, picturePath };
        });

        res.status(200).json(formattedFriends);

    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};


export const addRemoveFriend = async (req, res,client,dbName) => {
    try{
        const {id, friendId } = req.params;
        //console.log(friendId);
        const db = client.db(dbName);
        const userCollection = db.collection("Users");
        const currentUser = await userCollection.findOne({ _id: new ObjectId(id) });
        //console.log(currentUser);
        const friend = await userCollection.findOne({ _id: new ObjectId(friendId) });
        //console.log(friend);
        if(currentUser.friends.includes(friendId))
        {
            currentUser.friends =  currentUser.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id) => id !== id);
        }else {
            currentUser.friends.push(friendId);
            friend.friends.push(id);
        }

        await userCollection.updateOne(
            { _id: id },
            { $set: { friends: currentUser.friends } }
        );
        await userCollection.updateOne(
            { _id: friendId },
            { $set: { friends: friend.friends } }
        );

        const friends = await Promise.all(currentUser.friends.map(async (_id) => {
            const friend = await userCollection.findOne({ _id });
            return friend;
        }));
        const formattedFriends = friends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => {
            return { _id, firstName, lastName, occupation, location, picturePath };
        });
        res.status(200).json(formattedFriends);
    } catch(err){
        res.status(404).json({ message: err.message });
    }
};