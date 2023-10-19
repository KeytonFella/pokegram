
// const AWS = require('aws-sdk');

// // Set your AWS region
// AWS.config.update({
//     region: 'us-east-2',
// });

// let roleToAssume = {
//     RoleArn: 'arn:aws:iam::053796667043:role/AndresGuzman',
//     RoleSessionName: 'session1',
//     DurationSeconds: 1000,
// };

// // Create the STS service object    
// let sts = new AWS.STS({apiVersion: '2011-06-15'});

// let roleCreds;
// let docClient;

// // Assume Role
// sts.assumeRole(roleToAssume, function(err, data) {
//     if (err) {
//         console.log(err, err.stack);
//     } else {
//         roleCreds = {
//             accessKeyId: data.Credentials.AccessKeyId,
//             secretAccessKey: data.Credentials.SecretAccessKey,
//             sessionToken: data.Credentials.SessionToken,
//         };

//         // Initialize DynamoDB Document Client
//         docClient = new AWS.DynamoDB.DocumentClient({
//             accessKeyId: roleCreds.accessKeyId,
//             secretAccessKey: roleCreds.secretAccessKey,
//             sessionToken: roleCreds.sessionToken,
//         });

//         // Get the ARN of the assumed role
//         stsGetCallerIdentity(roleCreds);
//     }
// });

// // Get ARN of current identity
// function stsGetCallerIdentity(creds) {
//     var stsParams = {credentials: creds};
//     var sts = new AWS.STS(stsParams);
        
//     sts.getCallerIdentity({}, function(err, data) {
//         if (err) {
//             console.log(err, err.stack);
//         } else {
//             console.log(data.Arn);
//         }
//     });    
// }
// docClient = new AWS.DynamoDB.DocumentClient();

  //personal database setup


const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-2'
});

docClient = new AWS.DynamoDB.DocumentClient();



// ============================== DynamoDB Functions ==============================
const TABLENAME = 'users_table';

function addCognitoToDb(user_id, username, street_number="",  street_name="", city=" ", state=" ", zip=" "){
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
                username: "ash_ketchum"
              }]
        }
    };

    if (!docClient) {
        console.error('docClient is not initialized yet');
        return Promise.reject(new Error('docClient is not initialized'));
    }
    
    return docClient.put(params).promise();
}

module.exports = {
    addCognitoToDb
}