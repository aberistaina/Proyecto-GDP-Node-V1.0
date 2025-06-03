import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class BitacoraAprobaciones extends Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('BitacoraAprobaciones', {
    id_comentario_bitacora: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_version_proceso: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'version_proceso',
        key: 'id_version_proceso'
      }
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id_usuario'
      }
    },
    comentario: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'bitacora_aprobaciones',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_version_proceso" },
          { name: "id_usuario" },
        ]
      }
    ]
  });
  }
}
