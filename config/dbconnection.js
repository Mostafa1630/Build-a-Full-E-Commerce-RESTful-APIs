const mongoose = require('mongoose');

const url = process.env.DB_URL;

const dbConnection = () =>{
  mongoose.connect(url).then((con)=>{
    console.log(`Server connected ${con.connection.host}`);
  })
}

module.exports = dbConnection;