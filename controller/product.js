const Product = require('../models').Product;
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
    cloud_name: 'fn',
    api_key: '183654398839397',
    api_secret: 'tSxOcx4RiI-7NhZDoOymWOgAXwg',
});

const uploadCloudinary = async(filePath) => {
    let result;
    try {
        result = await cloudinary.uploader.upload(filePath, {
            use_filename: true
        });
        //hapus file yang sudah diupload
        fs.unlinkSync(filePath);
        return result.url;
    } catch (err) {
        //hapus file yang gagal diupload
        fs.unlinkSync(filePath);
        return null;
    }
}

const create = async (req, res) => {
    const url = await uploadCloudinary(req.file.path);
    if(url) {
        const data = {
            code: req.body.code,
            name: req.body.name,
            price: req.body.price,
            image: url
        }

        Product.create(data)
            .then(data => {
                res.status(201).json(data)
            })
            .catch(err => {
                res.status(500).json(err)
            })
    } else {
        return res.status(500).json('Upload gagal');
    }
}

const show = async function (req, res) {
    try {
        const showProduct = await Product.findAll();
        return res.status(200).json(showProduct);
    }
    catch(err) {
        return res.status(500).json(err);
    }
}

const getById = async function (req, res) {
    const idProduct = req.params.id;
    try {
        const isProductExist = await Product.findByPk(idProduct, {
            include: []
        })
        if(isProductExist) {
            return res.status(200).json(product)
        }
        return res.status(404).json("Product tidak ditemukan")
    }
    catch(err) {
        return res.status(500).json(err)
    }
}

const updateById = async function (req, res) {
    const idProduct = req.params.id;
    try {
        const isProductExist = await Product.findByPk(idProduct, {
            include: []
        })
        if(isProductExist) {
            const updateProduct = Product.update({
                code: req.body.code,
                name: req.body.name,
                price: req.body.price
            }, {
                where: {
                    id: req.params.id
                }
            })
            if (updateProduct) {
                return res.status(200).json("Produk berhasil di update")
            } else {
                return res.status(500).json("Gagal Update Produk");
            }
        } else {
            return res.status(500).json('Produk tidak ditemukan');
        }
    }
    catch(err) {
        return res.status(500).json('Internal server error');
    }
}

const deleteById = async function (req, res) {
    const idProduct = req.params.id;
    try {
        const isProductExist = await Product.findByPk(idProduct, {
            include: []
        })
        if(isProductExist) {
            const deleteProduct = Product.destroy({ where: { id: idProduct } })
            if(deleteProduct) {
                return res.status(200).json("Product berhasil dihapus")
            } else {
                return res.status(500).json('Gagal delete produk');
            }
        } else {
            return res.status(500).json('Produk tidak di temukan');
        }
    }
    catch(err) {
        return res.status(500).json(err);
    }
}

module.exports = {
    create,
    show,
    getById,
    updateById,
    deleteById
}