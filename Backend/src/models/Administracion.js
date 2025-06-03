import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Administracion extends Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('Administracion', {
    id_administrador: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    token_expiracion_login: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    token_expiracion_password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    s3_bucket: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    s3_bucket_procesos: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    s3_bucket_imagenes: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    s3_bucket_adjuntos: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    s3_bucket_documentacion: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'administracion',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_administrador" },
        ]
      },
    ]
  });
  }
}
