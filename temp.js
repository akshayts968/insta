app.get("/f", async (req, res) => {
    try {
        // Update multiple users
        const updatedUsers = await User.updateMany(
            { _id: { $in: ['65e1a47dc70584ed53f70211', '65e1a495c70584ed53f70213', '65e282d6933a8f9159e40acf', '65e2d2ee588532f216c911b9', '65e469595a685ab1006c1c79', '65e472e1a2a8996e24a5c6e6'] } },
            {
                $set: {
                    followers: [],
                    followings: [],
                    nFollowers: 0,
                    nFollowing: 0,
                    // Add any other missing fields here
                }
            },
            { new: true } // Return the updated documents
        );

        console.log('Updated users:', updatedUsers);
    } catch (error) {
        console.error('Error updating users:', error);
    }
});
app.get("/fg", async (req, res) => {
    try {
        const update = {
            $set: {
                nLikes: 0, // Default value for nLikes
                likes: [], // Default value for likes
                nComments: 0, // Default value for nComments
                comments: [] // Default value for comments
            }
        };

        // Update all documents in the collection
        const result = await Post.updateMany({}, update);

        console.log('Documents updated successfully:', result);
    } catch (error) {
        console.error('Error updating documents:', error);
    }
});
