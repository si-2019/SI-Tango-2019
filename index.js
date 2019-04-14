
const PORT = process.env.PORT || 8000;
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models/db.js');

db.sequelize.sync().then(function(){
   console.log("Uspjesno povezano");
}).catch(function(err){
    console.log("Nije uspjesno povezano");
    console.log(err);

 });


const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.listen(PORT);

