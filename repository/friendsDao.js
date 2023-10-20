const { TagResourceCommand } = require('@aws-sdk/client-secrets-manager');
const AWS = require('aws-sdk');
const { param } = require('../controller/friendsController');

AWS.config.update({
    region: 'us-east-2'
});

const docClient = new AWS.DynamoDB.DocumentClient();

// ============================== DynamoDB Functions ==============================

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

//Gets a user based on a key of key_type: user_id or username
function getUser(key, key_type){
    const params = {
        TableName: TABLENAME,
        KeyConditionExpression: `${key_type} = :key`,
        ProjectionExpression: 'user_id, username', // Only get the 'id and username' attribute
        ExpressionAttributeValues: {
            ':key': key
        }
    };
    //user a GSI on the username key if key type is username
    if(key_type === 'username'){
        params.IndexName = 'username-index';
    }
    return docClient.query(params).promise();
}

/* //query the db using a GSI on username
function getUserByUsername(){
    const params = {
        TableName: TABLENAME,
        KeyConditionExpression: `${key_type} = :key`,
        ProjectionExpression: 'user_id, username', // Only get the 'id and username' attribute
        ExpressionAttributeValues: {
            ':key': key
        }
        
    }
    return docClient.query(params).promise();
} */


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
    getFriends, addFriend, getUser, deleteFriend
}