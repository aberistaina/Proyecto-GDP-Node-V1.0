import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class ArchivosOportunidadesMejora extends Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('ArchivosOportunidadesMejora', {
    id_archivo: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_oportunidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'oportunidades_mejora',
        key: 'id_oportunidad'
      }
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    s3_key: {
      type: DataTypes.STRING(512),
      allowNull: true
    }
  }, {
    tableName: 'archivos_oportunidades_mejora',
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
        name: "id_oportunidad",
        using: "BTREE",
        fields: [
          { name: "id_oportunidad" },
        ]
      },
    ]
  });
  }
}
