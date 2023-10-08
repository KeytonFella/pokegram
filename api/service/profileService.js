const profileDAO = require('../repository/profileDAO');
const uuid = require('uuid');

// Get all pokemon associated with profile
function getAllProfilePokemon(profile_id){
    return new Promise((resolve, reject) => {
        profileDAO.getAllProfilePokemon(profile_id).then((data) => {
            resolve(data.Item.pokemon);
        }).catch((err) => {
            reject(err);
        });
    });
}

// Add pokemon to profile pokemon list
function addProfilePokemon(profile_id, pokemon){
    return new Promise((resolve, reject) => {
        profileDAO.addProfilePokemon(profile_id, pokemon.pokemon).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
}


// Delete pokemon from profile pokemon list
async function removeProfilePokemon(profile_id, pokemon){
    const pokemonList = await getAllProfilePokemon(profile_id);
    const index = pokemonList.indexOf(pokemon);
    return new Promise((resolve, reject) => {
        profileDAO.removeProfilePokemon(profile_id, index).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });

}

module.exports = {
    getAllProfilePokemon, 
    addProfilePokemon, 
    removeProfilePokemon
}