const profileDAO = require('../repository/profileDAO');
const sharp = require('sharp');

// ============================== General Profile Service Calls ==============================
// Get one profile by id
async function getProfileById(profile_id){
    logger.info('getProfileById service called');
    return new Promise((resolve, reject) => {
        profileDAO.getProfileById(profile_id).then((data) => {
            profileDAO.getPhotoFromBucket(data.Item.profile_picture).then((url) => {
                let profile = {
                    bio: data.Item.bio,
                    image_url: url
                }
                logger.info('getProfileById resolved')
                resolve(profile);
            }).catch((err) => {
                logger.error(`Error attempting to getPhotoUrl: ${err}`)
                reject(err);
            });
        }).catch((err) => {
            logger.error(`Error attempting to getProfileById: ${err}`)
            reject(err);
        });
    });
}

// Get photo url from S3 bucket
async function getPhotoUrl(image_name){
    logger.info('getPhotoUrl service called'); 
    return new Promise((resolve, reject) => {
        profileDAO.getPhotoUrl(image_name).then((data) => {
            logger.info('getPhotoUrl resolved')
            resolve(data);
        }).catch((err) => {
            logger.error(`Error attempting to getPhotoUrl: ${err}`)
            reject(err);
        });
    });
}
    

// Get all profile's friends
function getProfileFriends(profile_id){
    logger.info('getProfileFriends service called');
    return new Promise((resolve, reject) => {
        profileDAO.getProfileFriends(profile_id).then((data) => {
            logger.info('getProfileFriends resolved')
            resolve(data);
        }).catch((err) => {
            logger.error(`Error attempting to getProfileFriends: ${err}`)
            reject(err);
        });
    });
}

// Create new profile (empty initially)
function createProfile(profile_id){
    logger.info('createProfile service called');
    return new Promise((resolve, reject) => {
        profileDAO.createProfile(profile_id).then((data) => {
            logger.info('createProfile resolved')
            resolve(data);
        }).catch((err) => {
            logger.error(`Error attempting to createProfile: ${err}`)
            reject(err);
        });
    });
}

// Add friend to profile friends list
function addProfileFriend(profile_id, friend){
    logger.info('addProfileFriend service called');
    return new Promise((resolve, reject) => {
        profileDAO.addProfileFriend(profile_id, friend).then((data) => {
            logger.info('addProfileFriend resolved')
            resolve(data);
        }).catch((err) => {
            logger.error(`Error attempting to addProfileFriend: ${err}`)
            reject(err);
        });
    });
}

// Update profile bio
function updateProfileBio(profile_id, bio){
    logger.info('updateProfileBio service called');
    return new Promise((resolve, reject) => {
        profileDAO.updateProfileBio(profile_id, bio).then((data) => {
            logger.info('updateProfileBio resolved')
            resolve(data);
        }).catch((err) => {
            logger.error(`Error attempting to updateProfileBio: ${err}`)
            reject(err);
        });
    });
}

// Update profile pic
async function updateProfilePic(profile_id, image){
    logger.info('updateProfilePic service called');
    const buffer = await sharp(image.buffer).resize({height: 320, width: 320, fit: 'contain'}).toFormat('png').toBuffer();
    const name = `${profile_id}.png`;

    const response = await profileDAO.addPhotoToBucket(name, buffer, image.mimetype);
    return new Promise((resolve, reject) => {
        if(response){
            profileDAO.updateProfilePic(profile_id, name).then((data) => {
                logger.info('updateProfilePic resolved')
                resolve(data);

            }).catch((err) => {
                logger.error(`Error attempting to updateProfilePic: ${err}`)
                reject(err);
            });
        }else{
            logger.error(`Error attempting to updateProfilePic: ${err}`)
            reject(err);
        }
    });
}


// ============================== Profile Pokemon Service Calls ==============================

// Get all pokemon associated with profile
function getAllProfilePokemon(profile_id){
    logger.info('getAllProfilePokemon service called');
    return new Promise((resolve, reject) => {
        profileDAO.getAllProfilePokemon(profile_id).then((data) => {
            logger.info('getAllProfilePokemon resolved')
            resolve({message: data.Item.pokemon});
        }).catch((err) => {
            logger.error(`Error attempting to getAllProfilePokemon: ${err}`)
            reject(err);
        });
    });
}

// Add pokemon to profile pokemon list
function addProfilePokemon(profile_id, pokemon){
    logger.info('addProfilePokemon service called');
    return new Promise((resolve, reject) => {
        profileDAO.addProfilePokemon(profile_id, pokemon.pokemon).then((data) => {
            logger.info(`Pokemon added: ${pokemon.pokemon}`)
            resolve(data);
        }).catch((err) => {
            logger.error(`Error attempting to add ${pokemon}: ${err}`)
            reject(err);
        });
    });
}


// Delete pokemon from profile pokemon list
async function removeProfilePokemon(profile_id, pokemon){
    logger.info('removeProfilePokemon service called');
    const profile = await profileDAO.getAllProfilePokemon(profile_id);
    const pokemonList = profile.Item.pokemon;
    const index = pokemonList.indexOf(pokemon);
    return new Promise((resolve, reject) => {
        profileDAO.removeProfilePokemon(profile_id, index).then((data) => {
            logger.info(`Pokemon removed: ${pokemon}`)
            resolve(data);
        }).catch((err) => {
            logger.error(`Error attempting to remove ${pokemon}: ${err}`)
            reject(err);
        });
    });

}

// ============================== Logger ==============================
// Winston logger setup
const { createLogger, transports, format} = require('winston');

// Create the logger
const logger = createLogger({
    level: 'info', 
    format: format.combine(
        format.timestamp(),
        format.printf(({timestamp, level, message}) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new transports.Console(), // log to the console
    ]
})

module.exports = {
    getAllProfilePokemon, 
    addProfilePokemon, 
    removeProfilePokemon,
    getProfileById,
    getPhotoUrl,
    getProfileFriends,
    createProfile,
    addProfileFriend,
    updateProfileBio,
    updateProfilePic
}