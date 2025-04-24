import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Procesos = sequelize.define("Procesos", {
    idProceso: {
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    ruta: {
        type: DataTypes.TEXT,
        allowNull: false
    },
}, {
    tableName: "procesos",
    timestamps: true,
});
