import _sequelize from "sequelize";
const { Model } = _sequelize;

export default class ProcesosAprobadores extends Model {
    static init(sequelize, DataTypes) {
        return sequelize.define(
            "ProcesosAprobadores",
            {
                id_proceso: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "procesos",
                        key: "id_proceso",
                    },
                },
                id_cargo: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "cargos",
                        key: "id_cargo",
                    },
                },
            },
            {
                tableName: "procesos_aprobadores",
                timestamps: false,
                indexes: [
                    {
                        name: "PRIMARY",
                        unique: true,
                        using: "BTREE",
                        fields: [{ name: "id_proceso" }, { name: "id_cargo" }],
                    },
                    {
                        name: "id_cargo",
                        using: "BTREE",
                        fields: [{ name: "id_cargo" }],
                    },
                ],
            }
        );
    }
}
