import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Cargo extends Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('Cargo', {
    id_cargo: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'cargo',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_cargo" },
        ]
      },
    ]
  });
  }
}
