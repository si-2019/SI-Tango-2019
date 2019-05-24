const assert = require('assert');
const chai = require("chai");
const chaiHttp = require("chai-http");
const fs = require("fs");
const find = require('find');
const path = require('path');

chai.use(chaiHttp);
let should=chai.should();
const BAZ_URL="http://localhost:8080";
let  probniPdf;
describe('Zadatak 1',function(done){
    let stranice=["login.html","addZadatak.html","addVjezba.html","addStudent.html","addGodina.html","studenti.html","zadaci.html","commiti.html"];
    for(str in stranice){
    it(`dohvata ${stranice[str]}`,function(done){
        chai.request(BAZ_URL).get(`/${stranice[str]}`).end(function(err,res){
            assert.equal(err,null,"Greska, odgovor od servera nije stigao!");
            res.should.have.header('Content-Type',/text\/html.+/);
            done();
        });
    });
    }
});

describe('Zadatak 2',function(done){
    before(function(){
        probniPdf=fs.readFileSync("proba.pdf");
    })
    it(`postavlja zadatak`,function(done){
        let zad='probni'+(new Date()).getTime();
        chai.request(BAZ_URL).post('/addZadatak').field('naziv',zad).attach('postavka',probniPdf,'probni.pdf').end(function(err,res){
            assert.equal(err,null,"Greska, odgovor od servera nije stigao!");
            res.should.have.status(200);
            let fajlovi=find.fileSync(zad+'.pdf',path.join(__dirname,"/.."));
            assert.equal(fajlovi.length,1,"Ne kreira se pdf fajl!");
            done();
        });
    });
});

describe('Zadatak 3',function(){
    it('dohvata Zadatak1',function(done){
        chai.request(BAZ_URL).get('/zadatak').query({naziv:'Zadatak1'}).end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type',/application\/pdf/);
            done();
        });
    });
});

describe('Zadatak 4',function(){
    it('dodaje godinu i vreća status 200',function(done){
        let godina = Math.random()*2060;
        chai.request(BAZ_URL).post('/addGodina').send({nazivGod:`${godina}/${godina+1}`,nazivRepVje:`Vje+${new Date().getTime()}`,nazivRepSpi:`Spi+${new Date().getTime()}`}).end(function(err,res){
            res.should.have.status(200);
            done();
        });
    });
});

describe('Zadatak 5',function(){
    it('vraća json godine',function(done){
        chai.request(BAZ_URL).get('/godine').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header("Content-Type",/application\/json/);
            done();
        });
    });
});

describe('Zadatak 7',function(){
    it('vraća u xml formatu',function(done){
        chai.request(BAZ_URL).get('/zadaci').set('Accept','application/xml').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header("Content-Type",/application\/xml/);
            done();
        });
    });
});