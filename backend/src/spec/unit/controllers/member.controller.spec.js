const memberService = require('../../../services/member.service');

jest.mock('../../../services/member.service');

const {
  createMember,
  getAllMembers,
  getMemberById,
} = require('../../../controllers/member.controller');

describe('member controller', () => {
  describe('createMember', () => {
    const mockRequest = {
      firstName: 'John',
      lastName: 'Smith',
      email: 'js@example.com',
      telephone: '1234567890',
      address: '12 example address',
      gender: 'M',
      joinDate: '2023-12-01T00:00:00.000Z',
      renewalDate: '2024-12-01T00:00:00.000Z',
      emergencyContact: {
        firstName: 'Jane',
        lastName: 'Smith',
        telephone: '1234123412',
        relationship: 'Partner',
      },
    };

    const mockCreatedMember = {
      id: 1,
      firstName: 'John',
      lastName: 'Smith',
      email: 'js@example.com',
      telephone: '1234567890',
      address: '12 example address',
      gender: 'M',
      joinDate: '2023-12-01T00:00:00.000Z',
      renewalDate: '2024-12-01T00:00:00.000Z',
      createdEmergencyContact: {
        id: 1,
        firstName: 'Jane',
        lastName: 'Smith',
        telephone: '1234123412',
        relationship: 'Partner',
        member_id: 1,
      },
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return 200 status code and created member', async () => {
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };

      memberService.create = jest.fn().mockResolvedValue(mockCreatedMember);

      await createMember(mockRequest, mockResponse);

      expect(memberService.create).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCreatedMember);
      expect(mockResponse.send).not.toHaveBeenCalled();
    });

    it('should return 400 status code and error message', async () => {
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };
      const mockError = new Error('Email must be unique');

      memberService.create = jest.fn().mockRejectedValue(mockError);

      await createMember(mockRequest, mockResponse);

      expect(memberService.create).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith({
        message: `${mockError}`,
      });
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe('getAllMembers', () => {
    it('should return 200 status code and member list', async () => {
      const mockMembers = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
      ];

      memberService.getAll = jest.fn().mockResolvedValue(mockMembers);

      const mockRequest = {};
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getAllMembers(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockMembers);
    });

    it('should return 400 status code and handle errors', async () => {
      const mockError = new Error('An unknown error occurred.');

      memberService.getAll.mockRejectedValue(mockError);

      const mockRequest = {};
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await getAllMembers(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith({
        message: `An unknown error occurred. ${mockError}`,
      });
    });
  });

  describe('getMemberById', () => {
    it('should return member by id', async () => {
      const mockMember = { id: 1, name: 'John Smith' };
      memberService.getById.mockResolvedValue(mockMember);

      const mockRequest = { params: { id: 1 } };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getMemberById(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockMember);
    });

    it('should return 400 status code and handle errors', async () => {
      const mockError = new Error('Unknown error occurred');
      memberService.getById.mockRejectedValue(mockError);

      const mockRequest = { params: { id: 1 } };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await getMemberById(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalled();
    });
  });
});