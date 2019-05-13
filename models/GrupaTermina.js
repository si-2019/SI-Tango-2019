/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('GrupaTermina', {
    idGrupaTermina: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true
    },
    idPredmet: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      references: {
        model: 'Predmet',
        key: 'idpredmet'
      }
    },
    idPredavac: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      references: {
        model: 'Korisnik',
        key: 'idkorisnik'
      }
    },
    naziv: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'GrupaTermina'
  });
};
