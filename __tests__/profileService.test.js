const profileService = require('../service/profileService');
const profileDAO = require('../repository/profileDAO');

describe('Profile Service Layer', () => {
  it('should return a profile when getProfileById is successful', async () => {
    const profileId = '1';
    const expectedProfile = {
        'profile_id': profileId,
        'bio': 'Test bio',
        'pokemon': ['Pikachu', 'Charmander'],
        'profile_picture': 'test.jpg'
    }

    profileDAO.getProfileById = jest.fn().mockResolvedValue(expectedProfile);

    const result = await profileService.getProfileById(profileId);

    expect(result).toEqual(expectedProfile);
  });

  it('should throw an error when getProfileById fails', async () => {
    const profileId = '3';
    const errorMessage = 'Profile not found';

    profileDAO.getProfileById = jest.fn().mockRejectedValue(new Error(errorMessage));

    await expect(profileService.getProfileById(profileId)).rejects.toThrow(errorMessage);
  });

  // Clear mocks after each test
    afterEach(() => {
        jest.clearAllMocks();
    });
});

