const moongoose = require('mongoose');

const connectDB = async () => {
    try {
        //mongodb connection string
        const con = await moongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }       
}

module.exports = connectDB;