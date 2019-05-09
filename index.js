
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

app.get('/getThemes/:idPredmeta', function(req, res) {
	var idPredmeta = req.params.idPredmeta;
	var themesResp = [];
	promise = [];
	promise2 = [];
	promise.push(
		db.theme.findAll({ where: { idPredmet: idPredmeta } , attributes: ['idTheme', 'idPredmet', 'idUser','description','title',	'timeCreated' ]}).then(function (themes) {
			themesResp = JSON.parse(JSON.stringify(themes));
			return new Promise();
		}).catch(function(err){})
	);
	Promise.all(promise).then(function (teme){
		themesResp.forEach(t => {
			promise2.push(db.comment.findAll({where: {idTheme: t.idTheme}}).then(function (comment){
				t.brojKomentara = comment.length;
				return new Promise();
			}).catch(function(err){}));
			promise2.push(db.korisnik.findOne({ where: { id: t.idUser } , attributes: ['id', 'ime', 'prezime','fotografija']}).then(function (user) {
				t.korisnik=user;
				return new Promise();
			}).catch(function(err){
			//	console.log(err);
			}));
		});

				
		Promise.all(promise2).then(function(item){
			res.send(themesResp);
		});
	});
});


app.get('/getUser/:idUser', function(req, res) {
	var idUser = req.params.idUser;
	promise = [];
		db.korisnik.findOne({ where: { id: idUser } , attributes: ['id', 'ime', 'prezime','fotografija']}).then(function (user) {
			console.log(user);
			res.send(user);

		}).catch(function(err){
			console.log(err);
		});
});

app.listen(PORT);
