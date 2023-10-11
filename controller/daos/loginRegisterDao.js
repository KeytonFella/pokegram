//const logger = require("../logger/logger.js");
const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-west-2'
});
const docClient = new AWS.DynamoDB.DocumentClient();
const TABLENAME = 'users';
function retrieveByUsername(username){
    const params = {
        TableName: TABLENAME,
        Key: {
            username
        }
    };
    return docClient.get(params).promise();
}
function registerAccount(username, password, uuid){
    console.log("creating account  " +" "+username+" "+ password);
    const params = {
        TableName: TABLENAME,
        ConditionExpression: 'attribute_not_exists(username)',
        Item: {
            username,
            password,
            uuid
        }
    }
    return docClient.put(params).promise();
}

module.exports = {
    retrieveByUsername, registerAccount
}