import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js'; // Importing the sequelize instance
import { Status } from '../constants/index.js'; // Importing the Status enum
import { Task } from '../models/task.js'; // Importing the Task model
import { encriptar } from '../common/bcrypt.js'; // Importing the encriptar function

export const User = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: 'Username must be unique'
        },
        validate: {
            notNull: {
                msg: 'Username is required'
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Password is required'
            }
        }
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: Status.ACTIVE,
        validate: {
            isIn: {
                args: [[Status.ACTIVE, Status.INACTIVE]],
                msg: `Status must be ${Status.ACTIVE} or ${Status.INACTIVE}`
            }
        }
    },
});    

User.hasMany(Task)
Task.belongsTo(User)

User.beforeCreate(async(user) => {
    try {
        user.password = await encriptar(user.password);
    } catch (error){
        next(error);

    }
});

