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
 * //getThemes/:idPredmeta:
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


app.get('/getComments/:idTeme', function(req, res) {
	var idTeme = req.params.idTeme;
    db.comment.findAll({ where: { idTheme: idTeme } }).then(function (komentariLista) {
			var odgovor = JSON.stringify(komentariLista);
			res.writeHead(200,{"Content-Type":"application/json"});
			res.end(odgovor);
    });
});}

module.exports = initializeEndpoints;