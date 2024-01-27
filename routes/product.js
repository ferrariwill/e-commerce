const router = require("express").Router();
const Product = require("../models/Product");
const {verifyToken,verityTokenAndAuthorization,verityTokenAndAdmin} = require("./verifyToken");

///Create
router.post("/",verityTokenAndAdmin,async (req,res) => {
    const newProduct = new Product(req.body);

    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (error) {
        res.status(500).json(error);
    }

});

///update
router.put("/:id",verityTokenAndAdmin, async (req,res) => {
    try {
        const updateProduct = await Product.findByIdAndUpdate(req.params.id,
            {
                $set: req.body
            },{
                new : true
            });
        res.status(200).json(updateProduct);
    } catch (error) {
        res.status(500).json(error);
    }
});

///Delete
router.delete("/:id",verityTokenAndAdmin,async (req,res) => {

    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Produto deletado");
    } catch (error) {
        res.status(500).json(error);
    }

});

///pesquisa produto por id
router.get("/find/:id",async (req,res) => {

    try {
        const product =  await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json(error);
    }

});

///Todos Produtos
router.get("/",async (req,res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;

    try {
        let products;
        if(qNew){
            products = await Product.find().sort({createdAt: -1}).limit(5);
        }else if (qCategory){
            products = await Product.find({
                categories:{
                    $in:[qCategory],
                },
            });
        }else{
            products = await Product.find();
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json(error);
    }

});


module.exports = router