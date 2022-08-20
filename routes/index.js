const express = require('express');
const router = express.Router();

// const userController = require('../controller').user;
const auth = require('../controllers').auth;
const productController = require('../controllers').product;
const userController = require('../controllers').user;
const orderController = require('../controllers').order;
const restrict = require('../middlewares/restrict');
const profile = require('../controllers').profile;
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
    console.log('Time: ', Date.now())
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
router.get('/api/user/show', restrict(['admin']), userController.show);
router.get('/api/user/:id', restrict(['user','admin']), userController.getById);
router.put('/api/user/:id', restrict(['user','admin']), userController.updateById);
router.delete('/api/user/:id', restrict(['admin']), userController.deleteById);
router.get('/api/user/verify/:token',  auth.verification);

// router.get('/dashboard', restrict, (req, res) => {
//     res.render('dashboard')
// })
router.get('/api/user/profile', restrict(['user','admin']), profile.getProfile);
router.post('/api/user/profile/add', restrict(['user','admin']), profile.addProfile);
router.put('/api/user/profile/update', restrict(['user','admin']), profile.updateProfile);
router.post('/api/user/profile/avatar/add', restrict(['user','admin']), upload.single('avatar'), profile.uploadAvatar);
router.post('/api/user/profile/avatar/addOnline', restrict(['user','admin']), upload.single('avatar'), profile.uploadAvatarOnline);

// router product
router.post('/api/product/add', restrict(['admin']), upload.single('image'), productController.create);
router.get('/api/product/show', restrict(['user','admin']), productController.show);
router.get('/api/product/:id', restrict(['user','admin']), productController.getById);
router.put('/api/product/:id', restrict(['admin']), productController.updateById);
router.delete('/api/product/:id', restrict(['admin']), productController.deleteById);

//router order
router.post('/api/order/add', restrict(['user','admin']), orderController.create);
router.get('/api/orders/show', restrict(['user','admin']),  orderController.show);
router.get('/api/order/:id', restrict(['user','admin']), orderController.getById);
router.delete('/api/order/:id', restrict(['user','admin']), orderController.deleteById);
router.put('/api/order/:id', restrict(['user','admin']), orderController.updateById);
router.get('/api/order/user/:id', restrict(['admin']), orderController.countOrdersByUserId);

module.exports = router;