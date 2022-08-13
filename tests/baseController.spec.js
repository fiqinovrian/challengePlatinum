const baseController = require('../controller/baseController');
const userController = require('../controller/user');

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

describe('Base controller hello function', () => {
    test('res.json called with { status: true, message: "Hello World" }', (done) => {
        const req = mockRequest();
        const res = mockResponse();

        baseController.hello(req, res);

        expect(res.status).toBeCalledWith(200);
        expect(res.json).toBeCalledWith({ status: true, message: "Hello World" });
        done();
    })
});

describe('User controller show function', () => {
    test('res.json return list of user', (done) => {
        const req = mockRequest();
        const res = mockResponse();

        userController.show(req, res);

        expect(res.status).toBeCalledWith(200);
        expect(res.json).toBeCalledWith(users);
        done();
    })
})