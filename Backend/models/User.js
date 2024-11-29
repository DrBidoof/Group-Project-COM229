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
