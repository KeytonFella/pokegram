const AWS = require('aws-sdk');

// set  you aws region
AWS.config.update({
    region: 'us-east-2'
});

// create a dynamoDB client
const docClient = new AWS.DynamoDB.DocumentClient();

module.exports = {
    submitTradeData,
    updateDesireList,
    updateSurrenderList,
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

function updateDesireList(user_id, desire_list){
    const params = {
        TableName: "poke_trades",
        Key: {
            user_id
        },
        UpdateExpression: 'set #d = :desire_list',
        ConditionExpression: 'attribute_exists(user_id)',
        ExpressionAttributeNames:{
            '#d': 'desire_list'
        },
        ExpressionAttributeValues:{
            ':desire_list': desire_list
        }
    };
    return docClient.update(params).promise();
}

function updateSurrenderList(user_id, surrender_list){
    const params = {
        TableName: "poke_trades",
        Key: {
            user_id
        },
        UpdateExpression: 'set #s = :surrender_list',
        ConditionExpression: 'attribute_exists(user_id)',
        ExpressionAttributeNames:{
            '#d': 'surrender_list'
        },
        ExpressionAttributeValues:{
            ':surrender_list': surrender_list
        }
    };
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