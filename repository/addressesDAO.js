// ============================= AWS DynamoDB  Setup =============================
// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');

// set  you aws region
AWS.config.update({
    region: 'us-east-2',
});

const TABLE_NAME = 'users_table';

// ============================== DynamoDB Functions ==============================

// Get a user's address based on their user_id
function getAddress(user_id){
    const params = {
        TableName: TABLE_NAME,
        Key: {
            user_id: user_id,
        },
        ProjectionExpression: 'address'
    };
    return docClient.get(params).promise();
}

// Query entire table of users
function getAllAddresses(){
    const params = {
        TableName: TABLE_NAME,
        ProjectionExpression: 'user_id, username, address'
    };
    return docClient.scan(params).promise();
}

module.exports = {
    getAddress,
    getAllAddresses
};