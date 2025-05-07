import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Token extends Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('Token', {
    id_token: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id_usuario'
      }
    },
    token: {
      type: DataTypes.STRING(512),
      allowNull: false
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    tableName: 'token',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_token" },
        ]
      },
      {
        name: "id_usuario",
        using: "BTREE",
        fields: [
          { name: "id_usuario" },
        ]
      },
    ]
  });
  }
}
