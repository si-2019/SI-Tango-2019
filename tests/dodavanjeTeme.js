const assert = require('assert');
const chai = require("chai");
const chaiHttp = require("chai-http");
const fs = require("fs");
const find = require('find');
const path = require('path');

chai.use(chaiHttp);
let should=chai.should();
const BAZ_URL="http://localhost:31919";



describe('Provjera dodavanja teme',function(){
    it('Dodaje temu i vraća status 200',function(done){
        let tem = Math.random()*2060;
        chai.request(BAZ_URL).post('/addTheme').send({title:`${tem}`,description:`Opis teme`,IdPredmeta: 1,IdUser: 1}).end(function(err,res){
            res.should.have.status(200);
            done();
        });
    });
});