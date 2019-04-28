
const PORT = process.env.PORT || 31919;
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


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/addTheme', function(req, res) {
	  console.log("addThemePOST IdPredmeta" + req.body.IdPredmeta);
	  console.log("addThemePOST IdUser "+ req.body.IdUser);
	  console.log("addThemePOST Title "+ req.body.title);
	  console.log("addThemePOST Description"+ req.body.description);

	  console.log("addThemePOST TimeCreated"+ req.body.timeCreated);
	  db.theme.findOrCreate({where: {title: req.body.title} , defaults: {description: req.body.description, closed: false,
	   timeCreated:Date.now(), idPredmet:req.body.IdPredmeta,idUser:req.body.IdUser}}).then(([user, created]) => {
		    if (created) {
		    	console.log("Uspjesno kreirana tema");
		    }
		    else{
		    	console.log("Tema sa datim nazivom vec postoji");	
		    }    	
		});
});

app.listen(PORT);
