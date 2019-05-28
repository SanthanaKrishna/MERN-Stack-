const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI'); //GET VALUE IN ANY JSNON FILE=> from // npm config

const connectDB = async () => {
  try {
    await mongoose.connect(db, { useNewUrlParser: true, useCreateIndex:true });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    //Exit Process
    process.exit(1);
  }
};

module.exports = connectDB;
