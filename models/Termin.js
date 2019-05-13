/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Termin', {
    idTermin: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true
    },
    idPredavac: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      references: {
        model: 'Korisnik',
        key: 'idkorisnik'
      }
    },
    idPredmet: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      references: {
        model: 'Predmet',
        key: 'idpredmet'
      }
    },
    idKabinet: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      references: {
        model: 'Kabinet',
        key: 'idkabinet'
      }
    },
    naziv: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    danUSedmici: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    datum: {
      type: DataTypes.DATE,
      allowNull: true
    },
    trajanje: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    }
  }, {
    tableName: 'Termin'
  });
};
