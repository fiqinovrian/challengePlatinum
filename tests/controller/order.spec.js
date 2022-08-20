const orderController = require('../../controllers/orderController');
const { Order } = require('../../models');
const { Product } = require('../../models');

jest.mock('../../models', () => {
    return {
        Order: {
            create: jest.fn(),
            findAll: jest.fn(),
            findByPk: jest.fn(),
            deleteById: jest.fn(),
            updateById: jest.fn()
        },
        Product: {
            findByPk: jest.fn()
        }
    }
});

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

describe('Fungsi Show Orders', () => {
    test('Apabila data order kosong, maka return 500 Tidak ada data order', async () => {
        const req = mockRequest();
        const res = mockResponse();

        Order.findAll.mockResolvedValueOnce(undefined);
        await orderController.show(req, res);

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith('Tidak ada data order')
    })

    test('Seluruh orders berhasil di fetch', async () => {
        const req = mockRequest();
        const res = mockResponse();
        const ordersData = [{
            userId: 1,
            productId: 1,
            qty: 1,
            priceTotal: 20000,
            status: 'Pending',
            emailUser: 'fiqinovrian@gmail.com'
        }]

        Order.findAll.mockResolvedValueOnce(ordersData);
        await orderController.show(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(ordersData)
    })

    test('Jika terdapat error, maka return internal server error', async () => {
        const req = mockRequest();
        const res = mockResponse();

        Order.findAll.mockImplementationOnce(() => {
            throw new Error();
        });

        await orderController.show(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith('Internal Server Error')
    })
})

describe('Fungsi Get By Id', () => {
    test('Apabila tidak ada order dengan Id tersebut, return 500 Order Tidak Ditemukan', async () => {
        const req = mockRequest();
        const res = mockResponse();

        Order.findByPk.mockImplementationOnce(undefined);
        await orderController.getById(req, res);

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith('Order tidak ditemukan')
    })

    test('Order user berhasil di fetch', async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.params.id = 1;

        const orderData = {
            userId: 1,
            productId: 1,
            qty: 1,
            priceTotal: 20000,
            status: 'Pending',
            emailUser: 'fiqinovrian@gmail.com'
        }

        Order.findByPk.mockResolvedValueOnce(orderData)
        await orderController.getById(req, res);

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(orderData)
    })

    test('Jika terdapat error, maka return internal server error', async () => {
        const req = mockRequest();
        const res = mockResponse();

        Order.findByPk.mockImplementationOnce(() => {
            throw new Error();
        });

        await orderController.getById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith('Internal Server Error')
    })
})