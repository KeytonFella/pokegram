

const { TagResourceCommand } = require('@aws-sdk/client-secrets-manager');
const AWS = require('aws-sdk');

// Set your AWS region
AWS.config.update({
    region: 'us-east-2',
});

let roleToAssume = {
    RoleArn: 'arn:aws:iam::053796667043:role/AndresGuzman',
    RoleSessionName: 'session1',
    DurationSeconds: 900,
};

// Create the STS service object    
let sts = new AWS.STS({apiVersion: '2011-06-15'});

let roleCreds;
let docClient;

// Assume Role
sts.assumeRole(roleToAssume, function(err, data) {
    if (err) {
        console.log(err, err.stack);
    } else {
        roleCreds = {
            accessKeyId: data.Credentials.AccessKeyId,
            secretAccessKey: data.Credentials.SecretAccessKey,
            sessionToken: data.Credentials.SessionToken,
        };

        // Initialize DynamoDB Document Client
        docClient = new AWS.DynamoDB.DocumentClient({
            accessKeyId: roleCreds.accessKeyId,
            secretAccessKey: roleCreds.secretAccessKey,
            sessionToken: roleCreds.sessionToken,
        });

        // Get the ARN of the assumed role
        stsGetCallerIdentity(roleCreds);
    }
});

// Get ARN of current identity
function stsGetCallerIdentity(creds) {
    var stsParams = {credentials: creds};
    var sts = new AWS.STS(stsParams);
        
    sts.getCallerIdentity({}, function(err, data) {
        if (err) {
            console.log(err, err.stack);
        } else {
            console.log(data.Arn);
        }
    });    
}

/* 
    personal database setup
*/

/* const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-2'
});

const docClient = new AWS.DynamoDB.DocumentClient();
 */
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


module.exports = {
    getFriends, addFriend, getUserById
}