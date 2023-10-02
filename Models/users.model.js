const {DataTypes} = require('sequelize');
const db = require('../Config/database.js');

const Users = db.define('user_datas', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 35]
        }
    },
    nickname: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '-',
        validate : {
            notEmpty: true,
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate : {
            notEmpty: true,
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '-',
        validate : {
            notEmpty: true,
            len: [4, 100 ]
        }
    },
    verifiedCode: {
        type: DataTypes.STRING,
        allowNull: true
    }
});


module.exports = Users;