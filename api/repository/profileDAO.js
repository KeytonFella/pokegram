const aws = require('aws-sdk');
const docClient = new aws.DynamoDB.DocumentClient();

aws.config.update({
    region: 'us-east-2'
});

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