const profileDAO = require('../repository/profileDAO');

// Get all pokemon associated with profile
function getAllProfilePokemon(profile_id){
    logger.info('getAllProfilePokemon called');
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
    logger.info('addProfilePokemon called');
    return new Promise((resolve, reject) => {
        profileDAO.addProfilePokemon(profile_id, pokemon.pokemon).then((data) => {
            logger.info(`Pokemon added: ${pokemon.pokemon}}`)
            resolve(data);
        }).catch((err) => {
            logger.error(`Error attempting to add ${pokemon}: ${err}`)
            reject(err);
        });
    });
}


// Delete pokemon from profile pokemon list
async function removeProfilePokemon(profile_id, pokemon){
    logger.info('removeProfilePokemon called');
    const pokemonList = await getAllProfilePokemon(profile_id);
    const index = pokemonList.indexOf(pokemon);
    return new Promise((resolve, reject) => {
        profileDAO.removeProfilePokemon(profile_id, index).then((data) => {
            logger.info(`Pokemon removed: ${pokemon}}`)
            resolve(data);
        }).catch((err) => {
            logger.error(`Error attempting to remove ${pokemon}: ${err}`)
            reject(err);
        });
    });

}

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
        new transports.File({ filename: 'profiles.log'}), // log to a file
    ]
})

module.exports = {
    getAllProfilePokemon, 
    addProfilePokemon, 
    removeProfilePokemon
}