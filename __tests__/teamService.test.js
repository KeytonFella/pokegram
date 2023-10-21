const service = require('../service/teamService.js')
const dao = require('../repository/teamDAO.js')
const { afterEach } = require('node:test')

jest.mock('../repository/teamDAO.js');

describe('Team Service', () => {
    // afterEach(() => {
    //     jest.clearAllMocks()
    // })
    const uuid = '32423afd-ec3c-4a37-a163-137c99e99173'
    const updateTeam = {teamName: "updatedteam", pokemonList: [
        {pokemonName: "Pikachu", level: 10, nickname: "JohnDoe"},
        {pokemonName: "Vulpix", level: 12},
        {pokemonName: "Oshawott", level: 100},
        {pokemonName: "Wailord", level: 100},
        {pokemonName: "Electabuzz", level: 34},
        {pokemonName: "Arbok", level: 70}],
        user_id: uuid
    }
    const testTeam = {teamName: "team", pokemonList: [
        {pokemonName: "Pikachu", level: 10, nickname: "JohnDoe"},
        {pokemonName: "Vulpix", level: 12},
        {pokemonName: "Oshawott", level: 11},
        {pokemonName: "Wailord", level: 100},
        {pokemonName: "Electabuzz", level: 34},
        {pokemonName: "Arbok", level: 70}],
        user_id: uuid
    }
    it('should validate and create a new team for a user', async() => {
        
        dao.createTeam = jest.fn().mockResolvedValue(testTeam) 
        const result = await service.createTeam(testTeam.teamName, testTeam.pokemonList, uuid)
        expect(result).toEqual(testTeam)
    })

    it('should get team by user id', async() => {
        dao.getTeamByUserId = jest.fn().mockResolvedValue(testTeam)
        const result = await service.getTeamByUserId(uuid)
        expect(result).toEqual(testTeam)
    })

    it('should validate and update a team', async() => {
        dao.updateTeamById = jest.fn().mockResolvedValue(updateTeam)
        const result = await service.updateTeamById(uuid, updateTeam.teamName, updateTeam.pokemonList)
        expect(result).toEqual(updateTeam)
    })
})

