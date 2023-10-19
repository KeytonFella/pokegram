// ============================= AWS DynamoDB  Setup =============================
// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-2',
});

// Create the STS service object    
const {S3Client, GetObjectCommand, PutObjectCommand} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3 = new S3Client({region: 'us-east-2'});
const TABLE_NAME = "poke_profiles";
const BUCKET_NAME = 'pokegram-profile-photos';


// ============================== DynamoDB Functions ==============================

// ============================== General Profile Calls ==============================
// Get one profile
function getProfileById(profile_id){
    const params = {
        TableName: TABLE_NAME,
        Key: {
            'profile_id': profile_id 
        }
    }
    return docClient.get(params).promise();
}


// Get photo from s3 bucket
async function getPhotoFromBucket(name){
    const params = {
        Bucket: BUCKET_NAME,
        Key: name,
    }
    const command = new GetObjectCommand(params);
    const signedUrl = await getSignedUrl(s3, command, {expiresIn: 3600});
    return signedUrl;
}

// Create new profile 
function createProfile(profile_id){
    const params = {
        TableName: TABLE_NAME,
        Item: {
            'profile_id': profile_id,
            'bio': '',
            'pokemon': [],
            'profile_picture': 'default.jpg'
        }
    }
    return docClient.put(params).promise();
}

// Update profile bio
function updateProfileBio(profile_id, bio){
    const params = {
        TableName: TABLE_NAME,
        Key: {
            'profile_id': profile_id 
        },
        UpdateExpression: 'set bio = :b',
        ExpressionAttributeValues: {
            ':b': bio
        }
    }
    return docClient.update(params).promise();
}

// Update profile image
function updateProfilePic(profile_id, image){
    const params = {
        TableName: TABLE_NAME,
        Key: {
            'profile_id': profile_id 
        },
        UpdateExpression: 'set profile_picture = :i',
        ExpressionAttributeValues: {
            ':i': image
        }
    }
    return docClient.update(params).promise();
}

// Add photo to s3 bucket
async function addPhotoToBucket(name, buffer, mimetype){
    const params = {
        Bucket: BUCKET_NAME,
        Key: name,
        Body: buffer,
        ContentType: mimetype,
    }
    const command = new PutObjectCommand(params);
    return await s3.send(command);
}


// ============================== Pokemon Calls ==============================
// Get all pokemon associated with profile
function getAllProfilePokemon(profile_id){
    const params = {
        TableName: TABLE_NAME,
        Key: {
            'profile_id': profile_id 
        },
        ProjectionExpression: 'pokemon'
    }
    return docClient.get(params).promise();
}

// Add pokemon to profile pokemon list
function addProfilePokemon(profile_id, pokemon){
    const params = {
        TableName: TABLE_NAME,
        Key: {
            'profile_id': profile_id,
        },
        UpdateExpression: 'set #p = list_append(#p, :p)',
        ExpressionAttributeNames: {
            '#p': 'pokemon'
        },
        ExpressionAttributeValues: {
            ':p': [pokemon]
        },
    }
    return docClient.update(params).promise();
}

// Delete pokemon from profile pokemon list
function removeProfilePokemon(profile_id, index){
    const params = {
        TableName: TABLE_NAME,
        Key: {
            'profile_id': profile_id
        },
        UpdateExpression: `remove pokemon[${index}]`,

    }
    return docClient.update(params).promise();
}

module.exports = {
    getAllProfilePokemon, 
    addProfilePokemon, 
    removeProfilePokemon,
    getProfileById,
    createProfile,
    updateProfileBio,
    updateProfilePic,
    addPhotoToBucket,
    getPhotoFromBucket
}
