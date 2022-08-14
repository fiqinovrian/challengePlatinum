require('dotenv').config();
const express = require('express');
const socketio = require('socket.io');
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

const server = app.listen(3000, ()  => {
    console.log('server running at port 3000')
})

const io = socketio(server);

io.on('connection', (socket) => {
    console.log('a user connected')

    socket.on('chat message', (msg) => {
        io.emit('new chat', msg)

})
socket.on('disconnected', () => {
    console.log('user disconnected')
})
})

app.set('view engine', 'ejs');
app.use(logger);
app.use(express.json()) //untuk melakukan parsing app/json
app.use(express.urlencoded({ extended: false })); //untuk parsing x-www-urlencoded
app.use(passport.initialize());
app.use('/', indexRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerJson));
