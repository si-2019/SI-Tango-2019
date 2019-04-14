/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ZahtjevZaPotvrdu', {
    idZahtjev: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true
    },
    idStudenta: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
      references: {
        model: 'Korisnik',
        key: 'idkorisnik'
      }
    },
    idSvrhe: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
      references: {
        model: 'SvrhaPotvrde',
        key: 'idsvrhe'
      }
    },
    obradjen: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    datumZahtjeva: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    datumObrade: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    besplatna: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    tableName: 'ZahtjevZaPotvrdu'
  });
};
