const express = require('express');
const app = express()

async function validatePokemonNames(pokemonList) {

    for(let h = 0; h < pokemonList.length; h++) {
        const lower = pokemonList[h].pokemonName.toLowerCase()
        const pokeapi = `https://pokeapi.co/api/v2/pokemon/${lower}`
        const response  = await fetch(pokeapi)
        if(response.status == 404) {
            //Pokemon does not exist
            return false;
            
        } 
    }
            
    return true;
}

function validatePokemonLevels(pokemonList) {
    //check pokemon levels
    for(let i = 0; i< pokemonList.length; i++) {
        if(pokemonList[i].level > 100 || pokemonList[i].level < 0 || !pokemonList[i].level){
            return {bool: false, badPokemon: pokemonList[i].pokemonName}
            // req.body.valid = false;
            // res.statusCode = 400
            // res.send({message: `Error: ${team.pokemonList[i].pokemonName}'s level is out of bounds`})
        }
    }
    return {bool: true, badPokemon: null}
}


async function validateTeam(req, res, next) {
    console.log("Validating team...")
    console.log("req.body = " + req.body)
    const team = req.body
    console.log("validating team " + JSON.stringify(team))
    console.log("teamname: " + team.teamName)
    console.log(team.pokemonList)
    
    // Team must have a name and a range of 1 - 6 pokemon
    if (!team.teamName) {
        console.log("Team not ok")
        //res.statusCode = 400
        res.status(400).send({message: "Error: Team is missing a name"})
        req.body.valid = false;
    } else if (!req.body.pokemonList || req.body.pokemonList.length < 1) {

        res.statusCode = 400
        res.send({message: "Error: Team cannot be empty"})
        req.body.valid = false;
    } else if (team.pokemonList.length > 6) {
        res.statusCode = 400
        res.send({message: "Error: Team must have a maximum of 6 pokemon"})
        req.body.valid = false;
        
        
    } else {
        const response = await validatePokemonNames(team.pokemonList)
        
        if (!response) {
            res.statusCode = 400
            res.send({message: "Error: Invalid pokemon name(s)"})
            req.body.valid = false
        } else {
            const response = validatePokemonLevels(team.pokemonList)
            if(response.bool === false) {
                req.body.valid = false;
                res.statusCode = 400
                res.send({message: `Error: ${response.badPokemon}'s level is out of bounds!`})
            } else {
            //check pokemon levels
            // for(let i = 0; i< team.pokemonList.length; i++) {
            //     if(team.pokemonList[i].level > 100 || team.pokemonList[i].level < 0 || !team.pokemonList[i].level){
            //         req.body.valid = false;
            //         res.statusCode = 400
            //         res.send({message: `Error: ${team.pokemonList[i].pokemonName}'s level is out of bounds`})
            //     }
            // }
                req.body.valid = true;
                next();
            }
        }
        
        
        
    }
}

module.exports = {
    validateTeam, validatePokemonNames
}