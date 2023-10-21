const {mw, validateTeam} = require('../utility/middleware/teamMW');

jest.mock('../utility/middleware/teamMW', () => {
    const mw = jest.requireActual('../utility/middleware/teamMW.js')

    return {
        __esModule: true,
        ...mw,
        default: jest.fn(() => 'mocked mw'),

    }
})

describe("Team validation", () => {
    const valid = {
        teamName: 'test', pokemonList: [
        {pokemonName: 'Pikachu', level: 3},
        {pokemonName: 'Tentacool', level: 14},
        {pokemonName: 'Swellow', level: 19}]
    }

    const noname = {teamName: '', pokemonList: [
        {pokemonName: "Pikachu", level: 10, nickname: "JohnDoe"},
        {pokemonName: "Vulpix", level: 12},
        {pokemonName: "Oshawott", level: 11},
        {pokemonName: "Wailord", level: 100},
        {pokemonName: "Electabuzz", level: 34},
        {pokemonName: "Arbok", level: 70}
    ]}
    const mockReq = (body) => {
        return {
            body: body
            
        }
    }

    const mockRes = () => {
        const res = {};
    
        
        res.body = jest.fn().mockReturnValue(res)
        return res;
    }

    it('should return true for a valid team', async() => {
        const mockedNext = jest.fn();
        const mockedReq = mockReq(valid);
        const mockedRes = mockRes()
        //const expectedRes = {statusCode: 200, message: 'Team submitted: [object Object]'}
        await validateTeam(mockedReq, mockedRes, mockedNext)
        expect(mockedReq.body.valid).toEqual(true)
        expect(mockedNext.mock.calls.length).toBe(1);
        //expect(mockedRes.status).toHaveBeenCalledWith(200)
        //expect(mockedRes.body).toHaveBeenCalledWith(req.body)
    })

    it('should return false for an empty team name', async() => {
        const mockedNext = jest.fn();
        const mockedReq = mockReq(noname);
        const mockedRes = mockRes()
        //const expectedRes = {statusCode: 200, message: 'Team submitted: [object Object]'}
        await mw.validateTeam(mockedReq, mockedRes, mockedNext)
        expect(mockedReq.body.valid).toEqual(false)
        // expect(mockedRes.status).toHaveBeenCalledWith(400)
        // expect(mockedRes.body).toHaveBeenCalledWith({message: "Error: Team is missing a name"})
        
        expect(mockedNext.mock.calls.length).toBe(1);
    })
})