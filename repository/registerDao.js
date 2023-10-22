/* const AWS = require('aws-sdk');


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






const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-2'
});

docClient = new AWS.DynamoDB.DocumentClient();



// ============================== DynamoDB Functions ==============================
const TABLENAME = 'users_table';

//creates users in dyanmoDB table
function addCognitoToDb(user_id, username, street_number="", street_name="", city="", state="", zip=""){
    const params = {
        TableName: TABLENAME,
        ConditionExpression: 'attribute_not_exists(user_id)',
        Item: {
            user_id,
            username,
            address: {
                street_number,
                street_name,
                city,
                state,
                zip
            },
            friends: [{
                user_id: "0ac11b24-e532-4d15-b36d-74d3e3d88dc3",
                username: "ash_ketchum",
                search_username: "ash_ketchum"
              }],
            search_username: username.toLowerCase(),
            messages: []
        }
    };

    if (!docClient) {
        console.error('docClient is not initialized yet');
        return Promise.reject(new Error('docClient is not initialized'));
    }
    console.log("params", params);
    console.log("params.Item", params.Item.friends);
    return docClient.put(params).promise();
}

// Function to delete a user from DynamoDB
function deleteUser(user_id) {
    const params = {
        TableName: TABLENAME,
        Key: {
            user_id
        },
        ReturnValues: 'ALL_OLD'
    };
    if (!docClient) {
        console.error('docClient is not initialized yet');
        return Promise.reject(new Error('docClient is not initialized'));
    }
    return docClient.delete(params).promise();
}

module.exports = {
    addCognitoToDb, deleteUser
}