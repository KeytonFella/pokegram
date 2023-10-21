const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-2'
});

docClient = new AWS.DynamoDB.DocumentClient();

module.exports = {
    getMessages,
    addMessage,
    deleteMessage,
    getUsernameById,
    getIdByUsername
}

const TABLENAME = 'users_table';

function getMessages(user_id){
    const params = {
        TableName: TABLENAME,
        Key: {
            user_id
        },
        ProjectionExpression: 'messages'
    }
    return docClient.get(params).promise();
}

function getUsernameById(user_id){
    const params = {
        TableName: TABLENAME,
        Key: {
            user_id
        },
        ProjectionExpression: 'username'
    }
    return docClient.get(params).promise();
}

function getIdByUsername(username){
    const params = {
        TableName: TABLENAME,
        FilterExpression: '#u = :username',
        ExpressionAttributeNames: {
            '#u': 'username'
        },
        ExpressionAttributeValues: {
            ':username': username
        },  
        ProjectionExpression: 'user_id'
    }
    return docClient.scan(params).promise();
}

function addMessage(user_id, message){
    const params = {
        TableName: TABLENAME,
        Key: {
            user_id
        },
        UpdateExpression: 'set #m = list_append(#m, :message)',
        ConditionExpression: 'attribute_exists(user_id)',
        ExpressionAttributeNames:{
            '#m': 'messages'
        },
        ExpressionAttributeValues:{
            ':message': [message]
        }
    };
    return docClient.update(params).promise();
}

function deleteMessage(user_id, index){
    const params = {
        TableName: TABLENAME,
        Key: {
            user_id
        },
        UpdateExpression: `remove messages[${index}]`,
    }
    return docClient.update(params).promise();
}