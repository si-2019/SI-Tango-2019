
const Sequelize = require("sequelize");
const sequelize = new Sequelize("TYQcLL35gV","TYQcLL35gV","BLysSj9ZrP",{host:'37.59.55.185',dialect:"mysql",logging:false,  port: 3306,define: {
        timestamps: false
    }
});
const db = {}
db.Sequelize = Sequelize;  
db.sequelize = sequelize;

//import modela
db.comment = sequelize.import(__dirname+'/Comment.js');
db.theme = sequelize.import(__dirname+'/Theme.js');
db.reply = sequelize.import(__dirname+'/Reply.js');
db.sticky = sequelize.import(__dirname+'/Sticky.js');

module.exports=db;
