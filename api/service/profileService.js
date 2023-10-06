const profileDAO = require('../repository/profileDAO');
const uuid = require('uuid');

// Get all pokemon associated with profile
function getAllProfilePokemon(profile_id){
    return new Promise((resolve, reject) => {
        profileDAO.getAllProfilePokemon(profile_id).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
}

// Add pokemon to profile pokemon list
function addProfilePokemon(profile_id, pokemon){

}


// Delete pokemon from profile pokemon list
function deleteProfilePokemon(profile_id, pokemonId){

}

module.exports = {
    getAllProfilePokemon, 
    addProfilePokemon, 
    deleteProfilePokemon
}