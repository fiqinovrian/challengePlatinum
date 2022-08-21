const User = require('../models').User;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = '1a2b3c4d5e';
const transporter = require('../helpers/transporter');

const register = async function (req, res) {
    const cekEmail = await User.findOne({ where: { email: req.body.email } });
    if (cekEmail) {
        return res.status(200).json('Email has been already taken');
    }
    
    try {
        const pass = req.body.password;
        if(pass.length < 8) {
            return res.render('register', { message: 'Password At Least 8 Characters' });
        }
        const encryptedPassword = bcrypt.hashSync(pass, 10);
        const token = Math.random().toString(36).substr(2);
        const data = {
            name: req.body.name,
            email: req.body.email,
            gender: req.body.gender,
            password: encryptedPassword,
            token: token,
            role: req.body.role,
            is_verified: false,
            is_expired: false,
        }
        User.create(data)
        const email = req.body.email;
        const mail = {
            from: 'storyfootball17@gmail.com',
            to: email,
            subject: 'Verifikasi',
            text: `Link verifikasi:  <a href='http://localhost:3000/api/user/verify/${token}'>Klik Disini</a>`,
        }

        transporter.sendMail(mail, (err, info) => {
            if (err) {
                console.log(err);
            }
        })
        return res.status(200).json('Email Verifikasi Telah Dikirimkan');
    } catch(err) {
        return res.status(500).json('Internal Server Error')
    }
}

const login = async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const isUserExist = await User.findOne({ where: { email: email }})
    if(isUserExist) {
        try {
            const isPasswordValid = bcrypt.compareSync(password, isUserExist.password);
            if (!isPasswordValid) {
                return res.json({ message: 'Email / Password is Invalid'});
            }
            const accessToken = jwt.sign({
                id: isUserExist.id,
                email: isUserExist.email,
                role: isUserExist.role
            }, secret, { expiresIn: '10h' })
            return res.json({
                id: isUserExist.id,
                email: isUserExist.email,
                accessToken: accessToken,
                role: isUserExist.role
            })
        }
        catch (err) {
            return res.status(500).json('Internal Server Error');
        }
    }
    return res.render('login', { message: 'User not found !' });
}

const verification = async function (req, res) {
    try {
        //ambil token dari url
        const token = req.params.token;
        //cek token
        const userByToken = await User.findOne({ where: { token: token } });
        if (userByToken) {
            const validasiToken = userByToken.is_expired;
            console.log(userByToken)
            if (validasiToken) {
                return res.status(500).json('Token sudah expired');
            }
            User.update(
                { is_verified: true, is_expired: true },
                { where: { token: token } }
            )
            return res.status(200).json('User berhasil di verifikasi');
        }
        return res.status(500).json('Token Tidak Valid');
    } catch (err) {
        return res.status(500).json('Internal server error');
    }
}

module.exports = {
    register,
    login,
    verification
}