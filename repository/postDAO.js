const AWS = require('aws-sdk');
// Set the region 
AWS.config.update({
    region: 'us-east-2',

});
const BUCKET_NAME_PHOTO = "poke-post-image-bucket";
const docClient = new AWS.DynamoDB.DocumentClient();
const {S3Client, GetObjectCommand, PutObjectCommand} = require('@aws-sdk/client-s3');
const s3 = new S3Client({region: 'us-east-2'});

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
async function PostImageDAO(name, buffer, mimetype){
    const params = {
        Bucket: BUCKET_NAME_PHOTO,
        Key: name,
        Body: buffer,
        ContentType: mimetype,
    }
    const command = new PutObjectCommand(params);
    return await s3.send(command);
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