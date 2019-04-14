/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('File', {
    idFile: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true
    },
    idZadatak: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      references: {
        model: 'Zadatak',
        key: 'idzadatak'
      }
    },
    sadrzaj: {
      type: "BLOB",
      allowNull: false
    },
    velicina: {
      type: DataTypes.INTEGER(20),
      allowNull: false
    },
    idTipFile: {
      type: DataTypes.INTEGER(10),
      allowNull: false
    }
  }, {
    tableName: 'File'
  });
};
