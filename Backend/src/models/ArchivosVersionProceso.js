import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class ArchivosVersionProceso extends Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('ArchivosVersionProceso', {
    id_archivo: {
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
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    s3_key: {
      type: DataTypes.STRING(512),
      allowNull: false
    }
  }, {
    tableName: 'archivos_version_proceso',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_archivo" },
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
