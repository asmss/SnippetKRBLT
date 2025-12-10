const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () =>{
    try {
         await mongoose.connect(process.env.MONGO_URI, {
         });
         console.log("mongoDB bağlantısı sağlandı ++++");
    } catch (error) {
        console.error("mongoDB bağlantısı sağlanamadı ---", error)
    }
}
module.exports = connectDB;