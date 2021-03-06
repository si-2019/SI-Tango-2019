/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Sticky', {
    idSticky: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idTheme: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      references: {
        model: 'Theme',
        key: 'idtheme'
      }
    },
    idUser: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      references: {
        model: 'Korisnik',
        key: 'idkorisnik'
      }
    },
    set: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    tableName: 'Sticky'
  });
};
