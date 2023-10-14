const express = require('express');
const profileRouter = express.Router();
const profileService = require('../service/profileService');

//============================= Profile pokemon calls =========================================
// Get all pokemon associated with profile
profileRouter.get('/:profile_id/pokemon', (req, res) => {
    profileService.getAllProfilePokemon(req.params.profile_id).then((data) => {
        res.status(200);
        res.send(data);
    }).catch((err) => {
        res.status(500);
        res.send({message: err});
    });
});

// Add pokemon in profile pokemon list
profileRouter.put('/:profile_id/pokemon/add', (req, res) => {
    const pokemon = req.body;
    profileService.addProfilePokemon(req.params.profile_id,  pokemon).then((data) => {
        res.status(200);
        res.send({message: `${pokemon} added to profile`});
    }).catch((err) => {
        res.status(500);
        res.send({message: err});
    });
});

// Delete pokemon in profile pokemon list
profileRouter.put('/:profile_id/pokemon/remove', (req, res) => {
    const pokemon = req.body.pokemon;
    profileService.removeProfilePokemon(req.params.profile_id, pokemon).then((data) => {
        res.status(204);
        res.send({message: `${pokemon} removed from profile`});
    }).catch((err) => {
        res.status(500);
        res.send({message: err});
    });
});

// ============================== Profile calls =========================================

module.exports = profileRouter;