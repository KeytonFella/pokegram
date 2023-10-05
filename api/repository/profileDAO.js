// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-east-2'});

var roleToAssume = {RoleArn: 'arn:aws:iam::053796667043:role/ArinAihara',
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

// Get all pokemon associated with profile
function getAllProfilePokemon(userId){
    const params = {
        TableName: 'profiles',
        Key: {userId}
    }
    return docClient.get(params).promise();
}

// Get single pokemon from profile pokemon list
function getProfilePokemonById(userId, pokemonId){
    const params = {
        TableName: 'profiles',
        Key: {userId, pokemonId}
    }
    return docClient.get(params).promise();
}

// Add pokemon to profile pokemon list
function addProfilePokemon(userId, pokemon){
    const params = {
        TableName: 'profiles',
        Item: {
            userId,
            pokemonId: uuid.v4(),
            pokemon
        }
    }
    return docClient.put(params).promise();
}

// Update pokemon in profile pokemon list
function updateProfilePokemon(userId, pokemonId, pokemon){
    const params = {
        TableName: 'profiles',
        Key: {userId, pokemonId},
        UpdateExpression: 'set pokemon = :p',
        ExpressionAttributeValues: {
            ':p': pokemon
        },
        ReturnValues: 'UPDATED_NEW'
    }
    return docClient.update(params).promise();
}

// Delete pokemon from profile pokemon list
function deleteProfilePokemon(userId, pokemonId){
    const params = {
        TableName: 'profiles',
        Key: {userId, pokemonId}
    }
    return docClient.delete(params).promise();
}

module.exports = {
    getAllProfilePokemon, 
    getProfilePokemonById, 
    addProfilePokemon, 
    updateProfilePokemon,
    deleteProfilePokemon
}