import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

export const Usuario = sequelize.define('Usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    password_hash: {
        type: DataTypes.STRING(250),
        allowNull: false,
    },
    id_empresa:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_rol:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 3,
    },
    reset_token: {
        type: DataTypes.TEXT,
    },
    reset_token_expiration: {
        type: DataTypes.DATE  
    }
}, {
    tableName: 'usuarios',
    timestamps: true,
});
