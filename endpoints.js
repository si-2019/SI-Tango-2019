const initializeEndpoints = (app,db) => {
    const Opp = db.Sequelize.Op;
    /**
 * @swagger
 * /addTheme:
 *      post:
 *          description: Dodaje novu temu
 *      parameters:
 *       - name: body
 *         schema:
 *          type: object
 *          properties:
 *            idTheme:
 *             type: string
 *            idPredmeta:
 *             type: string
 *            idUser:
 *             type: string
 *            title:
 *             type: string
 *            descriptions:
 *             type: string
 *            closed:
 *             type: boolean
 *            created:
 *             type: date     
 *         responses:
 *             200:
 *               description: Tema je dodana u bazu
 *             400:
 *               description: Došlo je do greške
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
      }).catch(function(err){
      console.log(err);
    });
});
   /**
 * @swagger
 * /getThemes/:idPredmeta:
 *    get:
 *      description: Vraca temu za predmet sa id-em idPredmeta 
 *    parameters:
 *             - name: params
 *               in: req.params
 *               schema:
 *               type: object
 *               properties:
 *                   idPredmeta:
 *                   type: string
 *               responses:
 *                  200:
 *                      description: Vracena lista tema
 *                  400:
 *                      description: Došlo je do greške

 */
app.get('/getThemes/idPredmeta=:idPredmeta&idUser=:idUser', function(req, res) {
    var idPredmeta = req.params.idPredmeta;
    var idUser = req.params.idUser;

	var themesResp = [];
	promise = [];
	promise2 = [];
	promise.push(
		db.theme.findAll({ where: { idPredmet: idPredmeta } , attributes: ['idTheme', 'idPredmet', 'idUser','description','title',	'timeCreated', 'closed' ]}).then(function (themes) {
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
                const blob = user.fotografija;
                var buffer = Buffer.from(blob);
                var bufferBase64 = buffer.toString('base64');
                var url = "data:image/png;base64," + buffer;
                t.korisnik.fotografija = url;
				return new Promise();
			}).catch(function(err){
			//	console.log(err);
            }));
            promise2.push( db.sticky.findOne({where: {idUser: idUser, idTheme:t.idTheme}}).then(function(sticky) {
                    sticky = JSON.parse(JSON.stringify(sticky));

                    console.log(sticky.set);    
                    if(sticky){
                        console.log("evo");

                        t.sticky = sticky.set;
                    }
                    else t.sticky = false;
                    return new Promise();

              }).catch(function(err){
                  if(err && t.sticky==undefined)
                t.sticky = false;
                }));
		});

				
		Promise.all(promise2).then(function(item){
            themesResp.sort(function(a,b){
                if (a.sticky){
                    return -1;
                }
                else if (b.sticky){
                    return 1;
                }
                return 0;
            });
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
 *          responses:
 *             200:
 *               description: Vracena lista komentara
 *             400:
 *               description: Došlo je do greške
 */
app.get('/getComments/:idTheme', function(req, res) {
    var idTeme = req.params.idTheme;
    console.log("GETc");

    db.comment.findAll({ where: { idTheme: idTeme } }).then(function (komentariLista) {
			var odgovor = JSON.stringify(komentariLista);
			res.writeHead(200,{"Content-Type":"application/json"});
			res.end(odgovor);
    }).catch(function(err){
      console.log(err);
    });
});
 
    /**
 * @swagger
 * /addComment:
 *    post:
 *      description: Dodaje novi komentar
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
 *            responses:
 *             200:
 *               description: Komentar je dodan u bazu
 *             400:
 *               description: Došlo je do greške
 */
app.post('/addComment', function(req, res) {
    console.log(req.body);
    db.comment.create({idUser: req.body.idUser, idTheme: req.body.idTheme, text: req.body.text, timeCreated: Date.now()}).then(function(created) {
          if (created) {
              console.log("Uspjesno kreiran komentar");
              res.end();
          }
          else{
              console.log("Greska");	
          }    	
      }).catch(function(err){
      console.log(err);
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
 *          responses:
 *             200:
 *               description: Tema je zatvorena
 *             400:
 *               description: Došlo je do greške
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
      }).catch(function(err){
      console.log(err);
    });
});

/**
 * @swagger
 * /editTheme:
 *    post:
 *      description: Edituje temu u bazi
 * 	  parameters:
 *      - name: body
 *        in: req.body
 *        schema:
 *          type: object
 *          properties:
 *            idTheme:
 *             type: string
 *            idUser:
 *             type: string
 *            title:
 *             type: string
 *            idPredmet:
 *             type: string
 *            closed:
 *             type: date
 *            responses:
 *             200:
 *               description: Tema je uređena
 *             400:
 *               description: Došlo je do greške
 */
app.post('/editTheme', function(req, res) {
    db.theme.update({
        title: req.body.title,
        description: req.body.description, 
        closed:  req.body.closed,
        idPredmet:req.body.idPredmet,
        idUser:req.body.idUser
    },{
        where: { idTheme: req.body.idTheme },
        returning: true,
        plain: true
      })
      .then(function (result) {
        res.writeHead(200,{"Content-Type":"application/json"});
        res.end();
      }).catch(function(err){
      console.log(err);
    });
});

   /**
 * @swagger
 * /addReply:
 *    post:
 *      description: Dodaje novi odgovor
 *    parameters:
 *        name: body
 *        in: body
 *        schema:
 *          type: object
 *          properties:
 *           idComment:
 *             type: string
 *           idUserCreator:    
 *             type: string
 *           text:
 *             type: string
 *           timeCreated:
 *             type: date
 *          responses:
 *             200:
 *               description: Odgovor je dodan u bazu
 *             400:
 *               description: Došlo je do greške
 */
app.post('/addReply', function(req, res) {
    db.reply.create({idComment: req.body.idComment, idUserCreator: req.body.idUser, text: req.body.text, timeCreated: Date.now()}).then(( created) => {
          if (created) {
              console.log("Uspjesno kreiran odgovor");
          }
          else{
              console.log("Greska");	
          }    	
      }).catch(function(err){
      console.log(err);
    });
});

    /**
 * @swagger
 * /getReplys:
 *    get:
 *      description: Dobavlja odgovore na komentare
 *    parameters:
 *        name: params
 *        in: req.params
 *        schema:
 *          type: object
 *          properties:
 *           idTheme:
 *             type: string
 *          responses:
 *             200:
 *               description: Dohvaćena lista odgovora
 *             400:
 *               description: Došlo je do greške
 */
app.get('/getReplys/:idTheme', function(req, res) {
    var replysResp = [];
    var idTeme = req.params.idTheme;
	promise = [];
    promise2 = [];
    promise3 = [];
    console.log("GETR" + idTeme) ;
	promise.push(
		db.comment.findAll({ where: { idTheme: idTeme } }).then(function (comments) {
			replysResp = JSON.parse(JSON.stringify(comments));
			return new Promise();
		}).catch(function(err){})
	);
	Promise.all(promise).then(function (teme){
		replysResp.forEach(t => {
			promise2.push(db.reply.findAll({where: {idComment: t.idComment}}).then(function (listaOdgovora){
                t.odgovori = JSON.parse(JSON.stringify(listaOdgovora));
                t.odgovori.forEach(y => {

                promise3.push((db.korisnik.findOne({ where: { id: y.idUserCreator } , attributes: ['id', 'ime', 'prezime','fotografija']}).then(function (user) {
                    y.korisnik=user;
                    const blob = user.fotografija;
                    var buffer = Buffer.from(blob);
                    var bufferBase64 = buffer.toString('base64');
                    var url = "data:image/png;base64," + buffer;
                    y.korisnik.fotografija = url;
                    return new Promise();
                }).catch(function(err){
                //	console.log(err);
                })));
            });
				return new Promise();
            }).catch(function(err){}));
            promise2.push(db.korisnik.findOne({ where: { id: t.idUser } , attributes: ['id', 'ime', 'prezime','fotografija']}).then(function (user) {
                t.korisnik=user;
                const blob = user.fotografija;
                var buffer = Buffer.from(blob);
                var bufferBase64 = buffer.toString('base64');
                var url = "data:image/png;base64," + buffer;
                t.korisnik.fotografija = url;
				return new Promise();
			}).catch(function(err){
			//	console.log(err);
            }));
        
		});
		Promise.all(promise2).then(function(item){
            Promise.all(promise3).then(function(item){
                console.log(replysResp);

                res.send(replysResp);
            })
		});
	});
});

   /**
 * @swagger
 * /setSticky:
 *    post:
 *      description: Postavlja temu kao bitnu
 *    parameters:
 *        name: body
 *        in: body
 *        schema:
 *          type: object
 *          properties:
 *           idTheme:
 *             type: string
 *           idUser:    
 *             type: string
 *           responses:
 *             200:
 *               description: Postavljena sticky thema
 *             400:
 *               description: Došlo je do greške
 */
app.post('/setSticky',function(req, res){
  console.log(req.body);
  db.sticky.findOrCreate({where: {idTheme: req.body.idTheme, idUser:req.body.IdUser} , defaults: {set: req.body.sticky}}).then(([user, created]) => {
          if (created) {
              console.log("Uspjesno kreiran sticky");
          }
          else{
              user.update({set: req.body.sticky});
              console.log("Sticky uspjesno update-ovan"); 
          }
          res.writeHead(200,{"Content-Type":"application/json"});
          res.end();
        }).catch(function(err){
      console.log(err);
    });     
});
   /**
 * @swagger
 * /skiniSticky:
 *    post:
 *      description: Postavlja temu kao bitnu
 *    parameters:
 *        name: body
 *        in: body
 *        schema:
 *          type: object
 *          properties:
 *           idTheme:
 *             type: string
 *           idUser:    
 *             type: string
 *          responses:
 *             200:
 *               description: Uklonjena sticky thema
 *             400:
 *               description: Došlo je do greške
 */
app.post('/skiniSticky',function(req, res){
  console.log(req.body);
  db.sticky.findOrCreate({where: {idTheme: req.body.idTheme} , defaults: {idUser: req.body.idUser, set: false}}).then(([user, created]) => {
          if (created) {
              console.log("Uspjesno kreiran sticky");
          }
          else{
              user.update({set: false});
              console.log("Sticky uspjesno update-ovan"); 
          }
          res.writeHead(200,{"Content-Type":"application/json"});
          res.end();
        }).catch(function(err){
      console.log(err);
    });     
});
    /**
 * @swagger
 * /getStickyThemes:
 *    get:
 *      description: Dobavlja teme koje su sticky
 *      responses:
 *             200:
 *               description: Dohvaćena lista sticky thema
 *             400:
 *               description: Došlo je do greške
 */

app.get('/getStickyThemes',function(req, res) {
  db.sticky.findAll({where: {set: true}}).then(function(themes) {
      replysResp = JSON.parse(JSON.stringify(themes));
      res.send(replysResp);
    }).catch(function(err){
      console.log(err);
    });
});



   /**
 * @swagger
 * /searchComment/:commentName:
 *    get:
 *      description: Traži komentare sa datim nazivom
 *      responses:
 *             200:
 *               description: Dohvaćena lista traženih komentara
 *             400:
 *               description: Došlo je do greške
 * 	  parameters:
 *      - name: params
 *        in: req.params
 *        schema:
 *          type: object
 *          properties:
 *            commentName:
 *             type: string
 *      - name: body
 *        in: req.body
 *        schema:
 *          type: object
 *          properties:
 *            idTheme:
 *              type: string
 *            brPaginacije:
 *              type: string
 */
app.get('/searchComment/:commentName', function(req, res) {
    var idTeme = req.body.idTheme;
    var nazivKomentara =  '%' + req.params.commentName + '%';
    var paginacija = req.body.brPaginacije * 10;

    db.comment.findAll({ where: { 
        text: { [Opp.like]:  nazivKomentara  }, idTheme: idTeme } }).then(function (komentariLista) {
        var lista = komentariLista.slice(paginacija - 9, paginacija);
        var odgovor = JSON.stringify(lista);
        res.writeHead(200,{"Content-Type":"application/json"});
        res.end(odgovor);
    }).catch(function(err){
      console.log(err);
    });
});

   /**
 * @swagger
 * /paginacijaComment:
 *    get:
 *      description: Daje komentare u ovisnosti od paginacije
 *      responses:
 *             200:
 *               description: Dohvaćena lista 10 komentara za paginaciju
 *             400:
 *               description: Došlo je do greške
 * 	  parameters:
 *      - name: body
 *        in: req.body
 *        schema:
 *          type: object
 *          properties:
 *            idTheme:
 *              type: string
 *            brPaginacije:
 *              type: string
 */
app.get('/paginacijaComment', function(req, res) {
    var idTeme = req.body.idTheme;
    var paginacija = req.body.brPaginacije * 10;

    db.comment.findAll({ where: { idTheme: idTeme } }).then(function (komentariLista) {
        var lista = komentariLista.slice(paginacija - 10, paginacija);
        var odgovor = JSON.stringify(lista);
        res.writeHead(200,{"Content-Type":"application/json"});
        res.end(odgovor);
    }).catch(function(err){
      console.log(err);
    });
});
   /**
 * @swagger
 * /searchTema/:nazivTeme:
 *    get:
 *      description: Traži teme sa datim nazivom
 *      responses:
 *             200:
 *               description: Lista pronađenih tema sa datim nazivom
 *             400:
 *               description: Došlo je do greške
 * 	  parameters:
 *      - name: params
 *        in: req.params
 *        schema:
 *          type: object
 *          properties:
 *            nazivTeme:
 *             type: string

 */

app.get('/searchTema/:nazivTeme', function(req, res) {
    var naziv =  '%' + req.params.nazivTeme + '%';
    db.theme.findAll({ where: { 
        title: { [Opp.like]:  naziv  } } }).then(function (listaTema) {
        var odgovor = JSON.stringify(listaTema);
        res.writeHead(200,{"Content-Type":"application/json"});
        res.end(odgovor);
    }).catch(function(err){
      console.log(err);
    });
});



    /**
 * @swagger
 * /getCommentsAZ/:idTheme:
 *    get:
 *      description: Dobavlja komentare sortirani A-Z
 *      responses:
 *             200:
 *               description: Lista sortiranih komentara A-Z
 *             400:
 *               description: Došlo je do greške
 * 	  parameters:
 *      - name: params
 *        in: req.params
 *        schema:
 *          type: object
 *          properties:
 *            idTheme:
 *             type: string

 */

app.get('/getCommentsAZ/:idTheme', function(req, res) {
	var idTeme = req.params.idTheme;
    db.comment.findAll({ where: { idTheme: idTeme }, order: ['text']}).then(function (komentariLista) {
			var odgovor = JSON.stringify(komentariLista);
			res.writeHead(200,{"Content-Type":"application/json"});
			res.end(odgovor);
    }).catch(function(err){
      console.log(err);
    });
});

    /**
 * @swagger
 * /getCommentsCreated/:idTheme:
 *    get:
 *      description: Dobavlja komentare sortirane po datumu kreiranja
 *      responses:
 *             200:
 *               description: Lista sortiranih komentara po datumu
 *             400:
 *               description: Došlo je do greške
 * 	  parameters:
 *      - name: params
 *        in: req.params
 *        schema:
 *          type: object
 *          properties:
 *            idTheme:
 *             type: string

 */

app.get('/getCommentsCreated/:idTheme', function(req, res) {
	var idTeme = req.params.idTheme;
    db.comment.findAll({ where: { idTheme: idTeme }, order: ['timeCreated']}).then(function (komentariLista) {
			var odgovor = JSON.stringify(komentariLista);
			res.writeHead(200,{"Content-Type":"application/json"});
			res.end(odgovor);
    }).catch(function(err){
      console.log(err);
    });
});


}
module.exports = initializeEndpoints;