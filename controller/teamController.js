const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const teamService = require('../service/teamService')
const mw = require('../utility/middleware/teamMW.js')

router.use(bodyParser.json());



router.post('', mw.validateTeam, (req, res) => {
    const team = req.body
    console.log("Attempting to post team")
    
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
   
})

router.get('/:user_id', (req,res) => {
    
    const id = req.params.user_id


    teamService.getTeamByUserId(id)
    .then((data) => {
        res.send({body: data.Item})
    }).catch((err) => {
        res.statusCode = 400
        res.send({message: err})
    })
})

// router.get('', (req, res) => {
//     const id = String(req.query.user_id)
//     console.log("user_id:", id)
//     teamService.getTeamByUserId(id)
//     .then((data) => {
//         res.send({body: data.Item})
//     }).catch((err) => {
//         res.send({message: err})
//     })
// })

router.put('/:user_id', mw.validateTeam, (req, res) => {
    const id = req.params.user_id
    const body = req.body
    if(req.body.valid) {
        teamService.updateTeamById(id, body.teamName, body.pokemonList)
            .then((data) => {
                res.send({message: `Successfully updated team ${data}`})
            }).catch((err) => {
                res.statusCode = 400
                res.send({message: err})
            })
    } 
    else {
        res.statusCode = 400
        res.send({message: "Team validation failed"})
    }
})

module.exports = router