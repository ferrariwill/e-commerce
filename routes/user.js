const router = require("express").Router();
const User = require("../models/User");
const {verifyToken,verityTokenAndAuthorization} = require("./verifyToken");

///update
router.put("/:id",verityTokenAndAuthorization, async (req,res) => {
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(req.body.password,process.env.PASS_SEC).toString()
    }
    try {
        const updateUser = await User.findByIdAndUpdate(req.params.id,{
            $set: req.body
        },{
            new : true
        });
        res.status(200).json(updateUser);
    } catch (error) {
        res.status(500).json(error);
    }
});

///Delete
router.delete("/:id",verityTokenAndAuthorization,async (req,res) => {

    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("Usuário deletado");
    } catch (error) {
        res.status(500).json(error);
    }

});

///Dados usuario
router.get("/find/:id",verityTokenAndAuthorization,async (req,res) => {

    try {
        const user =  await User.findByIdAndDelete(req.params.id);
        const{password,...others} = user._doc;
        res.status(200).json(others);
    } catch (error) {
        res.status(500).json(error);
    }

});

///Dados todos usuario
router.get("/",verityTokenAndAuthorization,async (req,res) => {
    const query = req.query.new
    try {
        const user = query ? await User.find().sort({_id:-1}).limit(5) : await User.find();
        const{password,...others} = user._doc;
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }

});

///Status Usuario
router.get("/stats",verityTokenAndAuthorization,async (req,res)=>{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    try {
        const data = await User.aggregate([{
                $match:{
                    createdAt:{$gte:lastYear}
                }
            },
            {
                $project:{
                    month:{$month:"$createdAt"}
                }
            },
            {
                $group:{
                    _id:"$month",
                    total:{
                        $sum:1
                    }
                }
            }
        ]);
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router