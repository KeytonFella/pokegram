const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
//const loginService = require('../service/loginService');
const AWS = require('aws-sdk');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
// create user pool
// CHANGE THESE SETTINGS
AWS.config.update({region: 'us-east-2'});
const poolData = {
    UserPoolId: "us-east-2_5xg9IcqVJ",
    ClientId: "28sfbmcm11hgjohd82sk1ds4ie"
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
router.use(bodyParser.json());

// login endpoint
// POST {username, password}
// login
router.post("/login", (req, res) => {
    const {username, password} = req.body;

    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: username,
        Password: password
    });

    const userData = {
        Username: username,
        Pool: userPool
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        
        onSuccess: (session) => {
            //console.log("session: ",session);
            res.send({message: "Login Successful", 
            accessToken: session.accessToken
            })
        },
        onFailure: (err) => {
            return res.status(400).send(err.message || JSON.stringify(err));
        },
    });
});

//might add error catch for wrong params 
//confirm endpoint may be optional with lambda presignup triggers
// confirm
router.post("/confirm", (req, res) => {
    const { username, confirmationCode } = req.body;

    const userData = {
        Username: username,
        Pool: userPool
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
        if(err){
            return res.status(400).send(err.message || JSON.stringify(err));
        }

        res.send({message: "Confirmation Successful", result})
    })
})

module.exports = router;