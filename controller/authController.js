const User = require('../models').User;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = '1a2b3c4d5e';

const register = async function (req, res) {
    const cekEmail = await User.findOne({ where: { email: req.body.email } });
    if(cekEmail === null) {
        const pass = req.body.password;
        if(pass.length < 8) {
            return res.render('register', { message: 'Password At Least 8 Characters' });
        } else {
            const encryptedPassword = bcrypt.hashSync(pass, 10);
            const data = {
                name: req.body.name,
                email: req.body.email,
                gender: req.body.gender,
                password: encryptedPassword
            }
            User.create(data) 
            .then(data => {
                res.render('login')
                // res.status(201).json(data)
            })
            .catch(err => {
                return res.render('register', { message: 'Internal Server Error' });
                // return res.status(500).json('Internal server error');
            })
        }
    } else {
        return res.render('register', { message: 'Email has been already taken' });
        // return res.json('Email has been already taken');
    }
}

const login = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({
        where: { email: email }
    })
    .then((user) => {
        if(!user) {
            // return res.json({ message: 'User not found !' });
            return res.render('login', { message: 'User not found !' });
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if(!isPasswordValid) {
            // return res.json({ message: 'Email / Password is Invalid'});
            return res.render('login', { message: 'Email / Password is Invalid!' });
        }

        const accessToken = jwt.sign({
            id: user.id,
            email: user.email,
        }, secret)
        // res.set('x-token', accessToken);
        // res.redirect('/dashboard');

        // return res.render('dashboard');
        // return res.redirect('/dashboard');
        return res.json({
            id: user.id,
            email: user.email,
            accessToken: accessToken,
        })
    })
}

module.exports = {
    register,
    login,
}