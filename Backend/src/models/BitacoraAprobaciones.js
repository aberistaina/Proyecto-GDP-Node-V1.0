import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class BitacoraAprobaciones extends Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('BitacoraAprobaciones', {
    id_version_proceso: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'version_proceso',
        key: 'id_version_proceso'
      }
    },
    id_aprobador: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'aprobadores',
        key: 'id_aprobador'
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
          { name: "id_aprobador" },
        ]
      },
      {
        name: "id_aprobador",
        using: "BTREE",
        fields: [
          { name: "id_aprobador" },
        ]
      },
    ]
  });
  }
}
