import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Usuarios extends Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('Usuarios', {
    id_usuario: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_rol: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id_rol'
      }
    },
    id_cargo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cargo',
        key: 'id_cargo'
      }
    },
    id_jefe_directo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id_usuario'
      }
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    reset_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    reset_token_expiration: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'usuarios',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_usuario" },
        ]
      },
      {
        name: "id_rol",
        using: "BTREE",
        fields: [
          { name: "id_rol" },
        ]
      },
      {
        name: "id_cargo",
        using: "BTREE",
        fields: [
          { name: "id_cargo" },
        ]
      },
      {
        name: "id_jefe_directo",
        using: "BTREE",
        fields: [
          { name: "id_jefe_directo" },
        ]
      },
    ]
  });
  }
}

