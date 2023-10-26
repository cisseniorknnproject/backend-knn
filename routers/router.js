const express = require('express')
const app = express()
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('./../model/user')
const auth = require('../middleware/auth')
const Products = require('./../model/product')
const UserInfo = require('./../model/Information')
const UserAddress = require('./../model/Address')
app.use(express.json())

//test
router.get('/', (req, res) => {
    res.json({
        message: 'Hello World!'
    })
})

router.post('/', auth, async (req, res) => {
    //res.status(200).json({message:"Welcome to My api", userid: req.user.user_id})
    const user = await User.findById(req.user.user_id)
    res.status(200).json({ message: `Welcome! ${user.first_name}`, userinfo: req.user })
})

//register
router.post('/api/register', async (req, res) => {
    try {
        const { first_name, last_name, username, email, password } = req.body

        //check input
        if (!(first_name && last_name && username && email && password)) {
            res.status(400).send({ message: "All input get required" })
        }

        //check old user
        const old_user = await User.findOne({ email })

        if (old_user) {
            return res.status(409).send({ message: "User already exists , please Login" })
        }

        let encryptedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            first_name,
            last_name,
            username,
            email: email.toLowerCase(),
            password: encryptedPassword
        })

        const token = jwt.sign(
            { user_id: user.id, email },
            process.env.TOKEN_KEY, {
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
        const { email, password } = req.body

        if (!(email && password)) {
            res.status(400).send({ message: "All input get required" })
        }

        const user = await User.findOne({ email })

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { user_id: user.id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "1h"
                }
            )

            user.token = token
            console.log(user)
            res.status(200).json(user)
        }

        res.status(400).send("Invalid Cerdentials")
    } catch (error) {
        console.error(error)
    }
})

//user info
router.post('/api/user', auth, async (req, res) => {

    try {
        const user = await User.findById(req.user.user_id)
        if (user) {
            const info = await UserInfo.find({userId : req.user.user_id}).exec()
            const [Information] = await info
            
            const uaddress = await UserAddress.find({}).exec()
            res.status(200).json({user, Information, uaddress})
        }
        
        res.status(200).json({})
    } catch (error) {
        console.error(error)
    }
})

//update user info
router.put('/api/user', auth, async (req, res) => {
    try {
        const { first_name, last_name, username, email, password } = req.body
        const user = await User.findByIdAndUpdate(req.user.user_id, { first_name, last_name, username, email, password }, { new: true })
        res.status(200).json(user)
    } catch (error) {
        console.error(error)
    }
})

//search products
router.post('/api/search', auth, async (req, res) => {
    
})

//products
router.get('/api/products', async (req, res) => {
    try {
        const response = await Products.find({}).exec()

        res.status(200).json(response)
    } catch (error) {
        console.error(error)
    }
})
//one product
router.get('/api/product/:productid', async (req, res) => {
    try {
        const ProductId = await req.params.productid
        const product = await Products.find({ _id: ProductId }).exec()
        if (product) {
            return res.status(200).json(product)
        }
        return res.status(404).json('unknow')
    } catch (error) {

    }
})
//recommend
router.get('/api/recommend', auth, (req, res) => {
    
})


module.exports = router