const service = require('../service/teamService.js')
const dao = require('../repository/teamDAO.js')
const mw = require('../utility/middleware/teamMW')

jest.mock('../repository/teamDAO.js');

describe('Create Team Service', () => {
    it('should validate and create a new team for a user', async() => {
        const testTeam = {'teamName': "team", 'pokemonList': [
            {pokemonName: "Pikachu", level: 10, nickname: "JohnDoe"},
            {pokemonName: "Vulpix", level: 12},
            {pokemonName: "Oshawott", level: 11},
            {pokemonName: "Wailord", level: 100},
            {pokemonName: "Electabuzz", level: 34},
            {pokemonName: "Arbok", level: 70}]
        }
        const createTeam = jest.fn().mockResolvedvalue(testTeam) 
        const result = await service.createTeam(testTeam.teamName, testTeam.pokemonList)
        expect(result).toEqual(testTeam)
    })

    it('should handle empty team name', async () => {
        const result = await service.createTeam('', [
            {pokemonName: "Scizor", level: 30}])
        expect(result).toBeNull()
    });

    it('should reject an empty pokemon list', async () => {
        const result = await service.createTeam('newteam', [])
        expect(result).toBeNull()
    })
})
