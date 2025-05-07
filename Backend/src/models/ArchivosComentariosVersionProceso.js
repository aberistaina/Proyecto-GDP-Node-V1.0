import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class ArchivosComentariosVersionProceso extends Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('ArchivosComentariosVersionProceso', {
    id_archivo: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_comentario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'comentarios_version_proceso',
        key: 'id_comentario'
      }
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    s3_key: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    s3_bucket: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'archivos_comentarios_version_proceso',
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
        name: "id_comentario",
        using: "BTREE",
        fields: [
          { name: "id_comentario" },
        ]
      },
    ]
  });
  }
}
