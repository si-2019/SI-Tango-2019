/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Zadaca', {
    idZadaca: {
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
    nazivZadace: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    brojZadataka: {
      type: DataTypes.INTEGER(10),
      allowNull: false
    },
    rokZaPredaju: {
      type: DataTypes.DATE,
      allowNull: false
    },
    maxBrojBodova: {
      type: DataTypes.INTEGER(10),
      allowNull: false
    },
    ukupniOstvareniBodovi: {
      type: DataTypes.INTEGER(10),
      allowNull: false
    },
    postavkaZadace: {
      type: "BLOB",
      allowNull: true
    }
  }, {
    tableName: 'Zadaca'
  });
};
