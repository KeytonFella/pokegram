const express = require('express');
const addressesRouter = express.Router();
const addressesService = require('../service/addressesService');

// ============================== Geocoding calls =========================================
// Get address from user_id
addressesRouter.get('/user/:user_id', (req, res) => {
    addressesService.getAddress(req.params.user_id).then((data) => {
        res.status(200);
        res.send(data);
    }).catch((err) => {
        res.status(500);
        res.send({message: err});
    });
});

// Get all addresses in the same state
addressesRouter.post('/user/:user_id/others', (req, res) => {
    const distance = req.body.distance;
    addressesService.getAllAddresses(req.params.user_id, distance).then((data) => {
        res.status(200);
        res.send(data);
    }).catch((err) => {
        res.status(500);
        res.send({message: err});
    });
});

module.exports = addressesRouter;