
/* 
    personal database setup
*/
const { TagResourceCommand } = require('@aws-sdk/client-secrets-manager');
const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-2'
});

const docClient = new AWS.DynamoDB.DocumentClient();

// ============================== DynamoDB Functions ==============================
//local
/* const TABLENAME = 'users'; */

const TABLENAME = 'users_table';

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

function getUserById(userId){
    const params = {
        TableName: TABLENAME,
        KeyConditionExpression: 'user_id = :user_id',
        ProjectionExpression: 'user_id, username', // Only get the 'id and username' attribute
        ExpressionAttributeValues: {
            ':user_id': userId
        }
    };
    return docClient.query(params).promise();
}

function addFriend(user_id, friend_id, friend_username){
    const newFriend = {
        user_id: friend_id,
        username: friend_username // You'll need to fetch or determine this
    };
    const params = {
        TableName: TABLENAME,
        Key: {
        'user_id': user_id
        },
        UpdateExpression: 'SET friends = list_append(friends, :newFriend)',
        ExpressionAttributeValues: {
        ':newFriend': [newFriend]
        },
        ReturnValues: 'UPDATED_NEW'
    };
    return docClient.update(params).promise();
    
}

function deleteFriend(user_id, friend_index){
    const params = {
        TableName: TABLENAME,
        Key: { 'user_id': user_id },
        UpdateExpression: `REMOVE friends[${friend_index}]`,
        ReturnValues: 'ALL_NEW'
    };
    // will return the updated friends list 
    return docClient.update(params).promise();
}


module.exports = {
    getFriends, addFriend, getUserById, deleteFriend
}