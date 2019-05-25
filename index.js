
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

   /**
 * @swagger
 * /getUser/:idUser:
 *    get:
 *      description: Vraca usera sa id-em idUser 
 *    parameters:
 *             - name: params
 *               in: req.params
 *               schema:
 *               type: object
 *               properties:
 *                   idUser:
 *                   type: string
 *               responses:
 *                  200:
 *                      description: Vracen user
 *                  400:
 *                      description: Došlo je do greške

 */

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

   /**
 * @swagger
 * /deleteTheme/:idTheme:
 *    get:
 *      description: Brise temu sa id-em idTheme 
 *    parameters:
 *             - name: params
 *               in: req.params
 *               schema:
 *               type: object
 *               properties:
 *                   idTheme:
 *                   type: string
 *               responses:
 *                  200:
 *                      description: Vracen user
 *                  400:
 *                      description: Došlo je do greške

 */

app.delete('/deleteTheme/:idTheme', function(req, res) {
	var idTeme = req.params.idTheme;
		db.theme.destroy({ where: { idTheme: idTeme }});
});

app.listen(PORT);
