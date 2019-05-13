/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Projekat', {
    idProjekat: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true
    },
    idKorisnik: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
      references: {
        model: 'Korisnik',
        key: 'idkorisnik'
      }
    },
    idPredmet: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
      references: {
        model: 'Predmet',
        key: 'idpredmet'
      }
    },
    progress: {
      type: "DOUBLE(20,0)",
      allowNull: true
    },
    opisProjekta: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    moguciBodovi: {
      type: "DOUBLE(10,0)",
      allowNull: true
    }
  }, {
    tableName: 'Projekat'
  });
};
