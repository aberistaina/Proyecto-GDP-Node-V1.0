import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class OportunidadesMejora extends Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('OportunidadesMejora', {
    id_oportunidad: {
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
    id_bpmn: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
    asunto: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'oportunidades_mejora',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_oportunidad" },
        ]
      },
      {
        name: "id_version_proceso",
        using: "BTREE",
        fields: [
          { name: "id_version_proceso" },
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
