const User = require('../models').User;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = '1a2b3c4d5e';

const register = async function (req, res) {
    const cekEmail = await User.findOne({ where: { email: req.body.email } });
    if (cekEmail) {
        return res.render('register', { message: 'Email has been already taken' });
    }
    
    try {
        const pass = req.body.password;
        if(pass.length < 8) {
            return res.render('register', { message: 'Password At Least 8 Characters' });
        }
        const encryptedPassword = bcrypt.hashSync(pass, 10);
        const data = {
            name: req.body.name,
            email: req.body.email,
            gender: req.body.gender,
            password: encryptedPassword,
            role: req.body.role
          
        }
        User.create(data)
        return res.status(200).json(data);
    } catch(err) {
        return res.render('register', { message: 'Internal Server Error' });
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
                // return res.json({ message: 'Email / Password is Invalid'});
                return res.render('login', { message: 'Email / Password is Invalid!' });
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
            })
        }
        catch (err) {
            return res.status(500).json('Internal Server Error');
        }
    }
    return res.render('login', { message: 'User not found !' });
}

module.exports = {
    register,
    login,
}