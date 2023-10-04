const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const profileService = require('../service/profileService');

router.use(bodyParser.json());

// Declare router base
router.use('/profile', router);
// Get all pokemon associated with profile
router.get('/{userId}/pokemon', (req, res) => {
    profileService.getAllProfilePokemon(req.params.userId).then((data) => {
        res.sendStatus(200);
        res.send(data);
    }).catch((err) => {
        res.sendStatus(500);
        res.send({message: err});
    });
});

// Get single pokemon from profile pokemon list
router.get('/{userId}/pokemon/{pokemonId}', (req, res) => {
    profileService.getProfilePokemonById(req.params.userId, req.params.pokemonId).then((data) => {
        res.sendStatus(200);
        res.send(data);
    }).catch((err) => {
        res.sendStatus(500);
        res.send({message: err});
    });
});

// Add pokemon to profile pokemon list
router.post('/{userId}/pokemon', (req, res) => {
    const pokemon = req.body;
    profileService.addProfilePokemon(req.params.userId, pokemon).then((data) => {
        res.sendStatus(201);
        res.send(data);
    }).catch((err) => {
        res.sendStatus(500);
        res.send({message: err});
    });
});

// Update pokemon in profile pokemon list
router.put('/{userId}/pokemon/{pokemonId}', (req, res) => {
    const pokemon = req.body;
    profileService.updateProfilePokemon(req.params.userId, req.params.pokemonId, pokemon).then((data) => {
        res.sendStatus(200);
        res.send(data);
    }).catch((err) => {
        res.sendStatus(500);
        res.send({message: err});
    });
});