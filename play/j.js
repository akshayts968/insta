const User = require('../models/user'); // Assuming User is your Mongoose model

// Define the data you want to update
const updateData = {
    email: 'sara@gmail.com', // Replace with the actual email
    salt:  '8ba6c0bb1f8497e7d4c266c958b37f184607de38c9552b83f693b9a6bd02f8fc', // Replace with the actual hashed password
    hash: '1cdc4f5b1d14761821628b81b5ce62b945f52b3d701495dda1c22f884de437adaaedd2db460e19a55aad5b040cc5cb44106f0a7925427110af9196b7fc7cbe986018504519068324fe6a7bc2e232305f6eae75a2ea96686c2a1a510e3e72d98d1ba24ced2040e89b4e9a9d373185d1c2e44e755bc4673c27db68ed868c81c8727b2b8dd13c78677d89fd4a319628b92ba6a1fd8c9b5099dffe53484bc39c3daea9901be8f82c4cae104015b5289cbbaafaf474ef7ea79cd3eb5ef6e7db7ab8646ddb666a3467da911e34f538dcee7a957fffd792af0d6cfc5eea3b476ff791d660ae994504396b4bd3d7775ba9427223e21da14da30274695784144489a4ccfd1cae7fe5ee90c331daf0a5106b3d258ea24ae601842b37e6484a7fff6b57d205a3d6307e4c1b8ec689509ceec08b4f650eb5b5946290c6152d9f1c2a780a257a6a5b0c57872aa9549694bd342fa440d85f6d9387b7d3036b615209ca80da9ea3e7453ce91b4e0cf29995357140c9564c9d9019de6254416ffffd49411d12c550eca8918611d3c0fa2894b503e29556e87ebe2de4e738b165f26aed8dcb4d7b69728401d57262b3d5cfcd1da8929eeea3236da51508dfbc40601c47c9e7355e909aa50d4112ad33db7bf63a697a8fb87b875d2f81e5619ddcdf915e233b557280c11f93ba7d2db5b854e0c339c22be4e980457ee321b50f08bc975d7928b69785' // Replace with the actual salt
};

// Update the user document by its ID using promises
User.findByIdAndUpdate('65e1a47dc70584ed53f70211', updateData, { new: true })
    .then(updatedUser => {
        console.log('User updated successfully:', updatedUser);
    })
    .catch(error => {
        console.error('Error updating user:', error);
    });
