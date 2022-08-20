require('dotenv').config();
const Profile = require('../models').Profile;
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const secret = '1a2b3c4d5e';
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.cloud_apikey,
    api_secret: process.env.cloud_apisecret,
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

const uploadAvatarOnline = async (req, res) => {
    const url = await uploadCloudinary(req.file.path);
    if(url) {
        const currentUserId = req.user.id;
        Profile.update(
        {
            avatar: url,
        },
        {
            where: {
                userId: currentUserId
            }
        })
        .then((profile) => {
            Profile.findOne({ where: {userId: currentUserId} })
            .then((data) => {
                return res.status(200).json(data)
            })
            .catch(err => {
                return res.status(500).json(err)
            })
        })
        .catch(err => {
            return res.status(500).json(err)
        })
    } else {
        return res.json({
            message: 'Upload gagal'
        });
    }
}

const uploadAvatar = (req, res) => {
    const currentUserId = req.user.id;
    return res.status(200).json(req.file)
}

const addProfile = (req, res) => {
    const currentUserId = req.user.id;
    Profile.findOne({
        where: { userId: currentUserId }
    })
    .then((profile) => {
        if(!profile) {
            const data = {
                userId: currentUserId,
                deskripsi: req.body.deskripsi,
                avatar: req.body.avatar
            }
            Profile.create(data)
            .then((data) => {
                return res.status(201).json(data)
            })
            .catch(err => {
                return res.status(500).json(err)
            })
        } else {
            return res.status(200).json(profile);
        }
    })
}


const getProfile = (req, res) => {
    //req.user akan diisi oleh passport-jwt setelah membaca token
    const currentUser = req.user;
    Profile.findOne({
        where: { userId: currentUser.id }
    })
    .then((profile) => {
        if(!profile) {
            return res.status(500).json('Belum Isi Profile')
        } else {
            return res.status(200).json(profile)
        }
    })
    .catch((err) => {
        return res.status(500).json('Internal server error')
    });
}

const updateProfile = (req, res) => {
    const currentUserId = req.user.id;
    Profile.update(
        {
            deskripsi: req.body.deskripsi,
            avatar: req.body.avatar,
        }, 
        {
        where: {
            userId: currentUserId
        }
    })
    .then((profile) => {
        if (!profile) {
            return res.status(500).json('Internal server error')
        } else {
            Profile.findOne({
                where: { userId: currentUserId }
            })
            .then((data) => {
                return res.status(200).json(data)
            })
            .catch(err => {
                return res.status(500).json(err);
            })
        }
    })
}

module.exports = {
    getProfile,
    addProfile,
    updateProfile,
    uploadAvatar,
    uploadAvatarOnline,
}