// ============================= AWS DynamoDB  Setup =============================
// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');

// set  you aws region
AWS.config.update({
    region: 'us-east-2',
});

let roleToAssume = {RoleArn: 'arn:aws:iam::053796667043:role/ArinAihara',
RoleSessionName: 'session1',
DurationSeconds: 900,};
// Create the STS service object    
let sts = new AWS.STS({apiVersion: '2011-06-15'});

let roleCreds;
let docClient;  

//Assume Role
sts.assumeRole(roleToAssume, function(err, data) {
    if (err) console.log(err, err.stack);
    else{
        roleCreds = {accessKeyId: data.Credentials.AccessKeyId,
            secretAccessKey: data.Credentials.SecretAccessKey,
            sessionToken: data.Credentials.SessionToken
        };
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
}

const TABLE_NAME = 'users_table';

// ============================== DynamoDB Functions ==============================

// Get a user's address based on their user_id
function getAddress(user_id){
    const params = {
        TableName: TABLE_NAME,
        Key: {
            user_id: user_id,
        },
        ProjectionExpression: 'address'
    };
    return docClient.get(params).promise();
}

// Query entire table of users
function getAllAddresses(){
    const params = {
        TableName: TABLE_NAME,
        ProjectionExpression: 'user_id, username, address'
    };
    return docClient.scan(params).promise();
}

module.exports = {
    getAddress,
    getAllAddresses
};