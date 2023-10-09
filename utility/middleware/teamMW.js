const express = require('express');
const app = express()

function validateTeam(req, res, next) {
    console.log("Validating team...")
    console.log("req.body = " + req.body)
    const team = req.body
    console.log("validating team " + team)
    console.log(team.name)
    console.log(team.pokemonList)
    console.log(team.pokemonList.length)
    // Team must have a name and a range of 1 - 6 pokemon
    if (!team.name) {
        console.log("Team not ok")
        res.statusCode = 400
        res.send({messsage: "Error: Team is missing a name"})
        req.body.valid = false;
    } else if (!req.body.pokemonList || !req.body.pokemonList.length) {

        res.statusCode = 400
        res.send({message: "Error: Team cannot be empty"})
        req.body.valid = false;
    } else if (team.pokemonList.length > 6) {
        res.statusCode = 400
        res.send({message: "Error: Team must have a maximum of 6 pokemon"})
        req.body.valid = false;
        
    } else {
        req.body.valid = true;
        next();
    }
}

module.exports = {
    validateTeam
}