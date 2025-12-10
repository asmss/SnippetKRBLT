const User = require("../models/user");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
dotenv = require("dotenv");
dotenv.config();
//kullanıcıyı oluşturuyorum bu satırda 

exports.newUser = async(req,res) =>{
  const{username,email,password} = req.body;
  try {
      const kontrol = await User.findOne({email});
      if(kontrol){
        return res.status(400).json({message:"bu email zaten kayıtlı"});
      }

       const hashedPassword = await bcrypt.hash(password,10);
     const user = await User.create({
        username,
        email,
        password:hashedPassword
     });

      res.status(201).json({message:"kullanıcı başarıyla oluşturuldu",user});

  } catch (error) {
    console.error("kullanıcı oluşturulamadı",error);
    res.status(500).json({message:"kullanıcı oluşturulammadı",error});
  }
}

//kullanıcıyı getirme işlemi 
exports.getUser = async(req,res) =>{
   const {email,password} = req.body;
   try {
     const user = await User.findOne({ email });
     if(!user){
        return res.status(404).json({message:"kullanıcı bulunamadı"})
     }
     const şifreKontrol = await bcrypt.compare(password,user.password);
     if(!şifreKontrol){
        return res.status(401).json({message:"şifre hatalı"});
     }

     const token = jwt.sign(
        {id:user._id},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
     )

     res.status(200).json({message:"giriş başarılı",token,user});
   } catch (error) {
    console.error("kullanıcı bulunurken bir hata oluştu",error);
    res.status(500).json({message:"kullanıcı bulunamadı",error});
   }
 

}