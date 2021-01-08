const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const cors = require('cors')
require('dotenv').config()

// some config

const maxAge = 3 * 24 * 60 * 60;

const create_token = (id) => {
    return jwt.sign({ id }, 'Hack NIT', {
        expiresIn: maxAge
    })
}

const handleError = (err) => {
    // console.log(err.code)
    let errors = { email: '', password: '' };
    if (err.message === 'Invalid password') {
        errors.password = 'Invalid password'
    }
    if (err.message === 'Invalid email') {
        errors.email = 'Invalid email'
    }
    if (err.code === 11000) {
        errors.email = 'Email already exists'
        return errors
    }
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            console.log(properties);
            errors[properties.path] = properties.message;
        });
    }
    return errors
}

// app config

const app = express()

// middleware

app.use(cors())
app.use(express.json())

// db config
const db_URI= process.env.DB
mongoose.connect(db_URI,()=>{
    console.log('db connected')
})

// app listening to port 

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})

// routes

app.get('/', (req, res) => {
    res.send("hello")
})
app.post('/login', async (req,res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password)
        const token = create_token(user._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(201).json({ 
            name: user.name,
            useremail: user.email,
            token 
        })
    } catch (err) {
        // console.log(err.message)
        const errors = handleError(err)
        res.status(400).json({ errors });
    }
})
app.post('/signup',async (req,res) => {
    try {
        const user = await User.create(req.body)
        const token = create_token(user._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(201).json({ 
            name: user.name,
            useremail: user.email,
            token
        })
    } catch (err) {
        const errors = handleError(err)
        res.status(400).json({ errors });
    }
} )
app.post('/login', )
app.post('/login', )