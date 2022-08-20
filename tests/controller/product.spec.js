const productController = require('../../controllers/productController');
const { Product } = require('../../models');

jest.mock('../../models', () => {
    return {
        Product: {
            create: jest.fn(),
            findAll: jest.fn(),
            findByPk: jest.fn(),
            deleteById: jest.fn()
        }
    }
});
jest.mock('fs');
jest.mock('cloudinary');

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

describe('Fungsi Show Product', () => {
    test('Seluruh Product berhasil di fetch', async () => {
        const req = mockRequest();
        const res = mockResponse();

        const products = [{
            code: 'B001',
            name: 'Produk 1',
            price: 20000,
            image: 'url image'
        }];

        Product.findAll.mockResolvedValueOnce(products);
        await productController.show(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(products);
    })

    test('Apabila Gagal Fetch data produk', async () => {
        const req = mockRequest();
        const res = mockResponse();

        Product.findAll.mockImplementationOnce(() => {
            throw new Error();
        })

        await productController.show(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith('Internal Server Error');
    })
})

describe('Fungsi Get Product By ID', () => {
    test('Apabila produk yang dicari terdapat di database', async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.params.id = 1;

        const product = {
            code: 'Kode Barang',
            name: 'Barang 1',
            price: 200000,
            image: 'Url Image'
        }

        Product.findByPk.mockResolvedValueOnce(product)
        await productController.getById(req, res);

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(product)
    })

    test('Apabila produk yang dicari tidak terdapat di database', async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.params.id = 1;

        Product.findByPk.mockResolvedValueOnce(undefined);
        await productController.getById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith('Product tidak ditemukan');
    })
})

describe('Fungsi Delete By id', () => {
    test('Apabila barang tidak ditemukan , return Produk tidak di temukan', async () => {
        const req = mockRequest();
        const res = mockResponse();

        Product.deleteById.mockImplementationOnce(undefined)
        await productController.deleteById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith('Produk tidak di temukan');
    })

    // test('Apabila barang ditemukan, return Produk berhasil dihapus', async () => {
    //     const req = mockRequest();
    //     const res = mockResponse();
    //     req.params.id = 1;
    //     const product = {
    //         code: 'Kode Barang',
    //         name: 'Barang 1',
    //         price: 200000,
    //         image: 'Url Image'
    //     }

    //     Product.deleteById.mockResolvedValueOnce(product)
    //     await productController.deleteById(req, res);

    //     expect(res.status).toHaveBeenCalledWith(200)
    //     expect(res.json).toHaveBeenCalledWith('Produk berhasil di hapus')
    // })
})