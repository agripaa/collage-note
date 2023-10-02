const express = require('express');
const cors = require('cors');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize');
const db = require('./Config/database.js');
require('dotenv').config();
const bp = require('body-parser')
const Users = require('./Routes/users.route.js');
const Auth = require('./Routes/auth.route.js');

const app = express();

app.use(express.json());
app.use(bp.urlencoded({ extended: true }))
app.use(bp.json())

const corsOptions = {
    withCredentials: true,
    origin: 'https://localhost:3000'
}

const sessionStore = SequelizeStore(session.Store)
const store = new sessionStore({db});

(async () => {db.sync()})();

app.use(session({
    secret: process.env.SESSION_CODE,
    resave: true,
    saveUninitialized: true,
    store,
    cookie: {
        secure: true,
    },    
    proxy: true,
}));

app.use(cors(corsOptions));

app.get('/', async (req, res) => {
    res.status(200).json({status: 200, msgStatus: 'Success', message: 'Server has been activated'});
});

app.use(Auth);
app.use(Users);

app.listen(process.env.PORT_LOCAL_SERVER, () => {
    console.log(`listening on port http://localhost:${process.env.PORT_LOCAL_SERVER}`);
});

module.exports = app;