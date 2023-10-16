const express = require('express');
const profileRouter = express.Router();
const multer  = require('multer')
const upload = multer()
const profileService = require('../service/profileService');


// ============================== Profile calls =========================================
// Get profile by id
profileRouter.get('/:profile_id', (req, res) => {
    profileService.getProfileById(req.params.profile_id).then((data) => {
        res.send(data);
        res.status(200);
    }).catch((err) => {
        res.status(500);
        res.send({message: err});
    });
});


// Create new profile
profileRouter.post('/:profile_id/create', (req, res) => {
    profileService.createProfile(req.params.profile_id).then((data) => {
        res.status(201);
        res.send({message: `Profile ${req.params.profile_id} created`});
    }).catch((err) => {
        res.status(500);
        res.send({message: err});
    });
});


// Update profile bio
profileRouter.put('/:profile_id/update/bio', (req, res) => {
    profileService.updateProfileBio(req.params.profile_id, req.body.bio).then((data) => {
        res.status(200);
        res.send({message: `Bio updated for ${req.params.profile_id}`});
    }).catch((err) => {
        res.status(500);
        res.send({message: err});
    });
});

// Update profile photo
profileRouter.put('/:profile_id/update/photo', upload.single('image'), (req, res) => {
    const image = req.file;
    profileService.updateProfilePic(req.params.profile_id, image).then((data) => {
        res.status(200);
        res.send({message: `Photo updated for ${req.params.profile_id}`});
    }).catch((err) => {
        res.status(500);
        res.send({message: err});
    });
});

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
        res.send({message: `${pokemon.pokemon} added to profile`});
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


module.exports = profileRouter;