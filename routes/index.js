const express = require('express');
const router = express.Router();

// const userController = require('../controller').user;
const auth = require('../controller').auth;
const productController = require('../controller').product;
const userController = require('../controller').user;
const orderController = require('../controller').order;
const restrict = require('../middlewares/restrict');
const profile = require('../controller').profile;
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        //file akan diupload ke folder uploads
        //jangan lupa bikin folder uplads supaya uploadnya tidak gagal
        callback(null, './uploads')
    },
    filename: function (req, file, callback) {
        //gunakan nama asli file yang di upload
        callback(null, file.originalname)
    }
});
const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, callback) => {
        if(file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype =='image/jpeg') {
            return callback (null, true);
        } else {
            callback(null, false);
            return callback(new Error('Only .png, .jpg, and .jpeg format allowed !'))
        }
    }
});

router.use(express.urlencoded({ extended: false }));
router.use(express.json());
router.use(function timeLog(req, res, next) {
    console.log(`Time: `, Date.now())
    next()
});

//routing untuk users
router.get('/api/', (req, res) => {
    res.render('index')
});

router.get('/api/user/register', (req, res) => {
    res.render('register')
});

router.get('/api/user/login', (req, res) => {
    res.render('login')
})

router.post('/api/user/register', auth.register);
router.post('/api/user/login', auth.login);
router.get('/api/user/show', restrict, userController.show);
router.get('/api/user/:id', restrict, userController.getById);
router.put('/api/user/:id', restrict, userController.updateById);
router.delete('/api/user/:id', restrict, userController.deleteById);

// router.get('/dashboard', restrict, (req, res) => {
//     res.render('dashboard')
// })
router.get('/api/user/profile', restrict, profile.getProfile);
router.post('/api/user/profile/add', restrict, profile.addProfile);
router.put('/api/user/profile/update', restrict, profile.updateProfile);
router.post('/api/user/profile/avatar/add', restrict, upload.single('avatar'), profile.uploadAvatar);
router.post('/api/user/profile/avatar/addOnline', restrict, upload.single('avatar'), profile.uploadAvatarOnline);

// router product
router.post('/api/product/add', upload.single('image'), productController.create);
router.get('/api/product/show', productController.show);
router.get('/api/product/:id', productController.getById);
router.post('/api/product/:id', productController.updateById);
router.delete('/api/product/:id', productController.deleteById);

//router order
router.post('/api/order/add', restrict, orderController.create);
router.get('/api/orders/show', restrict,  orderController.show);
router.get('/api/order/:id', restrict, orderController.getById);
router.delete('/api/order/:id', restrict, orderController.deleteById);
router.put('/api/order/:id', restrict, orderController.updateById);
router.get('/api/order/user/:id', restrict, orderController.countOrdersByUserId);

module.exports = router;