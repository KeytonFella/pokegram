const teamDao = require('../repository/teamDAO');
//const mw = require('..middleware')
const uuid = require('uuid')

//Add team
function createTeam(name, list) {
    
    return new Promise((resolve, reject) => {
        console.log("promising...")
        teamDao.createTeam(uuid.v4(), name, list)
            .then((data) => {
                resolve(data)
            })
            .catch((err) => {
                reject(err)
            })
    })
    
}

function getTeamById(team_id) {
    return new Promise((resolve, reject) => {
        teamDao.getTeamById(team_id)
        .then((data) => {
            resolve(data)
        })
        .catch((err) => {
            
            reject(err)
        })
    })
}

function updateTeamById(team_id, name, pokemonList) {
    return new Promise((resolve, reject) => {
        teamDao.updateTeamById(team_id, name, pokemonList)
        .then((data) => {
            resolve(data)
        }).catch((err) => {
            reject(err)
        })
    })
}

module.exports = {
    createTeam, getTeamById, updateTeamById
}