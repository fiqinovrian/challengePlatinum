const models = require('./models');
const User = models.User;
const Product = models.Product;
const Order = models.Order;

// User.bulkCreate([
//     {name: 'fiqinovrian', email: 'fiqinovrian@gmail.com', gender: 'male'}
// ]).then((newUser) => {
//     console.log(newUser);
// }).catch((err) => {
//     console.log('Error while users creation: ',err)
// })

Product.bulkCreate([
    {
        code: 'KD001',
        name: 'Monitor',
        price: '1000000'
    }, 
    {
        code: 'KD002',
        name: 'Laptop',
        price: '50000000'
    }
]).then((orders) => {
    User.findAll({ where: {id: [1,2,3]}, include: ['items']})
    .then((customers) => {
        customers.forEach(user => {
            user.setOrder(orders)
            .then((joinedUserOrders) => {
                console.log(joinedUserOrders)
            })
            .catch((err) => console.log("error while joining Users and Orders :", err))
        });
    })
    .catch((err) => console.log("Error while Users search : ", err))
})
.catch((err) => console.log("Error while Product creation : ", err))