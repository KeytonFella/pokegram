/* 
    personal database setup
*/
const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-2'
});

const docClient = new AWS.DynamoDB.DocumentClient();


// ============================== DynamoDB Functions ==============================
const TABLENAME = 'users';

function getFriends(userId){
    const params = {
        TableName: TABLENAME,
        KeyConditionExpression: 'user_id = :user_id',
        ProjectionExpression: 'friends', // Only get the 'friends' attribute
        ExpressionAttributeValues: {
            ':user_id': userId
        }
    };
    return docClient.query(params).promise();
}


module.exports = {
    getFriends
}