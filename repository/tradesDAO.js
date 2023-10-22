/* const AWS = require('aws-sdk');




 let docClient;
 var roleToAssume = {RoleArn: 'arn:aws:iam::053796667043:role/AndresGuzman',
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
         docClient = new AWS.DynamoDB.DocumentClient({accessKeyId: roleCreds.accessKeyId, secretAccessKey: roleCreds.secretAccessKey, sessionToken: roleCreds.sessionToken});
         stsGetCallerIdentity(roleCreds);
     }
 })
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
 
    } */




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
    retrieveAllTradeData,
    addTradeOffer
}

//Post Trade Data (JSON Format = "surrender_list": ["pikachu", "blastoise", "garchomp", "bidoof"])
function submitTradeData(user_id, username){
    const params = {
        TableName: "poke_trades",
        Item: {
            user_id,
            username,
            desire_list: [],
            surrender_list: [],
            trade_offers: []
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

function addTradeOffer(user_id, trade_offer){
    const params = {
        TableName: "poke_trades",
        Key: {
            user_id
        },
        UpdateExpression: 'set #o = list_append(#o, :o)',
        ConditionExpression: 'attribute_exists(user_id)',
        ExpressionAttributeNames:{
            '#o': 'trade_offers'
        },
        ExpressionAttributeValues:{
            ':o': [trade_offer]
        }
    };
    return docClient.update(params).promise();
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