import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class VersionProceso extends Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('VersionProceso', {
    id_version_proceso: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_proceso: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'procesos',
        key: 'id_proceso'
      }
    },
    id_creador: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id_usuario'
      }
    },
    nombre_version: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    observacion_version: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    estado: {
      type: DataTypes.ENUM('borrador','enviado','aprobado','eliminado', 'inactivo', 'rechazado'),
      allowNull: true,
      defaultValue: "borrador"
    },
    s3_key: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    id_bpmn: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    fecha_aprobación: {
        type: DataTypes.DATE,
        allowNull: true,
    }
  }, {
    tableName: 'version_proceso',
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
        ]
      },
      {
        name: "id_proceso",
        using: "BTREE",
        fields: [
          { name: "id_proceso" },
        ]
      },
      {
        name: "id_creador",
        using: "BTREE",
        fields: [
          { name: "id_creador" },
        ]
      }
    ]
  });
  }
}
