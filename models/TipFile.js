/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TipFile', {
    idTipFile: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true
    },
    tipFile: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    idFile: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
      references: {
        model: 'File',
        key: 'idfile'
      }
    }
  }, {
    tableName: 'TipFile'
  });
};
