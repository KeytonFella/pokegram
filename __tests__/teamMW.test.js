const mw = require('../utility/middleware/teamMW');

test("make sure pokemon names are valid", async () => {
    const response = await mw.validatePokemonNames([
        {pokemonName: "Pikachu", level: 2},
        {pokemonName: "Electrike", level: 5},
        {pokemonName: "Poliwag", level: 3}
    ])
    
    expect(response).toEqual(true)
})