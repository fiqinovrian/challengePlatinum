require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.port;
const { User } = require('./models');
const { Product } = require('./models');
const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`)
    next();
}
const indexRouter = require('./routes/index');
const passport = require('./lib/passport');
const swaggerJson = require('./swagger.json');
const swaggerUi = require('swagger-ui-express');

app.set('view engine', 'ejs');
app.use(logger);
app.use(express.json()) //untuk melakukan parsing app/json
app.use(express.urlencoded({ extended: false })); //untuk parsing x-www-urlencoded
app.use(passport.initialize());
app.use('/', indexRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerJson));

app.listen(port, () => console.log(`CRUD Challenge listening at http://localhost:${port}`));