
const registerDao = require('../repository/registerDao');
const profileDao = require('../repository/profileDAO');
const AWS = require('aws-sdk')
AWS.config.update({region: 'us-east-2'});
const poolData = {
    UserPoolId: "us-east-2_XJLFbeldD",
    ClientId: "58trb2u03nrfonuju7gassvee7"
};
const CognitoIdentityServiceProvider = AWS.CognitoIdentityServiceProvider;
var client = new CognitoIdentityServiceProvider({
    apiVersion: '2016-04-19',
    region: 'us-east-2'
});
console.log(AWS.config);


//////////////////////////////////
async function addCognitoToDb(user_id, username){
    //the params to delete a user
    const cognitoParams = {
        UserPoolId: "us-east-2_XJLFbeldD",
        Username: user_id
    };
    try {
        await registerDao.addCognitoToDb(user_id, username);
        console.log("added to db" );
        try {
            await profileDao.createProfile(user_id);
            console.log("added to profiles" );
            return user_id;
            
        } catch (error) {
            console.error("error trying to add to poke profiles");
                //Delete the user from cognito if it did not get added to the users_table
            try {
                await client.adminDeleteUser(cognitoParams).promise();
                console.log('Successfully deleted user from Cognito User Pool');
                return null;
            } catch (cognitoError) {
                console.error(username);
                console.error('Failed to delete user from Cognito User Pool', cognitoError);
                return null;
            }
        }
    } catch (error) {
        console.error("error in registerService adding to users_table", error);
        //Delete the user from cognito if it did not get added to the users_table
        try {
            console.log("cognito params",cognitoParams)
            await client.adminDeleteUser(cognitoParams).promise();
            console.log('Successfully deleted user from Cognito User Pool');
            return null;
        } catch (cognitoError) {
            console.error('2Failed to delete user from Cognito User Pool', cognitoError);
            return null;
        }
        return null;
    }
}


module.exports = {
    addCognitoToDb
}