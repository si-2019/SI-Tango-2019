const assert = require('assert');
const chai = require("chai");
const chaiHttp = require("chai-http");
const fs = require("fs");
const find = require('find');
const path = require('path');

chai.use(chaiHttp);
let should=chai.should();
const BAZ_URL="http://localhost:31919";


describe('Sticky teme',function(){
    it('Dohvata sve teme koje su stavljenje na sticky',function(done){
        chai.request(BAZ_URL).get('/getStickyThemes').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type',/application\/json/);
            console.log(res.body);
            done();
        });
    });
});