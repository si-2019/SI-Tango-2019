/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Category', {
    idCategory: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true
    },
    CategoryType: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    KeyName: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    DispleyName: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    tableName: 'Category'
  });
};
