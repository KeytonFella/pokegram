const AWS = require('aws-sdk');


let docClient;
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

// AWS.config.update({
//     region: 'us-east-2'
// })

// docClient = new AWS.DynamoDB.DocumentClient();

//TODO: Attach team to user id
function createTeam(team_id, name, pokemonList, user_id) {
    const params = {
        TableName: 'teams',
        Item: {
            team_id,
            name,
            pokemonList,
            user_id
        }
    }
    return docClient.put(params).promise();
}

function getTeamById(team_id) {
    const params = {
        TableName: 'teams',
        Key: {team_id}
    }
    return docClient.get(params).promise()
}

function updateTeamById(team_id, name, pokemonList) {
    const params = {
        TableName: 'teams',
        Key: {team_id},
        UpdateExpression: 'set #n = :value, #p = :value2',
        ExpressionAttributeNames: {
            '#n': 'name',
            '#p': 'pokemonList'
        },
        ExpressionAttributeValues: {
            ':value': name,
            ':value2': pokemonList
        }
    }
    return docClient.update(params).promise();
}

module.exports = {
    createTeam, getTeamById, updateTeamById
}