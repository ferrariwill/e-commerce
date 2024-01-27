const jwt = require("jsonwebtoken");

const verifyToken = (req,res,next) => {
    console.log(req.headers);
    const authHeader = req.headers.authorization
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token,process.env.JWT_SEC, (err,user) => {
            if(err){
                res.status(403).json("Token incorreto");
            }else{
                req.user = user;
                next();
            }
        })
    }else{
        return res.status(401).json("Usuário não autenticado");
    }
}

const verityTokenAndAuthorization = (req,res,next) =>{
    verifyToken(req,res,() =>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        }else{
            res.status(403).json("Não autorizado");
        }
    })
}

const verityTokenAndAdmin = (req,res,next) =>{
    verifyToken(req,res,() =>{
        console.log(req.user);
        if(req.user.isAdmin){
            next();
        }else{
            res.status(403).json("Não autorizado");
        }
    })
}


module.exports = {verifyToken,verityTokenAndAuthorization,verityTokenAndAdmin}