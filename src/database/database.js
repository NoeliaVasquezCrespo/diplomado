import config  from '../config/env.js';
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
    config.DB_DATABASE, // db name
    config.DB_USER, // db user
    config.DB_PASSWORD, // db password
    {
        host: config.DB_HOST, // db host
        dialect: config.DB_DIALECT, // db dialect
        logging: console.log, // disable logging; default: console.log
    }

);