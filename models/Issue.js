/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Issue', {
    idIssue: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true
    },
    idStudent: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      references: {
        model: 'Korisnik',
        key: 'idkorisnik'
      }
    },
    idIssueType: {
      type: DataTypes.INTEGER(10),
      allowNull: false
    },
    idIssueCategory: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    message: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    DateCreated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    DateModified: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'Issue'
  });
};
