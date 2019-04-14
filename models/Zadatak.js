/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Zadatak', {
    idZadatak: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true
    },
    idZadaca: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      references: {
        model: 'Zadaca',
        key: 'idzadaca'
      }
    },
    nazivZadatka: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    maxBrojBodova: {
      type: DataTypes.INTEGER(10),
      allowNull: false
    },
    brojOstvarenihBodova: {
      type: DataTypes.INTEGER(10),
      allowNull: false
    },
    profesorovKomentar: {
      type: DataTypes.STRING(1024),
      allowNull: true
    },
    datumPredaje: {
      type: DataTypes.DATE,
      allowNull: false
    },
    statusZadatka: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    tableName: 'Zadatak'
  });
};
