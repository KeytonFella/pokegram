const AWS = require('aws-sdk');

// set  you aws region
AWS.config.update({
    region: 'us-east-2'
});

// create a dynamoDB client
const docClient = new AWS.DynamoDB.DocumentClient();

module.exports = {
    submitTradeData
}

//Post Trade Data (JSON Format = "surrender_list": ["pikachu", "blastoise", "garchomp", "bidoof"])
function submitTradeData(user_id, desire_list, surrender_list){
    const params = {
        TableName: "poke_trades",
        Item: {
            user_id,
            desire_list,
            surrender_list
        }
    };
    return docClient.put(params).promise();
}