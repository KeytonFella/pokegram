const express = require('express');
const app = express()

function validateTeam(req, res, next) {
    console.log("Validating team...")
    console.log("req.body = " + req.body)
    const team = req.body
    console.log("validating team " + JSON.stringify(team))
    console.log("teamname: " + team.teamName)
    console.log(team.pokemonList)
    console.log(team.pokemonList.length)
    
    // Team must have a name and a range of 1 - 6 pokemon
    if (!team.teamName) {
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
        let goOn = true;
        for(let h = 0; h < team.pokemonList.length; h++) {
            console.log('h = ',h)
            //TODO: Check user's input are actual names of pokemon
            const lower = team.pokemonList[h].pokemonName.toLowerCase()
            const pokeapi = `https://pokeapi.co/api/v2/pokemon/${lower}`
            console.log(pokeapi)
            if(goOn == true) {
                fetch(pokeapi).then((response) => {
                    // console.log(`${lower} response:`)
                    // console.log(response)
                    console.log("fetching api")
                    if(response.status === 404) {
                        console.log("404")
                        goOn = false
                        res.statusCode = 400
                        res.send({message: `Error: ${team.pokemonList[h].pokemonName} is not a real pokemon`})
                        req.body.valid = false;
                        return
                    } 
                })
                //.catch((e) => {
                //     console.log("catching error")
                //     goOn = false
                //     req.body.valid = false;
                //     res.statusCode = 400
                //     res.send({message: "error fetching pokemon from API: ", e})
                    
                // })
            }   
            
        }
        
        //check pokemon levels
        for(let i = 0; i< team.pokemonList.length; i++) {
            if(team.pokemonList[i].level > 100 || team.pokemonList[i].level < 0 || !team.pokemonList[i].level){
                req.body.valid = false;
                res.statusCode = 400
                res.send({message: `Error: ${team.pokemonList[i].name}'s level is out of bounds`})
            }
        }
        req.body.valid = true;
        next();
    }
}

module.exports = {
    validateTeam
}