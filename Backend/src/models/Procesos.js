import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Procesos extends Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('Procesos', {
    id_proceso: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_creador: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id_usuario'
      }
    },
    id_nivel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'niveles',
        key: 'id_nivel'
      }
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    estado: {
      type: DataTypes.ENUM('borrador','activo','archivado'),
      allowNull: true,
      defaultValue: "borrador"
    },
    macroproceso: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    id_bpmn: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "id_bpmn"
    }
  }, {
    tableName: 'procesos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_proceso" },
        ]
      },
      {
        name: "id_bpmn",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_bpmn" },
        ]
      },
      {
        name: "id_creador",
        using: "BTREE",
        fields: [
          { name: "id_creador" },
        ]
      },
      {
        name: "id_nivel",
        using: "BTREE",
        fields: [
          { name: "id_nivel" },
        ]
      },
    ]
  });
  }
}
