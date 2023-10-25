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
const Cart = require('../model/Cart')
const mongoose = require('mongoose')
const cartProduct = require('./../model/cartProduct')
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
            const info = await UserInfo.find({ userId: req.user.user_id }).exec()
            const [Information] = await info

            const uaddress = await UserAddress.find({}).exec()
            res.status(200).json({ user, Information, uaddress })
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


// add product to cart
router.post('/api/newitems', async (req, res) => {
    try {
        const { userid, ADDRESS, count, PRODUCT } = await req.body
        /**
         * Find cart from user email address --> 
         * If (not found create new one and add product to cart )
         * Else (found in cart)
         *  1. find product in CartProduct from product id --> if found update new Else Add to store
         */
        // generate uerid to ObjectId format
        const formatUserid = new mongoose.Types.ObjectId(userid)
        const cart = await Cart.findOne({ userId: formatUserid })
        if (!cart) {
            console.log(cart, "Not found cart so create new one")
            cart = await Cart.create({ userId: formatUserid })
        }

        /**
       Find product in products collection and find by cartId
       to Finad Cart collect product 
       - not found product in cart add product in cart
       - found save new quantity insted
         * 
         */
        const CID = new mongoose.Types.ObjectId(cart._id)
        const PID = new mongoose.Types.ObjectId(PRODUCT._id)
        const products = await cartProduct.findOne({ CartId: CID, ProductId: PID })
        if (products) {
            const products = await cartProduct.findOneAndUpdate({ CartId: CID }, { quantity: count });
            res.status(200).json({ products })
        } else {
            const NewProducts = await cartProduct.create({ CartId: CID, ProductId: PID, quantity: count });
            res.status(200).json({ NewProducts })
        }

        res.status(404).json({})
    } catch (error) { console.error(error) }
})

// get cartID from user id
router.post('/api/cart/', async (req, res) => {
    const body = await req.body
    const { id } = await body
    const formatId = new mongoose.Types.ObjectId(id)
    const cart = await Cart.find({ userId: formatId }).exec()
    if (cart) {
        const [cartId] = cart
        const product = await cartProduct.find({ CartId: cartId._id }).exec()

        /**
         *  foreach to product and use productId to query and take product data into array before returning
         */
        const productsWithData = []
        async function fetchProductData(productItem) {
            const productData = await Products.findOne({ _id: productItem.ProductId }).exec();
            const quantity = productItem.quantity
            return { productItem, productData: {...productData, quantity} };
        }

        // Iterate over the product array with an asynchronous for...of loop
        for (const productItem of product) {
            const result = await fetchProductData(productItem);
            productsWithData.push(result);
        }
        // Now, productWithData contains the product data for each product in the cart
        // console.log("productWithData:", productsWithData);

        return res.status(200).json(productsWithData);
        if (!product) {
            return res.status(200)
        }
        res.status(200).json({ cart, product })
    }
    else {
        res.status(200).json({})
    }
})
// Put Update product count in cart 
router.put('/api/cart/', async (req, res) => {
    const { uid, productId, quantity, CartId } = await req.body
    const CID = new mongoose.Types.ObjectId(CartId);
    const PID = new mongoose.Types.ObjectId(productId);
    const newCartProduct = await cartProduct.findOneAndUpdate({ cartId: CID, productId: PID }, { quantity: quantity }, { new: true }).exec()

    return res.status(200).json({ newCartProduct })
})
// Delete product count in cart
router.delete('/api/cart/', async (req, res) => {
    const { id, userId } = await req.body
    const cart = await Cart.find({ userId: userId }).exec()
    const [cartId] = await cart

    const CID = cartId._id
    const PID = new mongoose.Types.ObjectId(id)
    const deletedProduct = await cartProduct.findOneAndRemove({ productId: PID, cartId: CID }).exec()

    if (deletedProduct) {
        res.status(200).json({ deletedProduct })
    } else {
        res.status(200).json({})
    }
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