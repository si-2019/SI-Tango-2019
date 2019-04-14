/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ClanoviGrupe', {
    idVeza: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true
    },
    idAdministrator: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
      references: {
        model: 'Korisnik',
        key: 'idkorisnik'
      }
    },
    idGrupa: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
      references: {
        model: 'GrupaChat',
        key: 'idgrupa'
      }
    },
    idKorisnik: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
      references: {
        model: 'Korisnik',
        key: 'idkorisnik'
      }
    }
  }, {
    tableName: 'ClanoviGrupe'
  });
};
