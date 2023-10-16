const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const teamService = require('../service/teamService')
const mw = require('../utility/middleware/teamMW.js')
const jwUtil = require('../utility/jwt_util.js')

router.use(bodyParser.json());



router.post('', mw.validateTeam, (req, res) => {
    //const token = req.headers.authorization.split(' ')[0]
    const team = req.body
    console.log("Attempting to post team")
    //jwUtil.verifyTokenAndReturnPayload(token)
      //  .then((payload) => {
        if(req.body.valid) {
            console.log("valid team")
            
            teamService.createTeam(team.teamName, team.pokemonList, team.user_id)
                .then((data) => {
                    res.statusCode = 200;
                    res.send({
                        message: `Team submitted: ${data}`
                    })
                })
                .catch((err) => {
                    res.statusCode = 400
                    res.send({message: `Team creation failed. ${err}`})
                })
        }
    //})
})

router.get('/:team_id', (req,res) => {
    
    const id = req.params.team_id


    teamService.getTeamById(id)
    .then((data) => {
        res.send({body: data.Item})
    }).catch((err) => {
        res.statusCode = 400
        res.send({message: err})
    })
})

router.put('/:team_id', mw.validateTeam, (req, res) => {
    const id = req.params.team_id
    const body = req.body
    if(req.body.valid) {
    teamService.updateTeamById(id, body.name, body.pokemonList)
        .then((data) => {
            res.send({message: `Successfully updated team ${data}`})
        }).catch((err) => {
            res.statusCode = 400
            res.send({message: err})
        })
    } else {
        res.statusCode = 400
        res.send({message: "Team validation failed"})
    }
})

module.exports = router