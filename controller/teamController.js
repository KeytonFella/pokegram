const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const service = require('../service/teamService')
const mw = require('../middleware')
const teamDao = require('../repository/teamDAO')
const uuid = require('uuid')
const teamService = require('../service/teamService')

router.use(bodyParser.json());
router.use('/teams', router);

router.post('/teams', mw.validateTeam, (req, res) => {
    const body = req.body;
    if(req.body.valid) {
        teamService.addTeam(uuid.v4(), body.name, body.pokemonList)
            .then(() => {
                res.statusCode = 201;
                res.send({
                    message: "Successfully created team"
                })
            })
            .catch((err) => {
                res.send({messsage: `Team creation failed. ${err}`})
            })
    } else {
        res.statusCode = 400
        res.send({message: "Team validation failed."})
    }
})
