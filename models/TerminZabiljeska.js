/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TerminZabiljeska', {
    idTerminZabiljeska: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true
    },
    idTermin: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
      references: {
        model: 'Termin',
        key: 'idtermin'
      }
    },
    idZabiljeska: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
      references: {
        model: 'Zabiljeska',
        key: 'idzabiljeska'
      }
    }
  }, {
    tableName: 'TerminZabiljeska'
  });
};
