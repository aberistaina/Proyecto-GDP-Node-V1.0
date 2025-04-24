import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const CallActivity = sequelize.define("CallActivity", {
    idProceso: {
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true
    },
    idSubProceso: {
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true
    },
    callActivity: {
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true
    },

}, {
    tableName: "callActivity",
    timestamps: true,
});
