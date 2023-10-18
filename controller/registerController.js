const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const registerService = require('../service/registerService');
const AWS = require('aws-sdk');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
// create user pool
//CHANGE THESE SETTINGS 
AWS.config.update({region: 'us-east-2'});
const poolData = {
    UserPoolId: "us-east-2_XJLFbeldD",
    ClientId: "58trb2u03nrfonuju7gassvee7"
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

//const logger = require("../logger/logger.js");

router.use(bodyParser.json());
// registers a user using AWS cognito and then
// pass the userID from 
router.post("/users", async (req, res) => {
    const { username, password, email } = req.body;
    const attributeList = [
        new AmazonCognitoIdentity.CognitoUserAttribute({
            Name: "email",
            Value: email
        }),
    ];
    userPool.signUp(username, password, attributeList, null, async (err, result) => {
        if(err){
            return res.status(400).send(err.message || JSON.stringify(err));
        }
        //console.log("result from Cognito:", result);
        //Add the new user to our own DB
        //console.log(result.userSub);
        const userId = await registerService.addCognitoToDb(result.userSub, result.user.username, );
        //if we couldnt add user id to the db then throw error 
        if(!userId){
            //remove user from db
            return res.status(500).send({
                message: "error adding user to DB",
                CognitoUser: result.user
            })
        }
        res.send({ 
            message: "User registered successfully!", 
            user: result.user
        })
    })
})


module.exports = router;