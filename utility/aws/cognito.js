const AWS = require('aws-sdk')
const CognitoIdentityServiceProvider = AWS.CognitoIdentityServiceProvider;
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
AWS.config.update({region: 'us-east-2'});
const poolData = {
    UserPoolId: "us-east-2_XJLFbeldD",
    ClientId: "58trb2u03nrfonuju7gassvee7"
};

//local
/* const poolData = {
    UserPoolId: "us-east-2_SVgVNVFdr",
    ClientId: "3l8bh4r7c24rhueak49m3da774"
}; */

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

var client = new CognitoIdentityServiceProvider({
    apiVersion: '2016-04-19',
    region: 'us-east-2'
});



async function signUp (username, password, email=null) {
    const attributeList = [
        new AmazonCognitoIdentity.CognitoUserAttribute({
            Name: "email",
            Value: email
        }),
    ];
    console.log("signing up user", username, password, email);

    return new Promise((resolve, reject) => {
        userPool.signUp(username, password, attributeList, null, (err, result) => {
            if (err) {
                console.log("error in signup async", err);
                reject(err);
            } else {
                console.log("logged in user!", result);
                resolve(result);
            }
        });
    });
};

async function deleteUser(username) {
    const cognitoParams = {
        UserPoolId: poolData.UserPoolId,
        Username: username
    };
    try {
        await client.adminDeleteUser(cognitoParams).promise();
        console.log('Successfully deleted user from Cognito User Pool');
        return true;
    } catch (err) {
        console.error('Failed to delete user from Cognito User Pool', err);
        return false;
    }
}

async function login(username, password) {
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: username,
        Password: password
    });

    const userData = {
        Username: username,
        Pool: userPool
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    return new Promise((resolve, reject) => {
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: (result) => {
                resolve(result);
            },
            onFailure: (err) => {
                console.error("cant login: ", err)
                reject(err);
            }
        });
    });
}


async function confirm(username, confirmationCode) {
    const userData = {
        Username: username,
        Pool: userPool
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    return new Promise((resolve, reject) => {
        cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
            if (err) {
                console.error("Error confirming user", err);
                reject(err); // Reject the Promise with the error
            } else {
                resolve(result); // Resolve the Promise with the result
            }
        });
    });
}

module.exports = {signUp, deleteUser, login, confirm}