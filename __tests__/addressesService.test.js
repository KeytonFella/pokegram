const addressService = require('../service/addressesService');

describe('Address Service helper functions', () => {
    test('should format an address object', () => {
        //Arrange
        const address = {
            street_number: '1234',
            street_name: 'Main St',
            city: 'San Diego',
            state: 'CA',
            zip: '92101'
        };
        // Act
        const result = addressService.formatAddress(address);
        // Assert
        expect(result).toBe('1234%20Main%20St%20San%20Diego%20CA%2092101');
    });
    test('should return the distance between two coordinates in miles', () => {
        // Arrange
        const origin = {lat: 32.7157, lng: -117.1611};
        const destination = {lat: 32.7157, lng: -117.1611};
        // Act
        const result = addressService.calculateDistance(origin, destination);
        // Assert
        expect(result).toBe(0);
    });
});

describe('address service negative tests', () => {
    test('should return null for an invalid address', () => {
        // Arrange
        const address = {};
        // Act
        const result = addressService.formatAddress(address);
        // Assert
        expect(result).toBeNull();
    });
    test('should return null for an invalid address (only one attribute provided)', () => {
        // Arrange
        const address = {street_number: '1234'};
        // Act
        const result = addressService.formatAddress(address);
        // Assert
        expect(result).toBeNull();
    });
    test('calculate distance should return for invalid parameters', () => {
        // Arrange
        const origin = {lat: 32.7157, lng: -117.1611};
        const destination = {};
        // Act
        const result = addressService.calculateDistance(origin, destination);
        // Assert
        expect(result).toBeNull();
    });
});
