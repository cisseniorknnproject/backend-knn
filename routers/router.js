const express = require('express')
const app = express()
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('./../model/user')
const auth = require('../middleware/auth')

app.use(express.json())

//test
router.get('/', (req, res) => {
    res.json({
        message: 'Hello World!'
    })
})

router.post('/', auth, (req, res) => {
    res.status(200).json({message:"Welcome to My api"})
})

//register
router.post('/api/register', async (req, res) => {
    try {
        const { first_name, last_name, username, email, password } = req.body

        //check input
        if(!(first_name && last_name && username && email && password)) 
        {
            res.status(400).send({message: "All input get required"})
        }

        //check old user
        const old_user = await User.findOne({ email })

        if(old_user)
        {
            return res.status(409).send({message: "User already exists , please Login"})
        }

        let encryptedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            first_name,
            last_name,
            username,
            email: email.toLowerCase(), 
            password : encryptedPassword
        })

        const token = jwt.sign(
            { user_id: user.id, email },
            process.env.TOKEN_KEY,{
                expiresIn: "2h"
            }
        )

        user.token = token
        res.status(201).send(user)

    } catch (error) {
        console.error(error)
    }
})

//login
router.post('/api/login', async (req, res) => {
    try {
        const {email, password} = req.body

        if(!(email && password)){
            res.status(400).send({message: "All input get required"})
        }

        const user = await User.findOne({email})

        if(user && (await bcrypt.compare(password, user.password))){
            const token = jwt.sign(
                { user_id: user.id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h"
                }
            )

            user.token = token

            res.status(200).json(user)
        }

        res.status(400).send("Invalid Cerdentials")
    } catch (error) {
        console.error(error)
    }
})

//products
router.get('api/products', (req, res) =>{

})

//recommend
router.get('/api/recommend', (req, res) => {

})


module.exports = router