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
profileRouter.put('/:profile_id/pokemon', (req, res) => {
    const pokemon = req.body;
    profileService.updateProfilePokemon(req.params.profile_id,  pokemon).then((data) => {
        res.sendStatus(200);
        res.send(data);
    }).catch((err) => {
        res.sendStatus(500);
        res.send({message: err});
    });
});

// Delete pokemon in profile pokemon list
profileRouter.delete('/:profile_id/pokemon/{pokemonId}', (req, res) => {
    profileService.deleteProfilePokemon(req.params.profile_id, req.params.pokemonId).then((data) => {
        res.sendStatus(204);
        res.send(data);
    }).catch((err) => {
        res.sendStatus(500);
        res.send({message: err});
    });
});

// ============================== Profile calls =========================================

module.exports = profileRouter;