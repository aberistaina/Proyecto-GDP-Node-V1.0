import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Aprobadores extends Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('Aprobadores', {
    id_aprobador: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id_usuario'
      }
    },
    id_version_proceso: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'version_proceso',
          key: 'id_version_proceso'
        }
      },
    estado: {
      type: DataTypes.ENUM('pendiente','rechazado','aprobado'),
      allowNull: true,
      defaultValue: "pendiente"
    },
    ciclo_aprobacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    fecha_aprobación: {
        type: DataTypes.DATE,
        allowNull: true,
    }
  }, {
    tableName: 'aprobadores',
    paranoid: true,
    deletedAt: "fecha_rechazo",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_aprobador" },
        ]
      },
      {
        name: "id_usuario",
        using: "BTREE",
        fields: [
          { name: "id_usuario" },
        ]
      },
      {
          name: "id_version_proceso",
          using: "BTREE",
          fields: [{ name: "id_version_proceso" }]
    }
    ]
  });
  }
}
