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

        User.create.mockResolvedValueOnce(undefined);
        await authController.register(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith('Email has been already taken')

    })
})