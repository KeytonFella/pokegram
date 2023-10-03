const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-2'
})

const docClient = new AWS.DynamoDB.DocumentClient();

function createTeam(team_id, user_id, name, pokemonList) {
    const params = {
        TableName: 'teams',
        Item: {
            team_id,
            name,
            pokemonList
        }
    }
    return docClient.put(params).promise();
}

function getTeamByUserId(user_id) {
    const params = {
        TableName: 'teams',
        Key: {user_id}
    }
}

module.exports = {
    createTeam, getTeamByUserId
}