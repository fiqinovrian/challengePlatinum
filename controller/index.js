const user = require('./user');
const product = require('./product');
const order = require('./order');
const auth = require('./authController');
const profile = require('./profileController');
module.exports = {
    user,
    product,
    order,
    auth,
    profile
}; 