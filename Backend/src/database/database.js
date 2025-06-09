import Sequelize from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

//Conexión a la Base de Datos

const database = process.env.DB_DATABASE
const usuario = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host = process.env.APP_MODE === "desarrollo" ? process.env.DB_HOST_LOCAL : process.env.DB_HOST_PRODUCCION
console.log(host);
export const sequelize = new Sequelize(database, usuario, password, {
    host: host,
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 3000,
    },
    logging: false
});
