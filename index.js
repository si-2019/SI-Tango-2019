
const PORT = process.env.PORT || 31919;
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models/db.js');
const endpoints = require('./endpoints.js');
const swaggerDoc = require('./swaggerDoc.js');

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
endpoints(app,db);
swaggerDoc(app);


app.get('/getUser/:idUser', function(req, res) {
	var idUser = req.params.idUser;
	promise = [];
		db.korisnik.findOne({ where: { id: idUser } , attributes: ['id', 'ime', 'prezime','fotografija']}).then(function (user) {
			const blob = user.fotografija;
			var buffer = Buffer.from(blob);
			var bufferBase64 = buffer.toString('base64');
			var url = "data:image/png;base64," + buffer;
			user.fotografija = url;
			res.send(user);		}).catch(function(err){
			console.log(err);
		});
});
app.delete('/deleteTheme/:idTheme', function(req, res) {
	var idTeme = req.params.idTheme;
		db.theme.destroy({ where: { idTheme: idTeme }});
});

app.listen(PORT);
