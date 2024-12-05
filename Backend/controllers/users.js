import { ObjectId } from "mongodb";

export const getUser = async (req, res, client, dbName) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const db = client.db(dbName);
        const userCollection = db.collection("Users");

        // Find user in the database
        const user = await userCollection.findOne({ _id: new ObjectId(id) });
        if (!user) {
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

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const db = client.db(dbName);
        const userCollection = db.collection("Users");

        // Find the current user
        const currentUser = await userCollection.findOne({ _id: new ObjectId(id) });
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch friends' details
        const friends = await Promise.all(
            currentUser.friends.map(async (friendId) => {
                return await userCollection.findOne({ _id: new ObjectId(friendId) });
            })
        );

        // Format friends data
        const formattedFriends = friends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => ({
            _id,
            firstName,
            lastName,
            occupation,
            location,
            picturePath,
        }));

        res.status(200).json(formattedFriends);
    } catch (err) {
        console.error("Error fetching user friends:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const addRemoveFriend = async (req, res, client, dbName) => {
    try {
        const { id, friendId } = req.params;

        if (!ObjectId.isValid(id) || !ObjectId.isValid(friendId)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const db = client.db(dbName);
        const userCollection = db.collection("Users");

        // Fetch current user and friend
        const currentUser = await userCollection.findOne({ _id: new ObjectId(id) });
        const friend = await userCollection.findOne({ _id: new ObjectId(friendId) });

        if (!currentUser || !friend) {
            return res.status(404).json({ message: "User or friend not found" });
        }

        // Add or remove friend
        if (currentUser.friends.some((fid) => fid.toString() === friendId)) {
            currentUser.friends = currentUser.friends.filter((fid) => fid.toString() !== friendId);
            friend.friends = friend.friends.filter((fid) => fid.toString() !== id);
        } else {
            currentUser.friends.push(new ObjectId(friendId));
            friend.friends.push(new ObjectId(id));
        }

        // Update both users in the database
        await userCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { friends: currentUser.friends } }
        );

        await userCollection.updateOne(
            { _id: new ObjectId(friendId) },
            { $set: { friends: friend.friends } }
        );

        // Fetch updated friends' data
        const updatedFriends = await Promise.all(
            currentUser.friends.map(async (fid) => {
                return await userCollection.findOne({ _id: new ObjectId(fid) });
            })
        );

        const formattedFriends = updatedFriends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => ({
            _id,
            firstName,
            lastName,
            occupation,
            location,
            picturePath,
        }));

        res.status(200).json(formattedFriends);
    } catch (err) {
        console.error("Error adding/removing friend:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};
