// ============================= AWS DynamoDB  Setup =============================
const AWS = require('aws-sdk');

// set  you aws region
AWS.config.update({
    region: 'us-east-2'
});

// create a dynamoDB client
const docClient = new AWS.DynamoDB.DocumentClient();

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