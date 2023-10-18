
const registerDao = require('../repository/registerDao');
const profileDao = require('../repository/profileDAO');
const AWS = require('aws-sdk')
AWS.config.update({region: 'us-east-2'});
const Cognito = new AWS.CognitoIdentityServiceProvider();
console.log(AWS.config);


//////////////////////////////////
async function addCognitoToDb(user_id, username){
    //the params to delete a user
    const cognitoParams = {
        UserPoolId: "us-east-2_5xg9IcqVJ",
        Username: username
    };
    try {
        console.log("aws config",AWS.config);
        console.log("in service add cognito to db");
        console.log("user id ", user_id)
        console.log("username ",username);

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
                await Cognito.adminDeleteUser(cognitoParams).promise();
                console.log('Successfully deleted user from Cognito User Pool');
            } catch (cognitoError) {
                console.error('Failed to delete user from Cognito User Pool', cognitoError);
            }
            return null;
        }
    } catch (error) {
        console.error("error in registerService adding to users_table", error);
        //Delete the user from cognito if it did not get added to the users_table
        try {
            await Cognito.adminDeleteUser(cognitoParams).promise();
            console.log('Successfully deleted user from Cognito User Pool');
        } catch (cognitoError) {
            console.error('Failed to delete user from Cognito User Pool', cognitoError);
        }
        return null;
    }
}


module.exports = {
    addCognitoToDb
}