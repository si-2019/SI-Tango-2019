const initializeEndpoints = (app,db) => {
    /**
 * @swagger
 * /addTheme:
 *    post:
 *      description: Dodaje novu temu
 */
app.post('/addTheme', function(req, res) {
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
   /**
 * @swagger
 * /getThemes/:idPredmeta:
 *    get:
 *      description: Vraca temu za predmet sa id-em idPredmeta 
 */
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

    /**
 * @swagger
 * /getComments/:idTheme:
 *    get:
 *      description: Dobavlja komentare
 * 	  parameters:
 *      - name: params
 *        in: req.params
 *        schema:
 *          type: object
 *          properties:
 *            idTheme:
 *             type: string
 */
app.get('/getComments/:idTheme', function(req, res) {
	var idTeme = req.params.idTheme;
    db.comment.findAll({ where: { idTheme: idTeme } }).then(function (komentariLista) {
			var odgovor = JSON.stringify(komentariLista);
			res.writeHead(200,{"Content-Type":"application/json"});
			res.end(odgovor);
    });
});
 
    /**
 * @swagger
 * /addTheme:
 *    post:
 *      description: Dodaje novu temu
 *    parameters:
 *      - name: body
 *        in: body
 *        schema:
 *          type: object
 *          properties:
 *            idUser:
 *             type: string
 *            idTheme:
 *             type: string
 *            text:
 *             type: string
 *            timeCreated:
 *             type: date
 */
app.post('/addComment', function(req, res) {
    db.comment.create({idUser: req.body.IdUser, idTheme: req.body.IdTheme, text: req.body.text, timeCreated: Date.now()}).then(([user, created]) => {
          if (created) {
              console.log("Uspjesno kreiran komentar");
          }
          else{
              console.log("Greska");	
          }    	
      });
});

    /**
 * @swagger
 * /closeTheme/:idTheme:
 *    post:
 *      description: Zatvara diskusiju na temu
 *    parameters:
 *      - name: body
 *        in: body
 *        schema:
 *          type: object
 *          properties:
 *            idTheme:
 *             type: string
 */
app.post('/closeTheme/:idTheme', function(req, res) {
    db.theme.update({
        closed: true
          }, {
        where: { idTheme: req.params.idTheme },
        returning: true,
        plain: true
      })
      .then(function (result) {
        res.writeHead(200,{"Content-Type":"application/json"});
        res.end();
      });
});
}
module.exports = initializeEndpoints;