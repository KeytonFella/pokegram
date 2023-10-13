// ============================= AWS DynamoDB  Setup =============================
/* 
// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region 
AWS.config.update({
    region: 'us-east-2',

});

let roleToAssume = {RoleArn: 'arn:aws:iam::053796667043:role/ArinAihara',
RoleSessionName: 'session1',
DurationSeconds: 900,};
let roleCreds;

// Create the STS service object    
let sts = new AWS.STS({apiVersion: '2011-06-15'});
let docClient;  

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
});

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

const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-west-2'
});

const docClient = new AWS.DynamoDB.DocumentClient();

// ============================== DynamoDB Functions ==============================
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

function registerAccount(username, password, user_id, street_name="", city=" ", state=" ", zip=" "){
    console.log("creating account  " +" "+username+" "+ password);
    const params = {
        TableName: TABLENAME,
        ConditionExpression: 'attribute_not_exists(username)',
        Item: {
            username,
            password,
            user_id,
            address: {
                street_name,
                city,
                state,
                zip
            }
        }
    }
    return docClient.put(params).promise();
}

module.exports = {
    retrieveByUsername, registerAccount
}