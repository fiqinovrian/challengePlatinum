const User = require('../models').User;
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

const create = async function (req, res) {
    const cekEmail = await User.findOne({ where: { email: req.body.email } });
    if (cekEmail === null) {
        const pass = req.body.password;
        if(pass.length < 8) {
            return res.json('Password at least 8 character');
        } else {
            const data = {
                name: req.body.name,
                email: req.body.email,
                gender: req.body.gender,
                password: req.body.password
            }
            User.create(data)
                .then(data => {
                    res.status(201).json(data)
                })
                .catch(err => {
                    res.status(500).json(err)
                })
        }
    } else {
        return res.json('Email has been already taken');
    }
}
const show = (req, res) => {
    User.findAll().then(users => {
        res.status(200).json(users);
    })
    .catch(err => {
        res.status(500).json(err)
    })
}

const getById = async (req, res) => {
    const idUser = req.params.id;
    try {
        const user = await User.findByPk(idUser, {
            include: []
        })
        if(user != null) {
            return res.status(200).json(user)
        }
        return res.status(500).json('User tidak ditemukan');
    }
    catch (err) {
        return res.status(500).json('Internal Server Error');
    }
}

const updateById = async (req, res) => {
    //ambil user dengan id yang diminta, kemudian cek nih, kalo dy update dengan email yang sama, maka jalankan updatenya
    //kalo email yang dia inputkan itu beda, cek dlu email di database udah ada belum, kalo belum jalankan updatenya

    const userId = req.params.id;
    try {
        const isUserExist =  await User.findByPk(userId);
        if(isUserExist != null) {
            const inputEmail = req.body.email;
            const emailUser = isUserExist.email;
            if(inputEmail === emailUser) {
                const pass = req.body.password;
                if(pass.length < 8) {
                    return res.status(500).json('Password At Least 8 Character');
                }
                const encryptedPassword = bcrypt.hashSync(pass, 10);
                const updateUser = User.update({
                    name: req.body.name,                    
                    email: req.body.email,
                    gender: req.body.gender,
                    role: req.body.role,
                    password: encryptedPassword
                }, {
                    where: {
                        id: req.params.id
                    }
                });
                return res.status(200).json('User berhasil di update');
            } else {
                const emailCheck =  User.findOne({ where: { id: { [Op.not]: userId }, email: req.body.email } });
                if (emailCheck != null) {
                    return res.status(500).json('Email has been already taken');
                }
                const pass = req.body.password;
                if (pass.length < 8) {
                    return res.status(500).json('Password At Least 8 Character');
                }
                const encryptedPassword = bcrypt.hashSync(pass, 10);
                const updateUser = User.update({
                    name: req.body.name,
                    email: req.body.email,
                    gender: req.body.gender,
                    role: req.body.role,
                    password: encryptedPassword
                }, {
                    where: {
                        id: req.params.id
                    }
                });
                return res.status(200).json(updateUser);
            }
        }
        return res.status(500).json('User dengan Id tersebut tidak ditemukan')
    }
    catch(err) {
        return res.status(500).json(err);
    }
}

const deleteById = (req, res) => {
    const idUser = req.params.id;
    User.destroy({ where: { id: idUser } })
    .then(() => {
        res.status(200).json('User berhasil dihapus')
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