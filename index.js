
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

//dodavanje teme
app.post('/addTheme', function(req, res) {
	  console.log("addThemePOST IdPredmeta" + req.body.IdPredmeta);
	  console.log("addThemePOST IdUser "+ req.body.IdUser);
	  console.log("addThemePOST Title "+ req.body.title);
	  console.log("addThemePOST Description"+ req.body.description);
	  console.log("addThemePOST Closed"+ req.body.closed);
	  console.log("addThemePOST TimeCreated"+ req.body.timeCreated);
	  db.theme.findOrCreate({where: {title: req.body.Title} , defaults: {description: req.body.description, closed: false,
	   timeCreated: req.body.timeCreated}}).then(([user, created]) => {
		    if (created) {
		    	console.log("Uspjesno kreirana tema");
		    }
		    else{
		    	console.log("Tema sa datim nazivom vec postoji");	
		    }    	
		});
};

app.listen(PORT);

