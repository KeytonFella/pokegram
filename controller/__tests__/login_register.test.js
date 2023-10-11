const { calculateTotal, calculateDiscount } = require('../src/ecommerce');

// Create a mock function for the calculateTotal Function
const mockCalculateTotal = jest.fn();

// mock a sample shopping cart
const sampleCart = [
    {id: 1, name: 'product 1', price: 10},
    {id: 2, name: 'product 2', price: 20},
    {id: 3, name: 'product 3', price: 30},
]

test('calculateDiscount should calculate the correct price', () => {
    // configure the mock funciton to return a fixed value
    mockCalculateTotal.mockReturnValue(100);

    const discount = 0.8;

    // call the calculateDiscount function with the sample cart and the mockCalculateValue
    const discountedPrice = calculateDiscount(mockCalculateTotal, sampleCart, discount);

    // Assert that the omck function was called with the sample cart
    expect(mockCalculateTotal).toHaveBeenCalledWith(sampleCart);

    // assert that the discountedPrice amtches teh expected value
    expect(discountedPrice).toBe(80);
})

afterEach(() => {
    mockCalculateTotal.mockClear();
})

test("returns undefined by default", () => {
    const mock = jest.fn();

    let result = mock("foo");
    
    expect(result).toBeUndefined();
    expect(mock).toHaveBeenCalled();
    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith("foo");
})

test("mock implementation", () => {
    const mock = jest.fn(() => "bar");

    expect(mock("foo")).toBe("bar");
    expect(mock).toHaveBeenCalledWith("foo");
})

test("mock return value", () => {
    const mock = jest.fn();
    mock.mockReturnValue("bar");

    expect(mock("foo")).toBe("bar");
})

test("mock promise resolution", () => {
    const mock = jest.fn();

    mock.mockResolvedValue("bar");

    expect(mock("foo")).resolves.toBe("bar");
})