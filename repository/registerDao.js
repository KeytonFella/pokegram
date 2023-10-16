/* 
    personal database setup
*/
const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-2'
});

const docClient = new AWS.DynamoDB.DocumentClient();


// ============================== DynamoDB Functions ==============================
const TABLENAME = 'users';

function addCognitoToDb(user_id, username,  street_name="", city=" ", state=" ", zip=" "){
    const params = {
        TableName: TABLENAME,
        ConditionExpression: 'attribute_not_exists(user_id)',
        Item: {
            user_id,
            username,
            address: {
                street_name,
                city,
                state,
                zip
            }
        }
    }
    return docClient.put(params).promise();
}

module.exports = {
    addCognitoToDb
}