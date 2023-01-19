const mongoose = require("mongoose");
const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false)
         await mongoose.connect(process.env.MONGO_URI);

        console.log("Connected to DB");
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit();
    }
};

module.exports = connectDB;