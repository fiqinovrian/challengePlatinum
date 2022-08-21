const authController = require('../../controllers/authController');
const { User } = require('../../models');

jest.mock('../../models', () => {
    return {
        User: {
            create: jest.fn(),
            findOne: jest.fn()
        },
    }
})

const mockRequest = (body = {}, params = {}, query = {}) => {
    return {
        body: body,
        params: params,
        query: query,
    }
}

const mockResponse = () => {
    const res = {};
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);

    return res;
}

describe('Fungsi Register', () => {
    test('Jika email sudah register, return Email Has Been Already Taken', async () => {
        const req = mockRequest();
        const res = mockResponse();

        const mockData = {
            id: 5,
            name: 'kuya2',
            email: 'kuya2@gmail.com',
            gender: 'Female',
            role: 'user',
            is_verified: false,
            token: '5xwqdfa2nva',
            is_expired: false
        }
        User.findOne.mockResolvedValueOnce(mockData);
        await authController.register(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith('Email has been already taken')

    })
})