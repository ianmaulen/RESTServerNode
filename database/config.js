const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB correctly');


  } catch (err) {
    throw new Error ('Error connecting to database: ' + err);
  }

}

module.exports = { dbConnection }