const user = require('./userController');
const product = require('./productController');
const order = require('./orderController');
const auth = require('./authController');
const profile = require('./profileController');
module.exports = {
    user,
    product,
    order,
    auth,
    profile
}; 