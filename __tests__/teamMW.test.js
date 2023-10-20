const mw = require('../utility/middleware/teamMW');

jest.mock('mw')

// test("shouldmake sure pokemon names are valid", async () => {
//     const response = await mw.validatePokemonNames([
//         {pokemonName: "Pikachu", level: 2},
//         {pokemonName: "Electrike", level: 5},
//         {pokemonName: "Poliwag", level: 3}
//     ])
    
//     expect(response).toEqual(true)
// })

const mockReq = () => {
    const req = {body: {'teamName': 'test', 'pokemonList': [{'pokemonName': 'Pikahu'}]}}
    return req
}