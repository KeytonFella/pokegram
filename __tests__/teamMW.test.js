const mw = require('../utility/middleware/teamMW');

// jest.mock('../utility/middleware/teamMW', () => {
//     const mw = jest.requireActual('../utility/middleware/teamMW.js')

//     return {
//         __esModule: true,
//         ...mw,
//         default: jest.fn(() => 'mocked mw'),

//     }
// })

mockMW = jest.fn()

describe("Team validation", () => {
    beforeAll(() => {
        mockMW.mockClear()
    })

    const valid = {
        teamName: 'test', pokemonList: [
        {pokemonName: 'Pikachu', level: 3},
        {pokemonName: 'Tentacool', level: 14},
        {pokemonName: 'Swellow', level: 19}]
    }

    
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
        await mw.validateTeam(mockedReq, mockedRes, mockedNext)
        expect(mockedReq.body.valid).toEqual(true)
        expect(mockedNext.mock.calls.length).toBe(1);
        //expect(mockedRes.status).toHaveBeenCalledWith(200)
        //expect(mockedRes.body).toHaveBeenCalledWith(req.body)
    })

    
})