const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const registerService = require('../service/registerService');


router.use(bodyParser.json());
// registers a user using AWS cognito and then
// pass the userID from 
router.post("/users", async (req, res) => {
    const { username, password, email } = req.body;
    let result;

    result = await registerService.signUp(username, password, email);
    console.log("after cognito add in controller", result);
    if(!result){
        console.log("error adding user to Cognito");
        return res.status(500).send({
            message: "error adding user to Cognito",
            CognitoUser: result.user
        })
    }
    
        
    const usersDbResponse = await registerService.addCognitoToUsersDb(result.userSub, result.user.username);
    console.log("the usersDbresponse", usersDbResponse);
    if (!usersDbResponse) {
        console.error("error trying to add user to the users_table");
        return res.status(500).send({
            message: "error adding user to users_table",
            CognitoUser: result.user
        })
    }

    const profileDbResponse = await registerService.addCognitoToProfilesDb(result.userSub , result.user.username);
    console.log("the profileDbresponse", profileDbResponse);
    if (!profileDbResponse) {
        return res.status(500).send({
            message: "error adding user to profiles Dbtable",
            CognitoUser: result.user
        })
    }

    res.send({ 
        message: "User registered successfully!", 
        user: result.user
    })
    return;
})


module.exports = router;