import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class IntermediaProcesos extends Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('IntermediaProcesos', {
    id_intermedia_procesos: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_bpmn_padre: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: 'procesos',
        key: 'id_bpmn'
      }
    },
    id_bpmn: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: 'procesos',
        key: 'id_bpmn'
      }
    },
    call_activity: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'intermedia_procesos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_intermedia_procesos" },
        ]
      },
      {
        name: "fk_bpmn",
        using: "BTREE",
        fields: [
          { name: "id_bpmn" },
        ]
      },
      {
        name: "fk_bpmn_padre",
        using: "BTREE",
        fields: [
          { name: "id_bpmn_padre" },
        ]
      },
    ]
  });
  }
}
