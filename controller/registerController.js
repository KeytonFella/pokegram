const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const registerService = require('../service/registerService');


router.use(bodyParser.json());
// registers a user using AWS cognito and then
// Importing necessary modules and services
// ...

// POST endpoint to handle user registration
router.post("/users", async (req, res) => {
    // Destructure username, password, and email from request body
    const { username, password, email } = req.body;
    let result;
    // Try to register the user with Cognito
    try{
        result = await registerService.signUp(username, password, email);
    }catch (error) {
        console.log("error adding user to Cognito");
        return res.status(500).send({
            message: "error adding user to Cognito",
            CognitoUser: result.user
        });
    }
    // Log the result for debugging
    //console.log("after cognito add in controller", result);

    // Try to add the user to the users_table in DynamoDB
    const usersDbResponse = await registerService.addCognitoToUsersDb(result?.userSub, result?.user?.username);
    // Log the result for debugging
    console.log("the usersDbresponse", usersDbResponse);
    // If adding to the users_table failed, send an error response
    if (!usersDbResponse) {
        console.error("error trying to add user to the users_table");
        return res.status(500).send({
            message: "error adding user to users_table",
            CognitoUser: result.user
        });
    }
    // Try to add the user profile to another table in DynamoDB
    const profileDbResponse = await registerService.addCognitoToProfilesDb(result.userSub , result.user.username);
    // Log the result for debugging
    console.log("the profileDbresponse", profileDbResponse);
    // If adding to the profile table failed, send an error response
    if (!profileDbResponse) {
        return res.status(500).send({
            message: "error adding user to profiles Dbtable",
            CognitoUser: result.user
        });
    }
    // If everything succeeded, send a success response
    res.send({ 
        message: "User registered successfully!", 
        user_id: result.userSub,
        username: result.user.username,
        user: result.user
    
    });
    return;
});



module.exports = router;