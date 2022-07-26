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

const show = (req, res) => {
    Product.findAll().then(products => {
        res.status(200).json(products);
    })
        .catch(err => {
            res.status(500).json(err)
        })
}

const getById = (req, res) => {
    const idProduct = req.params.id;
    return Product.findByPk(idProduct, {
        include: []
    })
        .then((product) => {
            if (!product) {
                return res.status(404).json("Product tidak ditemukan")
            }
            return res.status(200).json(product)
        })
        .catch((err) => {
            res.status(500).json(err)
        })
}

const updateById = (req, res) => {
    Product.update({
        code: req.body.code,
        name: req.body.name,
        price: req.body.price
    }, {
        where: {
            id: req.params.id
        }
    })
        .then(() => {
            res.status(200).json("Produk berhasil di update")
        })
        .catch((err) => {
            res.status(500).json(err);
        })
}

const deleteById = (req, res) => {
    const idProduct = req.params.id;
    Product.destroy({ where: { id: idProduct } })
        .then(() => {
            res.status(200).json("Product berhasil dihapus")
        })
        .catch((err) => {
            res.status(500).json(err)
        })
}

module.exports = {
    create,
    show,
    getById,
    updateById,
    deleteById
}