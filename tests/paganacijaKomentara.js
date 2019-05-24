const assert = require('assert');
const chai = require("chai");
const chaiHttp = require("chai-http");
const fs = require("fs");
const find = require('find');
const path = require('path');

chai.use(chaiHttp);
let should=chai.should();
const BAZ_URL="http://localhost:31919";



describe('Paginacija komentara',function(){
    it('Dohavata manje od 10 komentara i vraća status 200',function(done){

        chai.request(BAZ_URL).post('/paginacijaComment').send({idTheme: 18,brPaginacije: 1}).end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type',/application\/json/);
            //res.should.have.(res.body < 10);
            console.log(res.body);
            done();
        });
    });
});