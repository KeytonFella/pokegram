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
async function getUsernameByProfileID(profile_id){
    logger.info('getUsernameByProfileID service called');
    return new Promise((resolve, reject) => {
        profileDAO.getUsernameByProfileIDDAO(profile_id).then((data) => {
            let username = {
                username: data.Item.username,
            }
            resolve(username);
        }).catch((err) => {
            logger.error(`Error attempting to getUsernameByProfileID: ${err}`)
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
    const buffer = await sharp(image.buffer).resize({height: 180, fit: 'contain'}).toFormat('png').toBuffer();
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

// Update user address
function updateUserAddress(user_id, address){
    logger.info('updateUserAddress service called');
    return new Promise((resolve, reject) => {
        if(address.street_number && address.street_name && address.city && address.state && address.zip){
            profileDAO.updateUserAddress(user_id, address).then((data) => {
                logger.info('updateUserAddress resolved')
                resolve(data);
            }).catch((err) => {
                logger.error(`Error attempting to updateUserAddress: ${err}`)
                reject(err);
            });
        }else{
            logger.error(`Error attempting to updateUserAddress: all fields must be filled out`)
            reject(`Error attempting to updateUserAddress: all fields must be filled out`);
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
async function addProfilePokemon(profile_id, pokemon){
    logger.info('addProfilePokemon service called');
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
    const profile = await profileDAO.getAllProfilePokemon(profile_id);
    const pokemonList = profile.Item.pokemon;
    const index = pokemonList.indexOf(pokemon);
    return new Promise((resolve, reject) => {
        if(index < 0 && response.status == 200){
            profileDAO.addProfilePokemon(profile_id, pokemon).then((data) => {
                logger.info(`Pokemon added: ${pokemon}`)
                resolve(data);
            }).catch((err) => {
                logger.error(`Error attempting to add ${pokemon}: ${err}`)
                reject(err);
            });
        }else{
            reject(`${pokemon} has already been caught or does not exist`)
        }
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
    createProfile,
    updateProfileBio,
    updateProfilePic,
    updateUserAddress,
    getUsernameByProfileID //added by Josh
}