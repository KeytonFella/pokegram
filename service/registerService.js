
const registerDao = require('../repository/registerDao');
const profileDao = require('../repository/profileDAO');
const tradesDao = require('../repository/tradesDAO');
const cognito = require('../utility/aws/cognito');


// Function to add a user to the users_table in DynamoDB
async function addCognitoToUsersDb(user_id, username){
    try {
        // Attempt to add user to DynamoDB through DAO (Data Access Object)
        await registerDao.addCognitoToDb(user_id, username);
        console.log("added to db");
        return true; // Return true if successful
    } catch (error) {
        console.error("error trying to add user to the users_table", error);
        // If there's an error, delete the user from Cognito
        await cognito.deleteUser(username);
        return false; // Return false if there's an error
    }
}

// Function to add a profile for the user in the profiles_table
async function addCognitoToProfilesDb(user_id, username){
    try {
        // Attempt to create a profile in DynamoDB
        await profileDao.createProfile(user_id);
        console.log("added to profiles");
        return true; // Return true if successful
    } catch (error) {
        console.log("error trying to add to profiles_table", error);
        // If there's an error, delete the user from both the profiles_table and Cognito
        await deleteFromUsersDb(user_id);
        await cognito.deleteUser(username);
        return false; // Return false if there's an error
    }
}

// Function to add a trades for the user in the trades_table
async function addCognitoToTradesDb(user_id, username){
    try {
        // Attempt to create a trades in DynamoDB
        await tradesDao.submitTradeData(user_id, username);
        console.log("added to trades");
        return true; // Return true if successful
    } catch (error) {
        console.log("error trying to add to trades_table", error);
        // If there's an error, delete the user from both the profiles_table and Cognito
        await deleteFromUsersDb(user_id);
        await cognito.deleteUser(username);
        return false; // Return false if there's an error
    }
}

// Function to sign up a user through Cognito
async function signUp(username, password, email){
    try {
        // Attempt to sign up user through Cognito
        const result = await cognito.signUp(username, password, email);
        return result; // Return the result if successful
    } catch (error) {
        console.log("error with signing up ", username);
        return false; // Return false if there's an error
    }
}

// Function to delete a user from the users_table in DynamoDB
async function deleteFromUsersDb(user_id){
    try {
        // Attempt to delete user from DynamoDB
        const result = await registerDao.deleteUser(user_id);
        console.log("deleted user from users db", result);
        if(result.Attributes.user_id !== user_id){return false};
        return true; // Return true if successful
    } catch (error) {
        console.error("error trying to delete user from users_db", error);
        return false; // Return false if there's an error
    }
}


module.exports = {
    addCognitoToUsersDb, signUp, addCognitoToProfilesDb, addCognitoToTradesDb
}