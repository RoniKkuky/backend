import express from 'express';
import cors from 'cors';
import './sqlConnect';
import { signup } from './services/signup';
import { getLoginStatus, login, logout } from './services/login';
import { getcustomer, getcustomers, newCustomer, removeCustomer, updateCustomer } from './services/customers';
import { getcontact, getcontacts, newContact, removeContact, updateContact } from './services/contacts';

const session = require('express-session');

const app = express();

app.use(session({
    secret: 'my-secret',
    name: 'mySession',
    resave: false,
    saveUninitialized: false,
}));

app.use(cors({
    origin: true,
    methods: 'GET,PUT,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept',
}));

app.use(express.json());



app.listen(3000, () => {
    console.log('listening on 3000');
});

app.get('/', (req, res) => {
    res.send("Hello World");
});

app.get('/users/:userId', (req, res) => {
    res.send({
        params: req.params,
        query: req.query,
    });
});


function authGurd(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

app.get('/login', getLoginStatus);
app.get('/logout', logout);
app.post('/signup', signup);
app.post('/login', login);

app.get('/customers', authGurd, getcustomers);
app.get('/customer/:id', authGurd, getcustomer);
app.put('/customer/:id', authGurd, updateCustomer);
app.post('/customers', authGurd, newCustomer);
app.delete('/customer/:id', authGurd, removeCustomer);


app.get('/contacts', authGurd, getcontacts);
app.get('/contact/:id', authGurd, getcontact);
app.put('/contact/:id', authGurd, updateContact);
app.post('/contacts', authGurd, newContact);
app.delete('/contact/:id', authGurd, removeContact);