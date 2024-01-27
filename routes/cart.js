const router = require("express").Router();
const Cart = require("../models/Cart");
const {verifyToken,verityTokenAndAuthorization,verityTokenAndAdmin} = require("./verifyToken");
///Create
router.post("/",verifyToken,async (req,res) => {
    const newCart = new Cart(req.body);

    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    } catch (error) {
        res.status(500).json(error);
    }

});

///update
router.put("/:id",verityTokenAndAuthorization, async (req,res) => {
    try {
        const updateCart = await Cart.findByIdAndUpdate(req.params.id,
            {
                $set: req.body
            },{
                new : true
            });
        res.status(200).json(updateCart);
    } catch (error) {
        res.status(500).json(error);
    }
});

///Delete
router.delete("/:id",verityTokenAndAuthorization,async (req,res) => {

    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Carrinho deletado");
    } catch (error) {
        res.status(500).json(error);
    }

});

///Get user cart
router.get("/find/:userId",verityTokenAndAuthorization,async (req,res) => {
    try {
        const cart = await Cart.findOne({
            userId: req.params.userId
        });
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get("/",verityTokenAndAdmin,async (req,res) =>{
    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router