const AWS = require('aws-sdk');

let docClient;

AWS.config.update({
    region: 'us-east-2'
})

docClient = new AWS.DynamoDB.DocumentClient();

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