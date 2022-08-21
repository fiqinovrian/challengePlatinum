require('dotenv').config();
const { Order } = require('../models');
const transporter = require('../helpers/transporter');

const create = async (req, res) => {
    try {
        const data = {
            userId: req.body.userId,
            productId: req.body.productId,
            qty: req.body.qty,
            priceTotal: req.body.priceTotal,
            status: req.body.status
        }
        Order.create(data)
            .then(data => {
                res.status(201).json(data)
            })
            .catch(err => {
                res.status(500).json(err)
            })
    }
    catch(err) {
        return res.status(500).json(err)
    }
}

const show = async (req, res) => {
    try {
        const showOrder = await Order.findAll();
        if (showOrder === undefined) { 
            return res.status(500).json('Tidak ada data order');
        }    
        return res.status(200).json(showOrder);
    }
    catch (err) {
        return res.status(500).json('Internal Server Error');
    }
}

const getById = async (req, res) => {
    const idOrder = req.params.id;
    try {
        const orderUser = await Order.findByPk(idOrder, {
            include: []
        })
        if(orderUser != null) {
            return res.status(200).json(orderUser);
        }
        return res.status(500).json('Order tidak ditemukan');
    }
    catch(err) {
        return res.status(500).json('Internal Server Error');
    }
}

const updateById = async (req, res) => {
    const orderId = req.params.id;
    try {
        const orderUser = await Order.findByPk(orderId, {
            include: []
        })
        if(orderUser != null) {
            const updateOrder = Order.update({
                userId: req.body.userId,
                productId: req.body.productId,
                qty: req.body.qty,
                priceTotal: req.body.priceTotal
            }, {
                where: {
                    id: req.params.id
                }
            })
            return res.status(200).json('Order berhasil di update');
        }
        return res.status(500).json('Order tidak ditemukan');
    }
    catch(err) {
        return res.status(500).json('Internal Server Error');
    }
}

const deleteById = async (req, res) => {
    const idOrder = req.params.id;
    try {
        const orderUser = await Order.findByPk(idOrder, {
            include: []
        })
        if (orderUser != null) {
            const deleteOrder = Order.destroy({
                where: {
                    id: idOrder
                }
            })
            return res.status(200).json('Order berhasil di delete');
        }
        return res.status(500).json('Order tidak ditemukan');
    }
    catch(err) {
        return res.status(500).json('Internal Server Error');
    }
}

const countOrdersByUserId = async (req, res) => {
    const idUser = req.params.id;
    try {
        const hitung = await Order.count({
            where: {
                userId: idUser
            }
        })
        if(hitung != null) {
            return res.status(200).json(hitung)
        }
        return res.status(200).json('Belum ada order')
    }
    catch(err) {
        return res.status(500).json('Internal Server Error');
    }
}

module.exports = {
    create,
    show,
    getById,
    updateById,
    deleteById,
    countOrdersByUserId
}