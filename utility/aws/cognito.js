const AWS = require('aws-sdk')
const CognitoIdentityServiceProvider = AWS.CognitoIdentityServiceProvider;
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
AWS.config.update({region: 'us-east-2'});
const poolData = {
    UserPoolId: "us-east-2_SVgVNVFdr",
    ClientId: "3l8bh4r7c24rhueak49m3da774"
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

var client = new CognitoIdentityServiceProvider({
    apiVersion: '2016-04-19',
    region: 'us-east-2'
});


async function signUp (username, password, email) {
    const attributeList = [
        new AmazonCognitoIdentity.CognitoUserAttribute({
            Name: "email",
            Value: email
        }),
    ];

    return new Promise((resolve, reject) => {
        userPool.signUp(username, password, attributeList, null, (err, result) => {
            if (err) {
                console.log("error in signup async", err);
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

async function deleteUser(username) {
    const cognitoParams = {
        UserPoolId: "us-east-2_SVgVNVFdr",
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



module.exports = {signUp, deleteUser}