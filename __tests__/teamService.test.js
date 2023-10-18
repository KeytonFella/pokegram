const service = require('../service/teamService.js')
const dao = require('../repository/teamDAO.js')

jest.mock('../repository/teamDAO.js');

describe('Create Team', () => {
    it('should validate and create a new team for a user', async() => {
        dao.createTeam.mockResolvedValue(true);
        const result = await service.createTeam("team", [
            {pokemonName: "Pikachu", level: 10, nickname: "JohnDoe"},
            {pokemonName: "Vulpix", level: 12},
            {pokemonName: "Oshawott", level: 11},
            {pokemonName: "Wailord", level: 100},
            {pokemonName: "Electabuzz", level: 34},
            {pokemonName: "Arbok", level: 70}])
    })
})