const AWS = require('aws-sdk');

// set  you aws region
AWS.config.update({
    region: 'us-east-2'
});

// create a dynamoDB client
const docClient = new AWS.DynamoDB.DocumentClient();

module.exports = {
    submitTradeData,
    addDesireList,
    removeDesireList,
    addSurrenderList,
    removeSurrenderList,
    retrieveTradeDataByUser,
    retrieveAllTradeData
}

//Post Trade Data (JSON Format = "surrender_list": ["pikachu", "blastoise", "garchomp", "bidoof"])
function submitTradeData(user_id, username, desire_list, surrender_list){
    const params = {
        TableName: "poke_trades",
        Item: {
            user_id,
            username,
            desire_list,
            surrender_list
        }
    };
    return docClient.put(params).promise();
}

function addDesireList(user_id, pokemon){
    const params = {
        TableName: "poke_trades",
        Key: {
            user_id
        },
        UpdateExpression: 'set #d = list_append(#d, :p)',
        ConditionExpression: 'attribute_exists(user_id)',
        ExpressionAttributeNames:{
            '#d': 'desire_list'
        },
        ExpressionAttributeValues:{
            ':p': [pokemon]
        }
    };
    return docClient.update(params).promise();
}

function removeDesireList(user_id, index){
    const params = {
        TableName: "poke_trades",
        Key: {
            user_id
        },
        UpdateExpression: `remove desire_list[${index}]`,
    }
    return docClient.update(params).promise();
}

function addSurrenderList(user_id, pokemon){
    const params = {
        TableName: "poke_trades",
        Key: {
            user_id
        },
        UpdateExpression: 'set #s = list_append(#s, :p)',
        ConditionExpression: 'attribute_exists(user_id)',
        ExpressionAttributeNames:{
            '#s': 'surrender_list'
        },
        ExpressionAttributeValues:{
            ':p': [pokemon]
        }
    };
    return docClient.update(params).promise();
}

function removeSurrenderList(user_id, index){
    const params = {
        TableName: "poke_trades",
        Key: {
            user_id
        },
        UpdateExpression: `remove surrender_list[${index}]`,
    }
    return docClient.update(params).promise();
}

function retrieveTradeDataByUser(user_id){
    const params = {
        TableName: "poke_trades",
        Key: {
            user_id
        }
    };
    return docClient.get(params).promise();
}

function retrieveAllTradeData(){
    const params = {
        TableName: "poke_trades"
    }   
    return docClient.scan(params).promise();
}

// function retrieveUsersWithPokemon(pokemon){
//     const params = {
//         TableName: "poke_trades",
//         FilterExpression: "contains(#s, :pokemon)",
//         ExpressionAttributeNames: {
//             '#s': 'surrender_list'
//         },
//         ExpressionAttributeValues: {
//             ':pokemon': pokemon
//         },  
//     }   
//     return docClient.scan(params).promise();
// }

// function pokemonOnList(user_id, pokemon){
//     const params = {
//         TableName: "poke_trades",
//         Key: {
//             user_id
//         },
//         FilterExpression: "contains(#s, :pokemon)",
//         ExpressionAttributeNames: {
//             '#s': 'surrender_list'
//         },
//         ExpressionAttributeValues: {
//             ':pokemon': pokemon
//         }
//     }
//     return docClient.get(params).promise();
// }