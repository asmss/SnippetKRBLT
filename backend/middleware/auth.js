const jwt = require("jsonwebtoken");
require("dotenv").config();
module.exports.auth = function(req,res,next){
  const token = req.headers.authorization?.split(" ")[1];

  if(!token){
    return res.status(401).json({message:"yetkisiz erişim token yok"});
  }

  try {
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({message:"yetkisiz erişim token hatalı"});
  }

}