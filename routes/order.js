const router = require("express").Router();
const Order = require("../models/Order");
const {verifyToken,verityTokenAndAuthorization,verityTokenAndAdmin} = require("./verifyToken");

///Create
router.post("/",verifyToken,async (req,res) => {
    const newOrder = new Order(req.body);

    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (error) {
        res.status(500).json(error);
    }

});

///update
router.put("/:id",verityTokenAndAdmin, async (req,res) => {
    try {
        const updateOrder = await Order.findByIdAndUpdate(req.params.id,
            {
                $set: req.body
            },{
                new : true
            });
        res.status(200).json(updateOrder);
    } catch (error) {
        res.status(500).json(error);
    }
});

///Delete
router.delete("/:id",verityTokenAndAdmin,async (req,res) => {

    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Ordem deletado");
    } catch (error) {
        res.status(500).json(error);
    }

});

///Get user cart
router.get("/find/:userId",verityTokenAndAuthorization,async (req,res) => {
    try {
        const order = await Order.find({
            userId: req.params.userId
        });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get("/",verityTokenAndAdmin,async (req,res) =>{
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(error);
    }
})

router.get("/income",verityTokenAndAdmin,async (req,res) =>{
    try {
        const date = new Date();
        const lastMonth = new Date(date.setMonth(date.getMonth - 1));
        const previousMonth = new Date(date.setMonth(lastMonth.getMonth - 1));

        const income = await Order.aggregate([
            {
                $match:{ 
                    createdAt:{
                        $gte: previousMonth
                    }
                }
            },
            {
                $project:{
                    month:{
                        $month:"$createdAt"
                    },
                    sales:"$amount",
                }
            },
            {
                $group:{
                    _id:"$month",
                    total:{
                        $sum:"$sales"
                    }
                }
            },
        ]);
        res.status(200).json(income);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router