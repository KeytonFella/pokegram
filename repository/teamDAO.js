const AWS = require('aws-sdk');

// let docClient;
// var roleToAssume = {RoleArn: 'arn:aws:iam::053796667043:role/PeterNepomuceno',
//                     RoleSessionName: 'session1',
//                     DurationSeconds: 900,};
// var roleCreds;

// // Create the STS service object    
// var sts = new AWS.STS({apiVersion: '2011-06-15'});

// //Assume Role
// sts.assumeRole(roleToAssume, function(err, data) {
//     if (err) console.log(err, err.stack);
//     else{
//         roleCreds = {accessKeyId: data.Credentials.AccessKeyId,
//                      secretAccessKey: data.Credentials.SecretAccessKey,
//                      sessionToken: data.Credentials.SessionToken};
//         docClient = new AWS.DynamoDB.DocumentClient({accessKeyId: roleCreds.accessKeyId, secretAccessKey: roleCreds.secretAccessKey, sessionToken: roleCreds.sessionToken});
//         stsGetCallerIdentity(roleCreds);
//     }
// });

// //Get Arn of current identity
// function stsGetCallerIdentity(creds) {
//     var stsParams = {credentials: creds };
//     // Create STS service object
//     var sts = new AWS.STS(stsParams);
        
//     sts.getCallerIdentity({}, function(err, data) {
//         if (err) {
//             console.log(err, err.stack);
//         }
//         else {
//             console.log(data.Arn);
//         }
//     });    
// }

AWS.config.update({
    region: 'us-east-2'
})

const docClient = new AWS.DynamoDB.DocumentClient();

function createTeam(teamName, pokemonList, user_id) {
    const params = {
        TableName: 'teams_table',
        Item: {
            user_id,
            teamName,
            pokemonList
        }
    }
    if (!docClient) {
        console.error('docClient is not initialized yet');
        return Promise.reject(new Error('docClient is not initialized'));
    }
    return docClient.put(params).promise();
}

function getTeamByUserId(user_id) {
    const params = {
        TableName: 'teams_table',
        Key: {user_id}
    }
    if (!docClient) {
        console.error('docClient is not initialized yet');
        return Promise.reject(new Error('docClient is not initialized'));
    }
    return docClient.get(params).promise()
}

function updateTeamById(user_id, teamName, pokemonList) {
    const params = {
        TableName: 'teams_table',
        Key: {user_id},
        UpdateExpression: 'set #n = :value, #p = :value2',
        ExpressionAttributeNames: {
            '#n': 'teamName',
            '#p': 'pokemonList'
        },
        ExpressionAttributeValues: {
            ':value': teamName,
            ':value2': pokemonList
        }
    }
    return docClient.update(params).promise();
}



module.exports = {
    createTeam, getTeamByUserId, updateTeamById
}