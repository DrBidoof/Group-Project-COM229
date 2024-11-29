const newPost = {
    userID: currentUser._id,
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    location:  currentUser.location,
    description: post.description,
    picturePath: post.picturePath,
    userPicturePath: currentUser.userPicturePath,
    likes: new Map([]), // Initialize as an empty map
    comments: [], 
    createdAt: new Date(),
};