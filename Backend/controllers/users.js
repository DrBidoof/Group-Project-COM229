import { MongoClient } from "mongodb";

export const getUser = async (req,res,client,dbName) => {
    try{

    } catch(err){
        res.status(404).json({ message: err.message });
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

    } catch(err){
        res.status(404).json({ message: err.message });
    }
};