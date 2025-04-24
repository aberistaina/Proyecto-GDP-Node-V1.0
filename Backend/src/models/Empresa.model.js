import { DataTypes } from 'sequelize';
import { sequelize } from "../database/database.js";

export const Empresa = sequelize.define("Empresa", {
    id_empresa: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
}, {
    tableName: "empresa",
    timestamps: true,
});
