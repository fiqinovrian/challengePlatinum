const userController = require('../../controllers/userController');
const { User } = require('../../models');

jest.mock('../../models', () => {
    return {
        User: {
            findAll: jest.fn(),
            findByPk: jest.fn(),
            update: jest.fn()
        }
    }
});

const mockRequest = (body = {}, params = {}, query = {}) => {
    return {
        body: body,
        params: params,
        query: query,
    }
};

const mockResponse = () => {
    const res = {};
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);

    return res;
};

describe('Fungsi Show User', () => {
    test('Seluruh user berhasil di fetch', async () => {
        const req = mockRequest();
        const res = mockResponse();

        const users = [{
            name: 'Fiqi Novrian',
            email: 'fiqinovrian@gmail.com',
            gender: 'Male',
            password: 'Password'
        }];

        User.findAll.mockResolvedValueOnce(users);

        await userController.show(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(users);
    })
    
});

describe('Fungsi Get User by Id', () => {
    test('Apabila tidak ada user dengan Id tersebut, return 500 User Tidak Ditemukan', async () => {
        const req = mockRequest();
        const res = mockResponse();

        User.findByPk.mockImplementationOnce(undefined);
        await userController.getById(req, res);

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith('User tidak ditemukan')
    })
    test('Apabila terdapat user di database, return data user', async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.params.id = 1;

        const user = {
            name: 'Fiqi Novrian',
            email: 'fiqinovrian@gmail.com',
            gender: 'Male',
            password: 'Password'
        }

        User.findByPk.mockResolvedValueOnce(user)
        await userController.getById(req, res);

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(user)
    })
})