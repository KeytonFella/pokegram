// ============================= AWS DynamoDB  Setup =============================

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
}

// ============================== DynamoDB Functions ==============================

// Get all pokemon associated with profile
function getAllProfilePokemon(profile_id){
    const params = {
        TableName: 'poke_profiles',
        Key: {
            'profile_id': profile_id 
        }
    }
    return docClient.get(params).promise();
}

// Add pokemon to profile pokemon list
function addProfilePokemon(profile_id, pokemon){
    const params = {
        TableName: 'poke_profiles',
        Key: {
            'profile_id': profile_id,
        },
        UpdateExpression: 'set #p = list_append(#p, :p)',
        ExpressionAttributeNames: {
            '#p': 'pokemon'
        },
        ExpressionAttributeValues: {
            ':p': [pokemon]
        },
    }
    return docClient.update(params).promise();
}

// Delete pokemon from profile pokemon list
function removeProfilePokemon(profile_id, index){
    const params = {
        TableName: 'poke_profiles',
        Key: {
            'profile_id': profile_id
        },
        UpdateExpression: `remove pokemon[${index}]`,

    }
    return docClient.update(params).promise();
}

module.exports = {
    getAllProfilePokemon, 
    addProfilePokemon, 
    removeProfilePokemon
}