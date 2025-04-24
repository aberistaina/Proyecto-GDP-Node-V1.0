import { DataTypes } from 'sequelize';
import { sequelize } from "../database/database.js";

export const Rol = sequelize.define("Rol", {
    id_rol: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
}, {
    tableName: "roles",
    timestamps: true,
});
