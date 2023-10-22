const { TagResourceCommand } = require('@aws-sdk/client-secrets-manager');
const AWS = require('aws-sdk');
/*





 let docClient;
 var roleToAssume = {RoleArn: 'arn:aws:iam::053796667043:role/AndresGuzman',
                     RoleSessionName: 'session1',
                     DurationSeconds: 900,};
 var roleCreds;
 // Create the STS service object    
 var sts = new AWS.STS({apiVersion: '2011-06-15'});
 //Assume Role
 sts.assumeRole(roleToAssume, function(err, data) {
     if (err) console.log(err, err.stack);
     else{
         roleCreds = {accessKeyId: data.Credentials.AccessKeyId,
                      secretAccessKey: data.Credentials.SecretAccessKey,
                      sessionToken: data.Credentials.SessionToken};
         docClient = new AWS.DynamoDB.DocumentClient({accessKeyId: roleCreds.accessKeyId, secretAccessKey: roleCreds.secretAccessKey, sessionToken: roleCreds.sessionToken});
         stsGetCallerIdentity(roleCreds);
     }
 })
 //Get Arn of current identity
 function stsGetCallerIdentity(creds) {
     var stsParams = {credentials: creds };
     // Create STS service object
     var sts = new AWS.STS(stsParams);      
     sts.getCallerIdentity({}, function(err, data) {
         if (err) {
             console.log(err, err.stack);
         }
         else {
             console.log(data.Arn);
         }
     });    
 
    } */

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
    if(key_type === "username"){key_type = "search_username"}
    const params = {
        TableName: TABLENAME,
        KeyConditionExpression: `${key_type} = :key`,
        ProjectionExpression: 'user_id, username, search_username', // Only get the 'id and username' attribute
        ExpressionAttributeValues: {
            ':key': key
        }
    };
    //user a GSI on the username key if key type is username
    console.log('key type in dao, ', key_type, key)
    if(key_type === 'search_username'){
        params.IndexName = 'search_username-index';
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
        username: friend_username,
        search_username: friend_username.toLowerCase()
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

function getAllUsers(){
    const params ={
        TableName: TABLENAME,
        ProjectionExpression: 'user_id, search_username, username',

    }
    return docClient.scan(params).promise();
}


module.exports = {
    getFriends, addFriend, getUser, deleteFriend, getAllUsers
}