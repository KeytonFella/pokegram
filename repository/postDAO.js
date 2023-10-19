const AWS = require('aws-sdk');
// Set the region 
AWS.config.update({
    region: 'us-east-2',

});
const docClient = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();
function PostDAO(post_id, user_id_fk, text_body, image_s3_id, tags){
    const params = {
        TableName: "poke_posts_table",
        Item: {
            post_id,
            user_id_fk,
            text_body,
            image_s3_id,
            tags
        }
    };
    return docClient.put(params).promise();
}
function PostImageDAO(image_id, image_buffer){
    const params = {
            Bucket: 'poke-post-image-bucket',
            Key: image_id, 
            Body: image_buffer
    };
    return s3.upload(params).promise();
};
function getUsersPostsDAO(user_id) {
    const params = {
        TableName: "poke_posts_table",
        IndexName : 'user_id_fk-index',
        KeyConditionExpression: '#s = :stype',
        ExpressionAttributeValues: {
            ':stype': user_id
        },
        ExpressionAttributeNames: {
            '#s': 'user_id_fk'
        }
    };
    return docClient.query(params).promise();
}
function getImageDAO(image_id){
    const params = {
            Bucket: 'poke-post-image-bucket',
            Key: image_id
    };
    return s3.getObject(params).createReadStream();
};
module.exports = {
    PostDAO,
    PostImageDAO,
    getUsersPostsDAO,
    getImageDAO,
}