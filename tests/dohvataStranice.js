const assert = require('assert');
const chai = require("chai");
const chaiHttp = require("chai-http");
const fs = require("fs");
const find = require('find');
const path = require('path');

chai.use(chaiHttp);
let should=chai.should();
const BAZ_URL="http://localhost:31919";

describe('Provjerava ispravnosti ruta',function(done){
    let stranice=["Tango/Teme","Tango/NovaTema","Tango/Komentar"];
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