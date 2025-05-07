import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Niveles extends Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('Niveles', {
    id_nivel: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'niveles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_nivel" },
        ]
      },
    ]
  });
  }
}
