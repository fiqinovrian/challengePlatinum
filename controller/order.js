const Order = require('../models').Order;

const create = (req, res) => {
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

const show = (req, res) => {
    Order.findAll()
        .then(Orders => {
            res.status(200).json(Orders);
        })
        .catch(err => {
            res.status(500).json(err)
        })
}

const getById = (req, res) => {
    const idOrder = req.params.id;
    return Order.findByPk(idOrder, {
            include: []
        })
        .then((order) => {
            if (!order) {
                return res.status(404).json("Order tidak ditemukan")
            }
            return res.status(200).json(order)
        })
        .catch((err) => {
            res.status(500).json(err)
        })
}

const updateById = (req, res) => {
    Order.update({
            userId: req.body.userId,
            productId: req.body.productId,
            qty: req.body.qty,
            priceTotal: req.body.priceTotal
        }, {
            where: {
                id: req.params.id
            }
        })
        .then(() => {
            res.status(200).json("Order berhasil di update")
        })
        .catch((err) => {
            res.status(500).json(err);
        })
}

const deleteById = (req, res) => {
    const idOrder = req.params.id;
    Order.destroy({
            where: {
                id: idOrder
            }
        })
        .then(() => {
            res.status(200).json("Order berhasil dihapus")
        })
        .catch((err) => {
            res.status(500).json(err)
        })
}

const countOrdersByUserId = (req, res) => {
    const hitung = Order.count({
            where: {
                userId: req.params.id
            }
        })
        .then((hitung) => {
            res.status(200).json(hitung)
        })
}

module.exports = {
    create,
    show,
    getById,
    updateById,
    deleteById,
    countOrdersByUserId
}